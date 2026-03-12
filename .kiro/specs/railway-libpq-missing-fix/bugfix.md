# Bugfix Requirements Document

## Introduction

O backend FastAPI está crashando no Railway durante o startup com `ImportError: libpq.so.5: cannot open shared object file: No such file or directory`. Este erro ocorre quando o uvicorn tenta importar o psycopg2 para conectar ao PostgreSQL. O problema é causado pela ausência da biblioteca nativa libpq (PostgreSQL client library) no ambiente Railway, apesar do nixpacks.toml declarar postgresql como dependência e o requirements.txt usar psycopg2-binary (que deveria incluir as bibliotecas nativas).

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN o backend é deployado no Railway e o uvicorn tenta iniciar THEN o sistema crasha com ImportError indicando que libpq.so.5 não pode ser encontrado

1.2 WHEN o psycopg2 tenta carregar suas dependências nativas durante a importação THEN o sistema falha porque a biblioteca libpq.so.5 não está disponível no ambiente

1.3 WHEN o nixpacks.toml declara postgresql como nixPkg THEN o sistema não instala corretamente as bibliotecas de desenvolvimento necessárias para o psycopg2

### Expected Behavior (Correct)

2.1 WHEN o backend é deployado no Railway e o uvicorn tenta iniciar THEN o sistema SHALL iniciar com sucesso sem erros de ImportError relacionados ao libpq

2.2 WHEN o psycopg2 tenta carregar suas dependências nativas durante a importação THEN o sistema SHALL encontrar todas as bibliotecas necessárias (libpq.so.5) e importar com sucesso

2.3 WHEN o nixpacks.toml declara as dependências corretas do PostgreSQL THEN o sistema SHALL instalar todas as bibliotecas nativas necessárias para o psycopg2 funcionar

### Unchanged Behavior (Regression Prevention)

3.1 WHEN o backend conecta ao PostgreSQL após o startup bem-sucedido THEN o sistema SHALL CONTINUE TO estabelecer conexões com o banco de dados corretamente

3.2 WHEN o backend executa queries SQL através do SQLAlchemy/psycopg2 THEN o sistema SHALL CONTINUE TO executar as queries sem erros

3.3 WHEN o backend roda localmente em ambiente de desenvolvimento THEN o sistema SHALL CONTINUE TO funcionar normalmente sem mudanças no comportamento

3.4 WHEN o DATABASE_URL é configurado com postgresql:// ou postgresql+psycopg2:// THEN o sistema SHALL CONTINUE TO processar a connection string corretamente
