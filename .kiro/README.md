# Kiro Configuration - Calculadora de Trigonometria

Este diretório contém toda a configuração do Kiro para facilitar manutenção e desenvolvimento do projeto.

## 📁 Estrutura

### `/steering/` - Regras e Guias
Documentação sempre incluída no contexto do agente:

- **project-overview.md**: Visão geral completa do projeto (arquitetura, stack, URLs, estrutura)
- **coding-standards.md**: Padrões de código para backend e frontend
- **deployment-guide.md**: Guia completo de deploy (Vercel + Railway)

### `/specs/` - Especificações de Features
Templates para adicionar novas funcionalidades:

- **add-new-user-role/**: Como adicionar um novo tipo de usuário
  - `requirements.md`: Requisitos e casos de uso
  - `design.md`: Arquitetura e implementação
  - `tasks.md`: Checklist de tarefas

- **add-new-calculation-feature/**: Como adicionar nova funcionalidade de cálculo
  - `requirements.md`: Requisitos e exemplos

### `/skills/` - Skills do Agente
Conhecimento especializado:

- **trig-calculator-expert.md**: Expert em manutenção do projeto
  - Conhecimento completo do projeto
  - Comandos úteis
  - Troubleshooting comum
  - Padrões de código

### Outros Arquivos

- **cleanup-checklist.md**: Checklist de limpeza de arquivos desnecessários

## 🚀 Como Usar

### Para Adicionar Nova Funcionalidade

1. Escolha a spec apropriada em `/specs/`
2. Leia `requirements.md` para entender o escopo
3. Leia `design.md` para ver a arquitetura
4. Siga `tasks.md` para implementar

### Para Fazer Deploy

1. Leia `/steering/deployment-guide.md`
2. Siga o workflow de deploy automático
3. Verifique troubleshooting se necessário

### Para Entender o Projeto

1. Comece com `/steering/project-overview.md`
2. Leia `/steering/coding-standards.md` para padrões
3. Use `/skills/trig-calculator-expert.md` como referência rápida

## 📝 Convenções

### Steering Files
- Sempre incluídos no contexto
- Mantém informações essenciais
- Atualizar quando arquitetura mudar

### Specs
- Um diretório por feature
- Sempre ter: requirements.md, design.md, tasks.md
- Seguir formato estabelecido

### Skills
- Conhecimento especializado
- Comandos e troubleshooting
- Referência rápida

## 🔄 Manutenção

### Quando Atualizar

**project-overview.md**:
- Mudança de stack
- Nova URL de produção
- Mudança de estrutura
- Novo tipo de usuário

**coding-standards.md**:
- Novos padrões adotados
- Mudança de convenções
- Novas ferramentas

**deployment-guide.md**:
- Mudança de plataforma
- Novas variáveis de ambiente
- Novo processo de deploy

**Skills**:
- Novos comandos úteis
- Novo troubleshooting
- Mudanças significativas

## 📚 Recursos Adicionais

- Documentação principal: `/docs/`
- Código fonte: `/backend/` e `/frontend/`
- Testes: `/backend/tests/` e `/frontend/src/**/*.test.ts`

## 🎯 Próximos Passos

1. Familiarize-se com `/steering/project-overview.md`
2. Leia `/steering/coding-standards.md`
3. Explore as specs em `/specs/`
4. Use `/skills/trig-calculator-expert.md` como referência

---

**Última atualização**: 2026-03-11
**Versão**: 1.0.0
