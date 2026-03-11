# Spec: Adicionar Novo Tipo de Usuário

## 📋 Requisitos

### Objetivo
Adicionar um novo tipo de usuário ao sistema (ex: "Teacher_User", "Student_User", etc).

### Contexto
Atualmente o sistema tem dois tipos de usuário:
- `Admin_User`: Acesso total
- `Common_User`: Acesso básico

### Requisitos Funcionais

1. **Novo Role no Backend**
   - Adicionar novo role no modelo User
   - Atualizar validação de roles
   - Criar permissões específicas para o novo role

2. **Novo Role no Frontend**
   - Atualizar interface User no AuthContext
   - Adicionar rotas protegidas para o novo role
   - Criar UI específica se necessário

3. **Migração de Dados**
   - Script para atualizar usuários existentes se necessário

### Requisitos Não-Funcionais
- Não quebrar funcionalidade existente
- Manter compatibilidade com usuários atuais
- Documentar novo role

### Casos de Uso

**UC1: Criar usuário com novo role**
- Admin cria usuário com novo role
- Sistema valida e salva no banco
- Usuário pode fazer login

**UC2: Acessar funcionalidades do novo role**
- Usuário faz login
- Sistema identifica role
- Redireciona para página apropriada
- Mostra UI específica do role

### Critérios de Aceitação
- [ ] Novo role adicionado no modelo User
- [ ] Validação de role funciona
- [ ] Frontend reconhece novo role
- [ ] Rotas protegidas funcionam
- [ ] Testes passando
- [ ] Documentação atualizada
