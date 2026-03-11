# Tasks: Adicionar Novo Tipo de Usuário

## Backend Tasks

- [ ] 1. Atualizar modelo User
  - [ ] 1.1 Adicionar novo role no enum/validação
  - [ ] 1.2 Atualizar docstring

- [ ] 2. Atualizar schemas
  - [ ] 2.1 Criar enum UserRole
  - [ ] 2.2 Atualizar UserCreate schema
  - [ ] 2.3 Atualizar UserResponse schema

- [ ] 3. Criar middleware de autorização
  - [ ] 3.1 Implementar decorator require_role
  - [ ] 3.2 Adicionar testes para middleware

- [ ] 4. Criar rotas específicas do novo role
  - [ ] 4.1 Criar route_handler para novo role
  - [ ] 4.2 Adicionar rotas protegidas
  - [ ] 4.3 Implementar lógica de negócio

- [ ] 5. Testes
  - [ ] 5.1 Testar criação de usuário com novo role
  - [ ] 5.2 Testar acesso a rotas protegidas
  - [ ] 5.3 Testar negação de acesso

## Frontend Tasks

- [ ] 6. Atualizar AuthContext
  - [ ] 6.1 Adicionar novo role na interface User
  - [ ] 6.2 Atualizar type guards se necessário

- [ ] 7. Atualizar ProtectedRoute
  - [ ] 7.1 Adicionar novo role no type
  - [ ] 7.2 Testar validação de role

- [ ] 8. Criar página para novo role
  - [ ] 8.1 Criar componente da página
  - [ ] 8.2 Adicionar rota no main.tsx
  - [ ] 8.3 Implementar UI específica

- [ ] 9. Atualizar LoginPage
  - [ ] 9.1 Adicionar lógica de redirect para novo role
  - [ ] 9.2 Testar redirect

- [ ] 10. Atualizar Navbar
  - [ ] 10.1 Adicionar links específicos do novo role
  - [ ] 10.2 Mostrar/ocultar baseado no role

## Documentação Tasks

- [ ] 11. Atualizar documentação
  - [ ] 11.1 Atualizar ARCHITECTURE.md
  - [ ] 11.2 Atualizar README.md
  - [ ] 11.3 Atualizar project-overview.md

## Deploy Tasks

- [ ] 12. Deploy
  - [ ] 12.1 Commit e push para GitHub
  - [ ] 12.2 Verificar deploy automático Vercel
  - [ ] 12.3 Verificar deploy automático Railway
  - [ ] 12.4 Testar em produção
