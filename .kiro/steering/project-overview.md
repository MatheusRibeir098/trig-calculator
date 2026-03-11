# Calculadora de Trigonometria - Visão Geral do Projeto

## 📊 Arquitetura

Este é um projeto full-stack de calculadora de trigonometria com autenticação de usuários.

### Stack Tecnológica

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (estilização)
- React Router (navegação)
- Axios (requisições HTTP)

**Backend:**
- FastAPI (Python)
- SQLModel + SQLAlchemy (ORM)
- PostgreSQL (produção)
- JWT (autenticação)
- Bcrypt (hash de senhas)

**Deploy:**
- Frontend: Vercel
- Backend + Database: Railway

## 🌐 URLs de Produção

- **Frontend**: https://trig-calculator-ashy.vercel.app
- **Backend**: https://trig-calculator-production.up.railway.app
- **Database**: PostgreSQL no Railway

## 📁 Estrutura do Projeto

```
trig-calculator/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── db.py        # Configuração do banco
│   │   ├── main.py      # Aplicação principal
│   │   ├── models.py    # Modelos SQLModel
│   │   ├── schemas.py   # Schemas Pydantic
│   │   ├── routes.py    # Rotas principais
│   │   ├── middleware/  # Middleware de autenticação
│   │   ├── route_handlers/  # Handlers de rotas
│   │   └── services/    # Lógica de negócio
│   ├── tests/           # Testes pytest
│   ├── requirements.txt # Dependências Python
│   ├── Procfile         # Comando Railway
│   └── seed_admin.py    # Script para criar admin
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── context/     # Context API (Auth)
│   │   ├── lib/         # Utilitários
│   │   ├── pages/       # Páginas
│   │   └── styles/      # CSS
│   ├── .env.production  # Variáveis de produção
│   ├── vercel.json      # Config Vercel
│   └── package.json     # Dependências Node
│
├── docs/                # Documentação
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── QUICK_START.md
│   └── TROUBLESHOOTING.md
│
└── railway.json         # Config Railway
```

## 🔑 Variáveis de Ambiente

### Frontend (.env.production)
```
VITE_API_URL=https://trig-calculator-production.up.railway.app
```

### Backend (Railway Variables)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## 👥 Tipos de Usuário

1. **Admin_User**: Acesso total (gerenciar usuários, ver histórico)
2. **Common_User**: Acesso básico (usar calculadora, ver próprio histórico)

## 🔐 Autenticação

- JWT tokens armazenados no localStorage
- Middleware verifica token em rotas protegidas
- Senha hasheada com bcrypt

## 📊 Banco de Dados

### Tabelas:
- **users**: id, username, password_hash, role, created_at, updated_at, last_login
- **calculations**: id, user_id, angle, unit, sin_value, cos_value, tan_value, created_at

## 🚀 Deploy Workflow

1. Push para GitHub
2. Vercel detecta mudanças no frontend → rebuild automático
3. Railway detecta mudanças no backend → rebuild automático
4. PostgreSQL sempre disponível no Railway
