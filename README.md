# Calculadora de Trigonometria

Uma aplicação web moderna para calcular trigonometria em triângulos retângulos.

## 🚀 Início Rápido

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
python seed_admin.py
uvicorn app.main:app --reload

# Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173
Credenciais: admin / admin123

## 📚 Documentação

Toda a documentação está em `docs/`:

- **[docs/README.md](./docs/README.md)** - Visão geral completa
- **[docs/QUICK_START.md](./docs/QUICK_START.md)** - Guia de início rápido
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitetura detalhada
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Solução de problemas

## 🐳 Docker Compose

```bash
docker-compose up
```

## 🧪 Testes

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest
```

## 📋 Estrutura

```
trig-calculator/
├── frontend/          # React + TypeScript
├── backend/           # FastAPI + Python
├── docs/              # Documentação
├── docker-compose.yml # Orquestração
└── README.md          # Este arquivo
```

## ✨ Funcionalidades

- ✅ Cálculos trigonométricos (sin, cos, tan, cot, sec, csc)
- ✅ Visualização de triângulo em SVG
- ✅ Histórico de cálculos
- ✅ Autenticação com JWT
- ✅ Painel de administração
- ✅ Responsivo (mobile-first)

## 📖 Mais Informações

Veja a documentação completa em `docs/README.md`
