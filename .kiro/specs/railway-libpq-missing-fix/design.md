# Railway libpq Missing Fix - Bugfix Design

## Overview

O backend FastAPI está crashando no Railway durante o startup com `ImportError: libpq.so.5: cannot open shared object file`. Este erro ocorre quando o uvicorn tenta importar o psycopg2 para conectar ao PostgreSQL. Apesar do `nixpacks.toml` declarar `postgresql` como dependência e o `requirements.txt` usar `psycopg2-binary==2.9.9` (que deveria incluir bibliotecas nativas empacotadas), o Railway não está fornecendo a biblioteca nativa libpq necessária. A estratégia de fix envolve especificar a versão exata do PostgreSQL no nixpacks (`postgresql_15`) para garantir que as bibliotecas de desenvolvimento corretas sejam instaladas no ambiente Nix.

## Glossary

- **Bug_Condition (C)**: A condição que dispara o bug - quando o uvicorn tenta iniciar e importar psycopg2 no ambiente Railway
- **Property (P)**: O comportamento desejado - o backend deve iniciar com sucesso e conectar ao PostgreSQL sem erros de ImportError
- **Preservation**: Comportamento existente de conexão ao banco de dados e execução de queries que deve permanecer inalterado após o fix
- **libpq.so.5**: Biblioteca nativa do PostgreSQL client necessária para o psycopg2 funcionar
- **psycopg2-binary**: Pacote Python que deveria incluir bibliotecas nativas, mas depende de libpq estar disponível no sistema
- **nixpacks.toml**: Arquivo de configuração do Nixpacks (build system do Railway) que declara dependências do sistema
- **Nixpacks**: Sistema de build usado pelo Railway que usa Nix package manager para instalar dependências
- **LD_LIBRARY_PATH**: Variável de ambiente que especifica onde o sistema deve procurar por bibliotecas compartilhadas (.so files)

## Bug Details

### Bug Condition

O bug manifesta quando o uvicorn tenta iniciar o backend FastAPI no Railway e o Python tenta importar o módulo psycopg2. O psycopg2-binary tenta carregar a biblioteca nativa libpq.so.5, mas ela não está disponível no ambiente, causando um ImportError que impede o startup completo da aplicação.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DeploymentContext
  OUTPUT: boolean
  
  RETURN input.environment == "Railway"
         AND input.buildSystem == "Nixpacks"
         AND input.nixpacks_config.nixPkgs CONTAINS "postgresql" (generic)
         AND input.requirements CONTAINS "psycopg2-binary"
         AND NOT systemHasLibrary("libpq.so.5")
         AND uvicornStartupAttempted()
