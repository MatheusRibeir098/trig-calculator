# Troubleshooting — Calculadora de Trigonometria

## 🔴 Problemas Comuns

### Frontend não conecta com Backend

**Sintoma:** Erro "Connection refused" ou "Failed to fetch"

**Soluções:**
1. Verifique se o backend está rodando:
   ```bash
   curl http://localhost:8000/health
   ```
   Deve retornar `{"status":"ok"}`

2. Verifique a porta do backend (padrão: 8000)
   ```bash
   # Se usar outra porta, atualize em frontend/vite.config.ts
   ```

3. Verifique o proxy em `frontend/vite.config.ts`:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:8000',
       changeOrigin: true,
     }
   }
   ```

4. Limpe cache do navegador (Ctrl+Shift+Delete)

---

### Erro ao instalar dependências do Frontend

**Sintoma:** `npm ERR!` durante `npm install`

**Soluções:**
1. Limpe cache do npm:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` e `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Use flag legacy para compatibilidade:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Verifique versão do Node:
   ```bash
   node --version  # Deve ser 18+
   npm --version   # Deve ser 9+
   ```

---

### Erro ao instalar dependências do Backend

**Sintoma:** `ERROR: Could not find a version that satisfies the requirement`

**Soluções:**
1. Atualize pip:
   ```bash
   python -m pip install --upgrade pip
   ```

2. Verifique versão do Python:
   ```bash
   python --version  # Deve ser 3.11+
   ```

3. Crie novo ambiente virtual:
   ```bash
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # ou venv\Scripts\activate no Windows
   pip install -r requirements.txt
   ```

4. Instale dependências uma por uma:
   ```bash
   pip install fastapi==0.104.1
   pip install uvicorn==0.24.0
   pip install sqlmodel==0.0.14
   ```

---

### Porta já em uso

**Sintoma:** `Address already in use` ou `Port 5173 is in use`

**Soluções:**

**Frontend (porta 5173):**
1. Mude a porta em `frontend/vite.config.ts`:
   ```typescript
   server: {
     port: 3000,  // Mude para outra porta
   }
   ```

2. Ou mate o processo usando a porta:
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5173
   kill -9 <PID>
   ```

**Backend (porta 8000):**
1. Mude a porta ao rodar:
   ```bash
   uvicorn app.main:app --port 8001
   ```

2. Atualize o proxy no frontend para a nova porta

---

### Erro ao criar banco de dados

**Sintoma:** `PermissionError` ou `database is locked`

**Soluções:**
1. Verifique permissões de escrita:
   ```bash
   # Windows
   icacls "backend" /grant:r "%USERNAME%":F
   
   # macOS/Linux
   chmod -R 755 backend
   ```

2. Delete o banco antigo:
   ```bash
   rm backend/trig_calculator.db
   rm backend/trig_calculator.db-journal
   ```

3. Deixe ser recriado na próxima execução

4. Se usar Docker, verifique volumes:
   ```bash
   docker volume ls
   docker volume rm <volume_name>
   ```

---

### Testes falhando

**Sintoma:** `FAILED` ou `ERROR` ao rodar testes

**Frontend:**
```bash
cd frontend
npm test
```

Se falhar:
1. Instale dependências de teste:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom
   ```

2. Limpe cache:
   ```bash
   npm test -- --clearCache
   ```

3. Rode com verbose:
   ```bash
   npm test -- --reporter=verbose
   ```

**Backend:**
```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate
pytest -v
```

Se falhar:
1. Verifique dependências:
   ```bash
   pip install -r requirements.txt
   ```

2. Rode teste específico:
   ```bash
   pytest tests/test_api.py::test_create_calculation -v
   ```

3. Verifique se banco está limpo:
   ```bash
   rm trig_calculator.db
   pytest
   ```

---

### Docker Compose não funciona

**Sintoma:** `docker-compose: command not found` ou containers não iniciam

**Soluções:**
1. Verifique instalação:
   ```bash
   docker --version
   docker-compose --version
   ```

2. Instale Docker Desktop (inclui Compose)

3. Se usar Docker Compose v2:
   ```bash
   docker compose up  # sem hífen
   ```

4. Verifique logs:
   ```bash
   docker-compose logs -f
   docker-compose logs backend
   docker-compose logs frontend
   ```

5. Limpe containers:
   ```bash
   docker-compose down -v
   docker-compose up
   ```

---

### Cálculos incorretos

**Sintoma:** Resultados não batem com esperado

**Verificações:**
1. Verifique se está usando graus (não radianos)
2. Valide com calculadora online
3. Teste casos conhecidos:
   - 45° + adj=1 → op=1, hip≈1.414
   - op=3, adj=4 → hip=5, θ≈36.87°
   - 30° + adj=1 → op≈0.577, hip≈1.155

4. Verifique precisão (casas decimais)

---

### Histórico não salva

**Sintoma:** Cálculos não aparecem no histórico

**Verificações:**
1. Verifique se backend está rodando
2. Verifique console do navegador (F12 → Console)
3. Verifique se banco foi criado:
   ```bash
   ls -la backend/trig_calculator.db
   ```

4. Teste API diretamente:
   ```bash
   curl http://localhost:8000/api/calculations
   ```

5. Verifique logs do backend:
   ```bash
   # Veja output do uvicorn
   ```

---

### Interface quebrada em mobile

**Sintoma:** Layout desalinhado em celular

**Soluções:**
1. Verifique viewport no `index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. Teste em DevTools (F12 → Toggle device toolbar)

3. Verifique breakpoints do Tailwind:
   ```css
   /* mobile: sem prefixo */
   /* md: 768px */
   /* lg: 1024px */
   ```

4. Limpe cache do navegador

---

### Erro CORS

**Sintoma:** `Access to XMLHttpRequest blocked by CORS policy`

**Soluções:**
1. Verifique CORS no backend (`app/main.py`):
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Reinicie o backend

3. Verifique se frontend está em `http://localhost:5173`

---

### Validação muito rigorosa

**Sintoma:** Cálculos válidos são rejeitados

**Verificações:**
1. Ângulo deve estar entre 0° e 90° (exclusivo)
2. Catetos devem ser positivos (> 0)
3. Tolerância de inconsistência: 1e-6

Se precisar ajustar:
- Frontend: `src/lib/trig.ts` (TOLERANCE)
- Backend: `app/services/trig_service.py` (TOLERANCE)

---

### Performance lenta

**Sintoma:** Interface travada ou lenta

**Soluções:**
1. Verifique se há muitos registros no histórico
   - Limpe histórico: botão "Limpar Tudo"

2. Verifique performance do backend:
   ```bash
   # Rode com profiler
   python -m cProfile -s cumtime app/main.py
   ```

3. Verifique se há muitas abas abertas

4. Limpe cache do navegador

---

### Erro ao fazer build

**Sintoma:** `npm run build` falha

**Soluções:**
1. Verifique erros de TypeScript:
   ```bash
   npx tsc --noEmit
   ```

2. Corrija erros de tipo

3. Limpe dist:
   ```bash
   rm -rf dist
   npm run build
   ```

---

## 📞 Suporte Adicional

Se o problema persistir:

1. **Verifique logs:**
   - Frontend: Console do navegador (F12)
   - Backend: Output do terminal

2. **Teste endpoints manualmente:**
   ```bash
   curl http://localhost:8000/health
   curl http://localhost:8000/api/calculations
   ```

3. **Verifique versões:**
   ```bash
   node --version
   npm --version
   python --version
   ```

4. **Recrie ambiente:**
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Reinicie tudo:**
   ```bash
   # Mate todos os processos
   # Limpe caches
   # Comece do zero
   ```
