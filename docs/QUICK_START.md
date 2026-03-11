# Guia de Início Rápido — Calculadora de Trigonometria

## 🚀 Comece em 5 Minutos

### Pré-requisitos
- Node.js 18+ e npm
- Python 3.11+
- Git

### 1. Clone ou Extraia o Projeto
```bash
cd trig-calculator
```

### 2. Inicie o Backend

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

# Criar usuário admin
python seed_admin.py

# Rodar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend rodando em http://localhost:8000

### 3. Inicie o Frontend (novo terminal)

```bash
cd frontend

# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

✅ Frontend rodando em http://localhost:5173

### 4. Abra no Navegador

```
http://localhost:5173
```

### 5. Faça Login

**Credenciais de Demo:**
- Usuário: `admin`
- Senha: `admin123`

### 6. Comece a Calcular!

1. Preencha pelo menos 2 valores:
   - Ângulo (θ) em graus
   - Cateto Oposto
   - Cateto Adjacente
   - Hipotenusa

2. Clique em "Calcular"

3. Veja o resultado e o triângulo visualizado

4. O cálculo é automaticamente salvo no histórico

## 📊 Casos de Cálculo Suportados

- **Ângulo + Cateto Adjacente** → calcula Oposto e Hipotenusa
- **Ângulo + Cateto Oposto** → calcula Adjacente e Hipotenusa
- **Cateto Oposto + Cateto Adjacente** → calcula Ângulo e Hipotenusa
- **Todos os três** → valida consistência e calcula Hipotenusa

## 🔐 Painel Admin

Se você fez login como admin, acesse o painel em:
```
http://localhost:5173/admin
```

### Funcionalidades Admin
- ✅ Criar novos usuários
- ✅ Listar todos os usuários
- ✅ Deletar usuários
- ✅ Visualizar histórico de cálculos
- ✅ Deletar cálculos de usuários

## 🧪 Rodar Testes

### Frontend
```bash
cd frontend
npm test
npm test:ui
```

### Backend
```bash
cd backend
pytest
pytest -v
```

## 🐳 Docker Compose

Se preferir usar Docker:

```bash
docker-compose up
```

Isso inicia:
- Frontend em http://localhost:5173
- Backend em http://localhost:8000

## 📚 Documentação Completa

- [README.md](./README.md) - Visão geral do projeto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solução de problemas

## ⚠️ Problemas Comuns

### "Connection refused" ao conectar frontend com backend
- Certifique-se de que o backend está rodando em http://localhost:8000
- Verifique se a porta 8000 não está em uso

### Erro ao criar banco de dados
- Delete `backend/trig_calculator.db`
- Deixe ser recriado automaticamente

### Testes falhando
- Frontend: `npm install` para garantir dependências
- Backend: `pip install -r requirements.txt` para garantir dependências

## 🎓 Próximos Passos

1. ✅ Explorar a calculadora
2. ✅ Criar alguns cálculos
3. ✅ Testar o painel admin
4. ✅ Ler a documentação completa
5. ⏳ Deploy em produção

## 💡 Dicas

- Use a tabela de ângulos especiais para referência rápida
- O histórico é salvo automaticamente
- Você só vê seus próprios cálculos (exceto admin)
- Admins podem gerenciar todos os usuários e cálculos

## 🆘 Precisa de Ajuda?

Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para soluções de problemas comuns.

---

**Pronto para começar?** Siga os passos acima e divirta-se calculando! 🎓📐
