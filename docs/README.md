# Calculadora de Trigonometria

Uma aplicação web moderna e robusta para calcular trigonometria em triângulos retângulos, com interface responsiva, histórico persistente em banco de dados e testes automatizados.

## Características

- ✅ Interface moderna com cores roxo, azul marinho, branco e preto
- ✅ Cálculos trigonométricos precisos (sen, cos, tan, cot, sec, csc)
- ✅ Visualização do triângulo retângulo em SVG
- ✅ Histórico de cálculos persistente em SQLite
- ✅ Responsivo (mobile-first)
- ✅ Testes automatizados (frontend + backend)
- ✅ API REST robusta com validações
- ✅ Suporte a Docker Compose

## Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Hook Form + Zod (validação)
- Vitest + React Testing Library (testes)

### Backend
- FastAPI (Python)
- SQLModel + SQLite (persistência)
- Pytest (testes)
- JWT Authentication com bcrypt
- Role-based Access Control (RBAC)

## Pré-requisitos

### Opção 1: Rodar localmente (sem Docker)

**Frontend:**
- Node.js 18+ e npm

**Backend:**
- Python 3.11+
- pip

### Opção 2: Docker Compose
- Docker e Docker Compose

## Instalação e Execução

### Opção 1: Localmente

#### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente (Windows)
venv\Scripts\activate

# Ativar ambiente (macOS/Linux)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em `http://localhost:8000`

#### Frontend

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Opção 2: Docker Compose

```bash
# Na raiz do projeto
docker-compose up
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## Testes

### Frontend

```bash
cd frontend

# Rodar testes
npm test

# Rodar testes com UI
npm test:ui
```

### Backend

```bash
cd backend

# Ativar ambiente virtual (se não estiver ativo)
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# Rodar testes
pytest

# Rodar com verbose
pytest -v

# Rodar teste específico
pytest tests/test_api.py::test_create_calculation -v
```

## Uso

1. Abra `http://localhost:5173` no navegador
2. Preencha pelo menos 2 valores:
   - **Ângulo (θ)** em graus (0° a 90°)
   - **Cateto Oposto** (lado oposto ao ângulo)
   - **Cateto Adjacente** (lado adjacente ao ângulo)
3. Clique em "Calcular"
4. Veja os resultados e o triângulo visualizado
5. O cálculo é automaticamente salvo no histórico

### Casos de Cálculo Suportados

- **Ângulo + Cateto Adjacente** → calcula Oposto e Hipotenusa
- **Ângulo + Cateto Oposto** → calcula Adjacente e Hipotenusa
- **Cateto Oposto + Cateto Adjacente** → calcula Ângulo e Hipotenusa
- **Todos os três** → valida consistência e calcula Hipotenusa

## Estrutura do Projeto

```
trig-calculator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TriangleCanvas.tsx
│   │   │   ├── TrigForm.tsx
│   │   │   └── HistoryPanel.tsx
│   │   ├── lib/
│   │   │   ├── trig.ts (lógica trigonométrica)
│   │   │   ├── trig.test.ts
│   │   │   └── api.ts (cliente HTTP)
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── main.py (aplicação FastAPI)
│   │   ├── db.py (configuração do banco)
│   │   ├── models.py (modelos SQLModel)
│   │   ├── schemas.py (schemas Pydantic)
│   │   ├── routes.py (endpoints da API)
│   │   └── services/
│   │       └── trig_service.py (lógica trigonométrica)
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_trig_service.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── Dockerfile
├── docker-compose.yml
└── docs/
    ├── README.md (este arquivo)
    ├── QUICK_START.md
    ├── ARCHITECTURE.md
    └── TROUBLESHOOTING.md
```

## API Endpoints

### POST `/api/calculations`
Cria um novo registro de cálculo.

**Request:**
```json
{
  "angle": 45.0,
  "opposite": 1.0,
  "adjacent": 1.0,
  "hypotenuse": 1.414,
  "sin": 0.707,
  "cos": 0.707,
  "tan": 1.0,
  "cot": 1.0,
  "sec": 1.414,
  "csc": 1.414,
  "angle_unit": "degrees"
}
```

**Response:** `201 Created` com o objeto criado

### GET `/api/calculations?limit=20&offset=0`
Lista cálculos com paginação.

**Response:**
```json
{
  "items": [...],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### DELETE `/api/calculations/{id}`
Deleta um cálculo específico.

### DELETE `/api/calculations`
Limpa todo o histórico.

## Decisões Técnicas

### Frontend
- **React + TypeScript**: Type safety e componentes reutilizáveis
- **Vite**: Build rápido e dev server otimizado
- **TailwindCSS**: Estilo moderno com controle fino
- **React Hook Form + Zod**: Validação robusta e performática
- **SVG para triângulo**: Escalável e permite posicionamento preciso

### Backend
- **FastAPI**: Framework moderno, rápido e com documentação automática
- **SQLModel**: Combina SQLAlchemy com Pydantic para type safety
- **SQLite**: Banco local, sem dependências externas
- **Pytest**: Framework de testes robusto e bem documentado

### Validações
- Ângulo deve estar entre 0° e 90° (triângulo retângulo)
- Catetos devem ser positivos
- Tolerância de 1e-6 para validar consistência entre valores

## Troubleshooting

### "Connection refused" ao conectar frontend com backend
- Certifique-se de que o backend está rodando em `http://localhost:8000`
- Verifique se o proxy está configurado corretamente em `vite.config.ts`

### Erro ao criar banco de dados
- Certifique-se de ter permissão de escrita no diretório
- Delete `trig_calculator.db` e deixe ser recriado

### Testes falhando
- Frontend: `npm install` para garantir dependências
- Backend: `pip install -r requirements.txt` para garantir dependências

## Documentação

- [QUICK_START.md](./QUICK_START.md) - Guia de início rápido
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solução de problemas

## Licença

MIT

## Autor

Desenvolvido como uma calculadora trigonométrica robusta e moderna.
