# Skill: Trig Calculator Expert

## Descrição
Expert em manutenção e desenvolvimento da Calculadora de Trigonometria.

## Conhecimento do Projeto

### Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI + SQLModel + PostgreSQL
- **Deploy**: Vercel (frontend) + Railway (backend + database)

### URLs
- Frontend: https://trig-calculator-ashy.vercel.app
- Backend: https://trig-calculator-production.up.railway.app

### Estrutura
```
trig-calculator/
├── backend/              # FastAPI
│   ├── app/
│   │   ├── db.py        # Database config
│   │   ├── main.py      # Main app
│   │   ├── models.py    # SQLModel models
│   │   ├── schemas.py   # Pydantic schemas
│   │   ├── routes.py    # Main routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── route_handlers/  # Route handlers
│   │   └── services/    # Business logic
│   └── tests/           # Pytest tests
├── frontend/            # React + Vite
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Auth context
│       ├── lib/         # Utils
│       ├── pages/       # Pages
│       └── styles/      # CSS
└── docs/                # Documentation
```

### Autenticação
- JWT tokens no localStorage
- Dois roles: Admin_User, Common_User
- Middleware valida token em rotas protegidas

### Banco de Dados
- **users**: id, username, password_hash, role, created_at, updated_at, last_login
- **calculations**: id, user_id, angle, unit, sin_value, cos_value, tan_value, created_at

## Comandos Úteis

### Backend
```bash
# Instalar dependências
cd backend
pip install -r requirements.txt

# Rodar localmente
uvicorn app.main:app --reload

# Rodar testes
pytest

# Criar admin
python seed_admin.py
```

### Frontend
```bash
# Instalar dependências
cd frontend
npm install

# Rodar localmente
npm run dev

# Build
npm run build

# Rodar testes
npm run test
```

### Deploy
```bash
# Commit e push (deploy automático)
git add .
git commit -m "mensagem"
git push
```

## Padrões de Código

### Backend
- Type hints obrigatórios
- Docstrings para funções públicas
- snake_case para variáveis
- PascalCase para classes
- HTTPException para erros

### Frontend
- Functional components + hooks
- Props tipadas com interfaces
- camelCase para variáveis
- PascalCase para componentes
- TailwindCSS para estilização

## Troubleshooting Comum

### Frontend não conecta no backend
1. Verificar `VITE_API_URL` no Vercel
2. Redeploy frontend
3. Limpar cache do navegador

### Backend não conecta no banco
1. Verificar `DATABASE_URL` no Railway
2. Verificar se PostgreSQL está online
3. Redeploy backend

### 404 ao recarregar página
1. Verificar se `vercel.json` existe
2. Verificar rewrites para SPA routing
3. Redeploy frontend

### Login falha
1. Verificar se admin existe no banco
2. Rodar `seed_admin.py`
3. Verificar logs do backend

## Variáveis de Ambiente

### Frontend (.env.production)
```
VITE_API_URL=https://trig-calculator-production.up.railway.app
```

### Backend (Railway)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## Specs Disponíveis

1. **add-new-user-role**: Adicionar novo tipo de usuário
2. **add-new-calculation-feature**: Adicionar nova funcionalidade de cálculo

## Documentação

- `docs/README.md` - Documentação principal
- `docs/ARCHITECTURE.md` - Arquitetura detalhada
- `docs/DEPLOYMENT.md` - Guia de deploy
- `docs/QUICK_START.md` - Início rápido
- `docs/TROUBLESHOOTING.md` - Solução de problemas
- `.kiro/steering/project-overview.md` - Visão geral
- `.kiro/steering/coding-standards.md` - Padrões de código
- `.kiro/steering/deployment-guide.md` - Guia de deploy

## Quando Usar Este Skill

- Adicionar nova funcionalidade
- Corrigir bugs
- Fazer deploy
- Adicionar novo tipo de usuário
- Modificar cálculos trigonométricos
- Atualizar UI
- Configurar ambiente
