# Padrões de Código - Calculadora de Trigonometria

## 🐍 Backend (Python/FastAPI)

### Estrutura de Arquivos
- `models.py`: Modelos SQLModel (tabelas do banco)
- `schemas.py`: Schemas Pydantic (validação de entrada/saída)
- `services/`: Lógica de negócio
- `route_handlers/`: Handlers de rotas
- `middleware/`: Middleware de autenticação

### Convenções
- Use type hints em todas as funções
- Docstrings para funções públicas
- Nome de variáveis em snake_case
- Nome de classes em PascalCase
- Constantes em UPPER_CASE

### Exemplo de Rota
```python
@router.post("/api/auth/login")
def login(credentials: LoginRequest, db: Session = Depends(get_session)):
    """Autentica usuário e retorna token JWT"""
    user = AuthService.authenticate(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = AuthService.create_token(user)
    return {"token": token, "user": user}
```

### Tratamento de Erros
- Use HTTPException para erros de API
- Status codes apropriados (401, 404, 500)
- Mensagens de erro claras em português

## ⚛️ Frontend (React/TypeScript)

### Estrutura de Componentes
- Um componente por arquivo
- Nome do arquivo = nome do componente (PascalCase)
- Props tipadas com interfaces
- Use functional components + hooks

### Convenções
- Nome de variáveis em camelCase
- Nome de componentes em PascalCase
- Nome de arquivos de componentes em PascalCase
- Constantes em UPPER_CASE

### Exemplo de Componente
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Estado e Context
- Use useState para estado local
- Use useContext para estado global (AuthContext)
- Use useEffect para side effects
- Evite prop drilling - use Context quando necessário

### Estilização
- Use TailwindCSS classes
- Inline styles apenas quando necessário
- Mantenha consistência visual

## 🔐 Segurança

### Backend
- Sempre valide entrada do usuário
- Use bcrypt para hash de senhas
- JWT com expiração
- CORS configurado corretamente
- Nunca exponha DATABASE_URL ou JWT_SECRET

### Frontend
- Armazene token no localStorage
- Limpe token no logout
- Redirecione usuários não autenticados
- Valide role do usuário antes de mostrar UI admin

## 🧪 Testes

### Backend
- Use pytest
- Teste cada endpoint
- Teste casos de erro
- Mock do banco de dados

### Frontend
- Use vitest
- Teste componentes críticos
- Teste lógica de negócio (lib/trig.ts)

## 📝 Commits

### Mensagens de Commit
- Use português
- Seja descritivo
- Formato: `tipo: descrição`

Exemplos:
- `feat: adiciona autenticação JWT`
- `fix: corrige cálculo de tangente`
- `docs: atualiza README`
- `refactor: reorganiza estrutura de pastas`
