# Arquitetura — Calculadora de Trigonometria

## Visão Geral

A aplicação segue uma arquitetura **client-server** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TS)                    │
│  - UI responsiva com TailwindCSS                            │
│  - Validação com React Hook Form + Zod                      │
│  - Cálculos trigonométricos (lib/trig.ts)                   │
│  - Comunicação com API via axios                            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI + Python)                 │
│  - Validação de dados com Pydantic                          │
│  - Lógica trigonométrica (services/trig_service.py)         │
│  - Persistência em SQLite via SQLModel                      │
│  - CORS habilitado para frontend                            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Estrutura de Componentes

```
src/
├── components/
│   ├── Navbar.tsx              # Barra de navegação
│   ├── TriangleCanvas.tsx       # Visualização SVG do triângulo
│   ├── TrigForm.tsx             # Formulário de entrada
│   └── HistoryPanel.tsx         # Painel de histórico
├── lib/
│   ├── trig.ts                  # Lógica trigonométrica
│   ├── trig.test.ts             # Testes unitários
│   └── api.ts                   # Cliente HTTP
├── pages/
│   └── Home.tsx                 # Página principal
└── styles/
    └── main.css                 # Estilos globais
```

### Fluxo de Dados

1. **Entrada**: Usuário preenche formulário (TrigForm)
2. **Validação**: React Hook Form + Zod valida inputs
3. **Cálculo**: `calculateTriangle()` em `lib/trig.ts`
4. **Visualização**: TriangleCanvas renderiza SVG
5. **Persistência**: API POST salva no backend
6. **Histórico**: HistoryPanel lista registros com paginação

### Validações Frontend

- Ângulo: 0° < θ < 90°
- Catetos: valores positivos
- Campos vazios: permitidos (cálculo adaptativo)
- Arredondamento: configurável (1-10 casas decimais)

## Backend Architecture

### Estrutura de Módulos

```
app/
├── main.py              # Aplicação FastAPI + CORS
├── db.py                # Configuração SQLite
├── models.py            # Modelos SQLModel
├── schemas.py           # Schemas Pydantic
├── routes.py            # Endpoints REST
└── services/
    └── trig_service.py  # Lógica trigonométrica
```

### Endpoints REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/calculations` | Cria novo cálculo |
| GET | `/api/calculations` | Lista com paginação |
| DELETE | `/api/calculations/{id}` | Deleta um item |
| DELETE | `/api/calculations` | Limpa tudo |

### Validações Backend

- Ângulo: 0 < angle < 90 (Pydantic)
- Catetos: > 0 (Pydantic)
- Consistência: `tan(θ) ≈ opposite/adjacent` (tolerância 1e-6)
- Resposta: 422 Unprocessable Entity em erro

### Banco de Dados

**Tabela: `calculation`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária |
| angle | FLOAT | Ângulo em graus |
| opposite | FLOAT | Cateto oposto |
| adjacent | FLOAT | Cateto adjacente |
| hypotenuse | FLOAT | Hipotenusa |
| sin | FLOAT | sen(θ) |
| cos | FLOAT | cos(θ) |
| tan | FLOAT | tan(θ) |
| cot | FLOAT | cot(θ) |
| sec | FLOAT | sec(θ) |
| csc | FLOAT | csc(θ) |
| angle_unit | VARCHAR | "degrees" ou "radians" |
| created_at | DATETIME | Timestamp UTC |

## Fluxo de Cálculo

### Caso 1: Ângulo + Cateto Adjacente

```
Input: θ = 45°, adj = 1
↓
opp = adj × tan(θ) = 1 × tan(45°) = 1
hip = adj / cos(θ) = 1 / cos(45°) ≈ 1.414
↓
Output: opp=1, hip≈1.414
```

### Caso 2: Cateto Oposto + Cateto Adjacente

```
Input: opp = 3, adj = 4
↓
hip = √(3² + 4²) = 5
θ = arctan(3/4) ≈ 36.87°
↓
Output: hip=5, θ≈36.87°
```

### Caso 3: Todos os Três

```
Input: θ = 36.87°, opp = 3, adj = 4
↓
Validar: |tan(36.87°) - 3/4| < 1e-6 ✓
↓
hip = √(3² + 4²) = 5
↓
Output: hip=5 (validado)
```

## Decisões de Design

### Por que React + TypeScript?
- Type safety em tempo de desenvolvimento
- Componentes reutilizáveis
- Ecossistema maduro e bem documentado
- Fácil integração com bibliotecas

### Por que FastAPI?
- Framework moderno e rápido
- Validação automática com Pydantic
- Documentação automática (Swagger)
- Suporte nativo a async/await

### Por que SQLite?
- Sem dependências externas
- Ideal para aplicações locais
- Fácil backup (arquivo único)
- Suficiente para histórico

### Por que SVG para o triângulo?
- Escalável sem perda de qualidade
- Permite posicionamento preciso
- Responsivo naturalmente
- Fácil de animar/atualizar

### Por que TailwindCSS?
- Utility-first: controle fino do design
- Cores customizáveis
- Responsivo por padrão
- Arquivo CSS otimizado

## Tratamento de Erros

### Frontend
- Validação em tempo real (React Hook Form)
- Mensagens amigáveis ao usuário
- Estados de loading
- Fallback para erros de API

### Backend
- Validação Pydantic automática (422)
- Tratamento de exceções customizado
- Logs estruturados
- Respostas JSON padronizadas

## Performance

### Frontend
- Lazy loading de componentes
- Memoização de cálculos
- Paginação no histórico (20 itens/página)
- CSS otimizado com Tailwind

### Backend
- Índices no banco (created_at)
- Paginação de resultados
- Validação rápida com Pydantic
- Sem N+1 queries

## Segurança

- CORS habilitado (permitir frontend)
- Validação rigorosa de inputs
- Sem SQL injection (SQLModel)
- Sem XSS (React escapa HTML)
- Sem secrets em código

## Testes

### Frontend (Vitest + React Testing Library)
- Testes unitários de `lib/trig.ts`
- Testes de componentes (snapshots)
- Cobertura: ~80%

### Backend (Pytest)
- Testes de endpoints (POST, GET, DELETE)
- Testes de validação
- Testes de serviços
- Cobertura: ~85%

## Escalabilidade Futura

Se precisar escalar:

1. **Banco de Dados**: Migrar para PostgreSQL
2. **Cache**: Adicionar Redis para histórico
3. **API**: Adicionar autenticação (JWT)
4. **Frontend**: Adicionar PWA (offline)
5. **Backend**: Containerizar com Kubernetes

## Deployment

### Docker Compose (Desenvolvimento)
```bash
docker-compose up
```

### Produção (sugestão)
- Frontend: Vercel, Netlify ou S3 + CloudFront
- Backend: Heroku, Railway ou AWS ECS
- Banco: PostgreSQL gerenciado (RDS, Supabase)
