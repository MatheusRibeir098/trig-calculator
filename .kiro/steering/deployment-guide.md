# Guia de Deploy - Calculadora de Trigonometria

## 🚀 Deploy Automático

### Frontend (Vercel)

**Configuração Atual:**
- Repositório: https://github.com/MatheusRibeir098/trig-calculator
- Branch: main
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

**Variáveis de Ambiente:**
```
VITE_API_URL=https://trig-calculator-production.up.railway.app
```

**Deploy Automático:**
1. Faça mudanças no código
2. `git add .`
3. `git commit -m "sua mensagem"`
4. `git push`
5. Vercel detecta e faz rebuild automaticamente

**Deploy Manual:**
1. Acesse Vercel Dashboard
2. Clique no projeto
3. Clique em "Deployments"
4. Clique em "Redeploy"

### Backend (Railway)

**Configuração Atual:**
- Repositório: https://github.com/MatheusRibeir098/trig-calculator
- Branch: main
- Build: Nixpacks (detecta Python automaticamente)
- Start Command: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Variáveis de Ambiente:**
```
DATABASE_URL=postgresql://postgres:...@tramway.proxy.rlwy.net:50750/railway
JWT_SECRET=your-secret-key
```

**Deploy Automático:**
1. Faça mudanças no código
2. `git add .`
3. `git commit -m "sua mensagem"`
4. `git push`
5. Railway detecta e faz rebuild automaticamente

**Deploy Manual:**
1. Acesse Railway Dashboard
2. Clique no projeto
3. Clique em "Backend"
4. Clique em "Deployments"
5. Clique em "Redeploy"

## 🗄️ Banco de Dados (PostgreSQL no Railway)

**Conexão:**
- Host: tramway.proxy.rlwy.net
- Port: 50750
- Database: railway
- User: postgres

**Criar Tabelas:**
As tabelas são criadas automaticamente no startup do backend via:
```python
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
```

**Criar Usuário Admin:**
```bash
# Local (com DATABASE_URL configurado)
export DATABASE_URL=postgresql://...
python backend/seed_admin.py

# Ou via Railway CLI
railway run python backend/seed_admin.py
```

## 🔧 Troubleshooting

### Frontend não conecta no backend
1. Verifique se `VITE_API_URL` está correto no Vercel
2. Faça redeploy do frontend
3. Limpe cache do navegador

### Backend não conecta no banco
1. Verifique se `DATABASE_URL` está configurado no Railway
2. Verifique se PostgreSQL está online
3. Faça redeploy do backend

### 404 ao recarregar página
1. Verifique se `vercel.json` existe
2. Conteúdo deve ter rewrites para SPA routing
3. Faça redeploy do frontend

### Login falha
1. Verifique se usuário admin existe no banco
2. Rode `seed_admin.py` se necessário
3. Verifique logs do backend no Railway

## 📊 Monitoramento

### Vercel
- Dashboard → Projeto → Analytics
- Veja requisições, erros, performance

### Railway
- Dashboard → Backend → Logs
- Veja logs em tempo real
- Veja uso de recursos (CPU, memória)

### PostgreSQL
- Dashboard → Postgres → Database
- Veja tabelas e dados
- Veja uso de armazenamento

## 🔄 Rollback

### Vercel
1. Dashboard → Deployments
2. Encontre deploy anterior
3. Clique em "..." → "Promote to Production"

### Railway
1. Dashboard → Backend → Deployments
2. Encontre deploy anterior
3. Clique em "..." → "Redeploy"

## 📝 Checklist de Deploy

Antes de fazer deploy:
- [ ] Testes passando localmente
- [ ] Código commitado no Git
- [ ] Variáveis de ambiente configuradas
- [ ] Documentação atualizada
- [ ] Sem credenciais hardcoded

Depois do deploy:
- [ ] Frontend carrega corretamente
- [ ] Login funciona
- [ ] Calculadora funciona
- [ ] Admin panel funciona (se admin)
- [ ] Sem erros no console
