# Deploy no Cloudflare — Calculadora de Trigonometria

## 🚀 Deploy Gratuito no Cloudflare

O Cloudflare oferece várias opções gratuitas para fazer deploy:

### Opções Disponíveis

1. **Cloudflare Pages** (Frontend) - ✅ Gratuito
2. **Cloudflare Workers** (Backend) - ✅ Gratuito (100k requisições/dia)
3. **Cloudflare D1** (Banco de Dados) - ✅ Gratuito (até 3GB)

## 📋 Pré-requisitos

- Conta Cloudflare (gratuita em https://dash.cloudflare.com)
- Wrangler CLI instalado
- Git instalado

### Instalar Wrangler

```bash
npm install -g wrangler
```

Ou com npm local:

```bash
npm install --save-dev wrangler
```

## 🎨 Deploy do Frontend (Cloudflare Pages)

### Passo 1: Build do Frontend

```bash
cd frontend
npm run build
```

Isso cria a pasta `dist/` com os arquivos otimizados.

### Passo 2: Conectar ao Cloudflare Pages

#### Opção A: Via Git (Recomendado)

1. Push seu código para GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/trig-calculator.git
git push -u origin main
```

2. Acesse https://dash.cloudflare.com
3. Vá para **Pages**
4. Clique em **Create a project**
5. Selecione seu repositório GitHub
6. Configure:
   - **Project name**: `trig-calculator`
   - **Production branch**: `main`
   - **Build command**: `cd frontend && npm run build`
   - **Build output directory**: `frontend/dist`
7. Clique em **Save and Deploy**

#### Opção B: Via CLI (Rápido)

```bash
cd frontend/dist
wrangler pages deploy .
```

### Resultado

Seu frontend estará disponível em:
```
https://seu-projeto.pages.dev
```

## 🐍 Deploy do Backend (Cloudflare Workers)

### Passo 1: Converter Backend para Workers

O backend atual usa FastAPI (Python), mas Cloudflare Workers usa JavaScript/TypeScript.

**Opção A: Usar Hono.js (Recomendado)**

Hono é um framework leve para Workers que é similar ao FastAPI.

```bash
npm create hono@latest trig-backend
cd trig-backend
npm install
```

**Opção B: Usar a versão existente com Wrangler**

Se quiser manter Python, você pode usar:
- **Cloudflare Workers com Python** (via WebAssembly)
- Ou migrar para Node.js/TypeScript

### Passo 2: Configurar Wrangler

Na raiz do projeto backend, crie `wrangler.toml`:

```toml
name = "trig-calculator-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "trig-calculator-api-prod"

[[d1_databases]]
binding = "DB"
database_name = "trig-calculator"
database_id = "seu-database-id"

[env.production.d1_databases]
binding = "DB"
database_name = "trig-calculator-prod"
database_id = "seu-database-id-prod"
```

### Passo 3: Criar Banco de Dados D1

```bash
wrangler d1 create trig-calculator
```

Isso retorna um `database_id`. Copie e adicione ao `wrangler.toml`.

### Passo 4: Executar Migrations

```bash
wrangler d1 execute trig-calculator --file=./migrations/0001_create_tables.sql
```

### Passo 5: Deploy

```bash
wrangler deploy
```

Seu backend estará disponível em:
```
https://trig-calculator-api.seu-usuario.workers.dev
```

## 🔗 Conectar Frontend com Backend

Atualize `frontend/src/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://trig-calculator-api.seu-usuario.workers.dev';

export const api = axios.create({
  baseURL: API_URL,
});
```

Crie `frontend/.env.production`:

```
VITE_API_URL=https://trig-calculator-api.seu-usuario.workers.dev
```

## 📊 Estrutura de Deploy

```
Cloudflare
├── Pages (Frontend)
│   └── https://seu-projeto.pages.dev
├── Workers (Backend)
│   └── https://trig-calculator-api.seu-usuario.workers.dev
└── D1 (Banco de Dados)
    └── SQLite gerenciado
```

## 💰 Limites Gratuitos

### Cloudflare Pages
- ✅ Builds ilimitados
- ✅ Bandwidth ilimitado
- ✅ Domínio gratuito (*.pages.dev)
- ✅ SSL/TLS automático

### Cloudflare Workers
- ✅ 100.000 requisições/dia
- ✅ CPU time ilimitado
- ✅ Domínio gratuito (*.workers.dev)
- ✅ 10ms de CPU por requisição

### Cloudflare D1
- ✅ Até 3GB de armazenamento
- ✅ Leitura/escrita ilimitada
- ✅ Backups automáticos

## 🔐 Variáveis de Ambiente

### Frontend

Crie `frontend/.env.production`:

```
VITE_API_URL=https://trig-calculator-api.seu-usuario.workers.dev
```

### Backend

Crie `wrangler.toml` com secrets:

```bash
wrangler secret put JWT_SECRET
wrangler secret put DATABASE_URL
```

## 🚀 Passo a Passo Completo

### 1. Preparar Código

```bash
# Frontend
cd frontend
npm run build

# Backend (se usar Hono)
cd ../backend
npm install
```

### 2. Criar Conta Cloudflare

- Acesse https://dash.cloudflare.com
- Crie uma conta gratuita

### 3. Deploy Frontend

```bash
cd frontend/dist
wrangler pages deploy .
```

### 4. Deploy Backend

```bash
cd backend
wrangler deploy
```

### 5. Configurar Banco de Dados

```bash
wrangler d1 create trig-calculator
wrangler d1 execute trig-calculator --file=./migrations/schema.sql
```

### 6. Atualizar URLs

- Frontend: Atualize `VITE_API_URL` com URL do Workers
- Backend: Configure CORS para aceitar frontend

### 7. Testar

```
https://seu-projeto.pages.dev
```

## 🎯 Alternativas Gratuitas

Se preferir não usar Cloudflare:

### Vercel (Frontend)
- ✅ Gratuito
- ✅ Deploy automático via Git
- ✅ Domínio gratuito

```bash
npm install -g vercel
vercel
```

### Railway (Backend)
- ✅ $5/mês de crédito gratuito
- ✅ Suporta Python/Node.js
- ✅ Banco de dados incluído

### Render (Backend)
- ✅ Gratuito com limitações
- ✅ Suporta Python/Node.js
- ✅ Banco de dados PostgreSQL

### Supabase (Banco de Dados)
- ✅ Gratuito
- ✅ PostgreSQL gerenciado
- ✅ Auth incluído

## 📝 Exemplo Completo

### 1. Frontend no Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

### 2. Backend no Railway

```bash
# Criar account em railway.app
# Conectar GitHub
# Deploy automático
```

### 3. Banco em Supabase

```bash
# Criar account em supabase.com
# Copiar connection string
# Usar em backend
```

## 🔗 Domínio Personalizado

### Cloudflare Pages

1. Vá para **Pages** → seu projeto
2. Clique em **Custom domains**
3. Adicione seu domínio
4. Configure DNS no seu registrador

### Cloudflare Workers

1. Vá para **Workers** → seu projeto
2. Clique em **Routes**
3. Adicione rota customizada

## 📊 Monitoramento

### Cloudflare Analytics

- Pages: Dashboard automático
- Workers: Logs em tempo real
- D1: Uso de armazenamento

```bash
wrangler tail
```

## 🆘 Troubleshooting

### CORS Error

Adicione ao backend:

```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### Banco não conecta

```bash
wrangler d1 info trig-calculator
wrangler d1 execute trig-calculator --command "SELECT 1"
```

### Build falha

```bash
# Limpar cache
wrangler pages project list
wrangler pages deployment list

# Rebuild
wrangler pages deploy ./dist
```

## 📚 Recursos

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Hono.js Docs](https://hono.dev/)

## 🎉 Conclusão

Com Cloudflare você consegue:
- ✅ Frontend gratuito e rápido
- ✅ Backend gratuito com 100k requisições/dia
- ✅ Banco de dados gratuito até 3GB
- ✅ SSL/TLS automático
- ✅ CDN global

**Custo total: R$ 0,00** 🎊

---

**Próximo passo**: Escolha sua estratégia de deploy e comece!