END FUNCTION
```

### Examples

- **Exemplo 1**: Deploy no Railway com nixpacks.toml contendo `nixPkgs = ["postgresql"]` → uvicorn inicia → importa app.main → importa app.db → importa psycopg2 → ImportError: libpq.so.5 not found → crash
- **Exemplo 2**: Deploy no Railway sem especificar versão do PostgreSQL → Nixpacks instala postgresql genérico → bibliotecas de desenvolvimento não são linkadas corretamente → libpq.so.5 não encontrado → crash
- **Exemplo 3**: Deploy no Railway com psycopg2-binary (que deveria ser standalone) → psycopg2-binary ainda depende de libpq do sistema → libpq.so.5 não encontrado → crash
- **Edge Case**: Deploy local com Docker ou ambiente de desenvolvimento → libpq geralmente está instalado → funciona normalmente (não dispara o bug)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- A conexão ao PostgreSQL após o startup bem-sucedido deve continuar funcionando exatamente como antes
- A execução de queries SQL através do SQLAlchemy/psycopg2 deve continuar funcionando sem erros
- O comportamento em ambiente de desenvolvimento local deve permanecer inalterado
- O processamento de DATABASE_URL com postgresql:// ou postgresql+psycopg2:// deve continuar funcionando corretamente
- A criação automática de tabelas no startup (create_db_and_tables) deve continuar funcionando
- O pool de conexões e configurações do SQLAlchemy devem permanecer inalterados

**Scope:**
Todos os inputs que NÃO envolvem o startup inicial do uvicorn no Railway devem ser completamente não afetados por este fix. Isso inclui:
- Requisições HTTP após o servidor estar rodando
- Operações de banco de dados (queries, inserts, updates, deletes)
- Autenticação e autorização
- Lógica de negócio (cálculos trigonométricos, gerenciamento de usuários)
- Ambiente de desenvolvimento local

## Hypothesized Root Cause

Baseado na descrição do bug e análise dos arquivos de configuração, as causas mais prováveis são:

1. **Versão Genérica do PostgreSQL no Nixpacks**: O `nixpacks.toml` atual usa `nixPkgs = ["postgresql"]` sem especificar versão. O Nix pode estar instalando apenas os binários do PostgreSQL sem as bibliotecas de desenvolvimento necessárias. Solução: usar `postgresql_15` (versão específica que inclui libs de desenvolvimento).

2. **LD_LIBRARY_PATH Não Configurado**: Mesmo que o Nixpacks instale o PostgreSQL, o Python pode não estar encontrando libpq.so.5 porque o caminho das bibliotecas Nix não está no LD_LIBRARY_PATH. Solução: adicionar variável de ambiente apontando para `/nix/store/.../lib`.

3. **psycopg2-binary Incompatibilidade**: O psycopg2-binary pode não ser totalmente standalone no ambiente Nix do Railway, ainda dependendo de libpq do sistema. Solução: trocar para `psycopg2` (sem binary) e garantir que `postgresql_15` com libs de desenvolvimento esteja instalado.

4. **Root Directory Não Configurado**: O Railway pode não estar encontrando o `nixpacks.toml` porque o Root Directory não está configurado como `backend`. Solução: verificar configuração do Railway (mas isso é configuração manual, não código).

## Correctness Properties

Property 1: Bug Condition - Backend Startup Success

_For any_ deployment no Railway onde o uvicorn tenta iniciar e importar psycopg2, o backend fixado SHALL iniciar com sucesso sem ImportError relacionado ao libpq.so.5, permitindo que o servidor fique disponível para receber requisições HTTP.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Database Operations

_For any_ operação de banco de dados (conexão, query, insert, update, delete) após o startup bem-sucedido, o código fixado SHALL produzir exatamente o mesmo resultado que o código original, preservando toda a funcionalidade de persistência de dados, autenticação, e lógica de negócio.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assumindo que nossa análise de causa raiz está correta, as mudanças necessárias são:

**File**: `backend/nixpacks.toml`

**Function**: Configuração de dependências do sistema

**Specific Changes**:

1. **Especificar Versão do PostgreSQL**: Trocar `postgresql` genérico por `postgresql_15` para garantir que as bibliotecas de desenvolvimento sejam instaladas
   - Linha atual: `nixPkgs = ["postgresql"]`
   - Linha nova: `nixPkgs = ["postgresql_15"]`
   - Justificativa: Versões específicas do PostgreSQL no Nix incluem as bibliotecas de desenvolvimento (libpq-dev)

2. **Adicionar Variável de Ambiente LD_LIBRARY_PATH (Opcional)**: Se a mudança acima não resolver, adicionar configuração de LD_LIBRARY_PATH
   - Adicionar seção: `[phases.setup]` com `nixLibs = true` ou variável de ambiente explícita
   - Justificativa: Garante que o Python encontre as bibliotecas .so no /nix/store

3. **Alternativa - Trocar psycopg2-binary por psycopg2**: Se as mudanças acima não resolverem, considerar trocar o pacote
   - File: `backend/requirements.txt`
   - Linha atual: `psycopg2-binary==2.9.9`
   - Linha nova: `psycopg2==2.9.9`
   - Adicionar ao nixpacks.toml: `nixPkgs = ["postgresql_15", "gcc"]`
   - Justificativa: psycopg2 (sem binary) compila contra as libs do sistema, garantindo compatibilidade

4. **Verificar Root Directory no Railway**: Garantir que o Railway está usando `backend` como Root Directory
   - Isso é configuração manual no dashboard do Railway, não código
   - Justificativa: O Railway precisa encontrar o nixpacks.toml no diretório correto

5. **Limpar Build Cache**: Após fazer as mudanças, limpar o cache de build no Railway
   - Isso é ação manual no dashboard do Railway
   - Justificativa: Garante que o Nixpacks use a nova configuração

## Testing Strategy

### Validation Approach

A estratégia de testes segue uma abordagem de duas fases: primeiro, reproduzir o bug no ambiente Railway (ou ambiente similar) para confirmar a causa raiz, depois verificar que o fix funciona corretamente e preserva o comportamento existente.

### Exploratory Bug Condition Checking

**Goal**: Reproduzir o bug ANTES de implementar o fix para confirmar ou refutar a análise de causa raiz. Se refutarmos, precisaremos re-hipotizar.

**Test Plan**: Tentar fazer deploy no Railway com a configuração atual e observar os logs de erro. Analisar exatamente onde o ImportError ocorre e qual biblioteca está faltando. Testar localmente com Docker usando imagem Nix para simular o ambiente Railway.

**Test Cases**:
1. **Railway Deploy com Config Atual**: Deploy no Railway com `nixPkgs = ["postgresql"]` → observar ImportError nos logs → confirmar que libpq.so.5 não é encontrado (vai falhar no código não fixado)
2. **Local Docker com Nix**: Criar Dockerfile usando Nix com postgresql genérico → tentar iniciar uvicorn → observar se o mesmo erro ocorre (vai falhar no código não fixado)
3. **Verificar Bibliotecas Instaladas**: No ambiente Railway, usar comando `ldd` ou `find` para verificar se libpq.so.5 existe no sistema (vai mostrar que não existe)
4. **Testar com postgresql_15**: Deploy no Railway com `nixPkgs = ["postgresql_15"]` → observar se libpq.so.5 é instalado → verificar se uvicorn inicia (deve funcionar no código fixado)

**Expected Counterexamples**:
- ImportError: libpq.so.5: cannot open shared object file: No such file or directory
- Possíveis causas confirmadas: postgresql genérico não instala libs de desenvolvimento, LD_LIBRARY_PATH não configurado, psycopg2-binary incompatível com Nix

### Fix Checking

**Goal**: Verificar que para todos os inputs onde a condição de bug existe (deploy no Railway), o backend fixado inicia com sucesso.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := deployBackend_fixed(input)
  ASSERT result.startupSuccess == true
  ASSERT result.uvicornRunning == true
  ASSERT result.healthEndpointResponds == true
  ASSERT NOT result.logs.contains("ImportError")
  ASSERT NOT result.logs.contains("libpq.so.5")
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde a condição de bug NÃO existe (operações após startup, ambiente local), o código fixado produz o mesmo resultado que o código original.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT backendOperation_original(input) = backendOperation_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing é recomendado para preservation checking porque:
- Gera muitos casos de teste automaticamente através do domínio de entrada
- Captura edge cases que testes unitários manuais podem perder
- Fornece garantias fortes de que o comportamento permanece inalterado para todas as operações não relacionadas ao bug

**Test Plan**: Observar comportamento no código NÃO FIXADO primeiro para operações de banco de dados e requisições HTTP, depois escrever property-based tests capturando esse comportamento.

**Test Cases**:
1. **Database Connection Preservation**: Observar que conexões ao PostgreSQL funcionam no código não fixado (após startup manual bem-sucedido), depois verificar que continuam funcionando após o fix
2. **Query Execution Preservation**: Observar que queries SQL funcionam corretamente no código não fixado, depois verificar que continuam funcionando após o fix
3. **Authentication Preservation**: Observar que login/JWT funcionam no código não fixado, depois verificar que continuam funcionando após o fix
4. **Business Logic Preservation**: Observar que cálculos trigonométricos funcionam no código não fixado, depois verificar que continuam funcionando após o fix

### Unit Tests

- Testar que o backend inicia com sucesso no Railway após o fix
- Testar que o endpoint `/health` responde corretamente após o fix
- Testar que a importação de psycopg2 não gera ImportError
- Testar edge cases (DATABASE_URL com diferentes formatos, postgresql:// vs postgresql+psycopg2://)

### Property-Based Tests

- Gerar estados aleatórios de banco de dados e verificar que operações CRUD funcionam corretamente
- Gerar requisições HTTP aleatórias e verificar que o comportamento é preservado
- Testar que todas as operações não relacionadas ao startup continuam funcionando através de muitos cenários

### Integration Tests

- Testar fluxo completo: deploy no Railway → startup → health check → login → cálculo trigonométrico → salvar no banco
- Testar switching entre ambientes (local SQLite vs Railway PostgreSQL)
- Testar que logs não contêm erros de ImportError após o fix
