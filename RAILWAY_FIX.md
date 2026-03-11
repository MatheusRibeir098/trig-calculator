# Como Corrigir o Erro libpq.so.5 no Railway

## Problema
```
ImportError: libpq.so.5: cannot open shared object file: No such file or directory
```

## Solução Passo a Passo

### 1. Commit e Push do arquivo nixpacks.toml

O arquivo `backend/nixpacks.toml` já foi criado. Agora você precisa enviá-lo ao GitHub:

```bash
# No diretório raiz do projeto
git add trig-calculator/backend/nixpacks.toml
git commit -m "fix: adiciona nixpacks.toml para instalar PostgreSQL libs"
git push origin main
```

### 2. Configurar Root Directory no Railway

**IMPORTANTE**: O Railway precisa saber onde está o backend.

1. Acesse: https://railway.app/dashboard
2. Clique no seu projeto
3. Clique no serviço "Backend"
4. Vá em **Settings** (ícone de engrenagem)
5. Procure por **Root Directory**
6. Configure como: `backend`
7. Clique em **Save**

### 3. Limpar Cache e Fazer Redeploy

Depois de configurar o Root Directory:

1. Ainda em **Settings**, role até o final
2. Clique em **Clear Build Cache**
3. Confirme a ação
4. Vá em **Deployments** (no menu lateral)
5. Clique em **Redeploy** no deployment mais recente

### 4. Verificar os Logs

1. Vá em **Deployments**
2. Clique no deployment em andamento
3. Clique em **View Logs**
4. Procure por:
   - ✅ `Installing postgresql` (indica que o nixpacks está funcionando)
   - ✅ `Application startup complete` (indica que o servidor iniciou)
   - ❌ `libpq.so.5: cannot open shared object file` (erro persiste)

### 5. Se o Erro Persistir

Se mesmo após seguir os passos acima o erro continuar:

#### Opção A: Verificar se o nixpacks.toml está sendo usado

Nos logs de build, procure por:
```
Using Nixpacks
```

Se não aparecer, o Railway pode não estar detectando o arquivo.

#### Opção B: Usar Dockerfile (alternativa)

Se o nixpacks não funcionar, crie um `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

# Instalar dependências do sistema incluindo PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 8000

# Comando para iniciar
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Depois:
1. Commit e push do Dockerfile
2. No Railway, vá em Settings
3. Em **Build Command**, deixe vazio (Railway detectará o Dockerfile)
4. Em **Start Command**, deixe vazio
5. Faça redeploy

## Checklist de Verificação

- [ ] Arquivo `backend/nixpacks.toml` existe
- [ ] Arquivo foi commitado e enviado ao GitHub (`git push`)
- [ ] Root Directory configurado como `backend` no Railway
- [ ] Build cache limpo
- [ ] Redeploy realizado
- [ ] Logs verificados

## Comandos Úteis

### Verificar se o arquivo está no repositório
```bash
git ls-files | grep nixpacks.toml
```

### Ver status do Git
```bash
git status
```

### Ver último commit
```bash
git log -1 --oneline
```

## Contato com Suporte

Se nada funcionar, o problema pode ser com o Railway. Verifique:
- Status do Railway: https://status.railway.app/
- Documentação Nixpacks: https://nixpacks.com/docs
- Suporte Railway: https://railway.app/help

## Resultado Esperado

Quando funcionar, você verá nos logs:

```
[nixpacks] Installing postgresql
[nixpacks] Installing Python dependencies
[nixpacks] Starting application
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

E o endpoint `/health` deve responder:
```
https://seu-app.up.railway.app/health
→ {"status": "ok"}
```
