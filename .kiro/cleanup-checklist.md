# Checklist de Limpeza do Projeto

## 🗑️ Arquivos para Excluir

### Backend

- [ ] `backend/trig_calculator.db` - Banco SQLite local (não usado em produção)
  ```bash
  rm backend/trig_calculator.db
  ```

- [ ] `backend/venv/` - Ambiente virtual (não deve estar no Git)
  ```bash
  rm -rf backend/venv
  ```

- [ ] `backend/Dockerfile` - Não usado (Railway usa Nixpacks)
  ```bash
  rm backend/Dockerfile
  ```

### Frontend

- [ ] `frontend/vite.config.js` - Duplicado (você tem o .ts)
  ```bash
  rm frontend/vite.config.js
  ```

- [ ] `frontend/vite.config.d.ts` - Gerado automaticamente
  ```bash
  rm frontend/vite.config.d.ts
  ```

- [ ] `frontend/tsconfig.tsbuildinfo` - Cache do TypeScript
  ```bash
  rm frontend/tsconfig.tsbuildinfo
  ```

- [ ] `frontend/tsconfig.node.tsbuildinfo` - Cache do TypeScript
  ```bash
  rm frontend/tsconfig.node.tsbuildinfo
  ```

- [ ] `frontend/dist/` - Build gerado (não deve estar no Git)
  ```bash
  rm -rf frontend/dist
  ```

- [ ] `frontend/node_modules/` - Dependências (não deve estar no Git)
  ```bash
  rm -rf frontend/node_modules
  ```

- [ ] `frontend/Dockerfile` - Não usado (Vercel faz build)
  ```bash
  rm frontend/Dockerfile
  ```

- [ ] `frontend/Dockerfile.dev` - Não usado
  ```bash
  rm frontend/Dockerfile.dev
  ```

### Root

- [ ] `docker-compose.yml` - Não usado (você usa Vercel + Railway)
  ```bash
  rm docker-compose.yml
  ```

## ✅ Atualizar .gitignore

Adicione ao `.gitignore` para evitar que esses arquivos sejam commitados:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
*.db
*.sqlite3

# Node
node_modules/
dist/
*.tsbuildinfo

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Build
build/
dist/
```

## 🧹 Comando de Limpeza Rápida

Execute todos de uma vez:

```bash
# Backend
rm -f backend/trig_calculator.db
rm -rf backend/venv
rm -f backend/Dockerfile

# Frontend
rm -f frontend/vite.config.js
rm -f frontend/vite.config.d.ts
rm -f frontend/tsconfig.tsbuildinfo
rm -f frontend/tsconfig.node.tsbuildinfo
rm -rf frontend/dist
rm -rf frontend/node_modules
rm -f frontend/Dockerfile
rm -f frontend/Dockerfile.dev

# Root
rm -f docker-compose.yml
```

## 📝 Depois da Limpeza

1. Verifique se nada quebrou:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Commit as mudanças:
   ```bash
   git add .
   git commit -m "chore: remove arquivos desnecessários"
   git push
   ```

3. Verifique deploy automático no Vercel e Railway

## ⚠️ Arquivos que DEVEM Permanecer

- `railway.json` - Config do Railway
- `frontend/vercel.json` - Config do Vercel (SPA routing)
- `frontend/.env.production` - Variáveis de produção
- `backend/Procfile` - Comando do Railway
- `backend/requirements.txt` - Dependências Python
- `frontend/package.json` - Dependências Node
- Todos os arquivos em `docs/`
- Todos os arquivos em `.kiro/`
