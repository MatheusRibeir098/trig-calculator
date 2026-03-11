# Design: Adicionar Novo Tipo de Usuário

## 🎨 Arquitetura

### Backend Changes

**1. Modelo User (backend/app/models.py)**
```python
class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: int = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    role: str = Field(default="Common_User")  # Adicionar novo role aqui
    # Valores possíveis: "Admin_User", "Common_User", "Teacher_User", etc
```

**2. Schema de Validação (backend/app/schemas.py)**
```python
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin_User"
    COMMON = "Common_User"
    TEACHER = "Teacher_User"  # Novo role

class UserCreate(BaseModel):
    username: str
    password: str
    role: UserRole = UserRole.COMMON
```

**3. Middleware de Autorização (backend/app/middleware/auth.py)**
```python
def require_role(allowed_roles: List[str]):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.role not in allowed_roles:
                raise HTTPException(403, "Forbidden")
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Uso:
@router.get("/teacher/dashboard")
@require_role(["Admin_User", "Teacher_User"])
def teacher_dashboard():
    pass
```

### Frontend Changes

**1. AuthContext (frontend/src/context/AuthContext.tsx)**
```typescript
export interface User {
  id: number;
  username: string;
  role: 'Common_User' | 'Admin_User' | 'Teacher_User';  // Adicionar novo role
}
```

**2. Rotas Protegidas (frontend/src/main.tsx)**
```typescript
<Route
  path="/teacher"
  element={
    <ProtectedRoute requiredRole="Teacher_User">
      <TeacherPanel />
    </ProtectedRoute>
  }
/>
```

**3. Componente ProtectedRoute (frontend/src/components/ProtectedRoute.tsx)**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Common_User' | 'Admin_User' | 'Teacher_User';
}
```

**4. Redirect após Login (frontend/src/pages/LoginPage.tsx)**
```typescript
if (response.data.user.role === 'Admin_User') {
  navigate('/admin', { replace: true });
} else if (response.data.user.role === 'Teacher_User') {
  navigate('/teacher', { replace: true });
} else {
  navigate('/calculator', { replace: true });
}
```

## 📊 Fluxo de Dados

```
1. Admin cria usuário com novo role
   ↓
2. Backend valida role (UserRole enum)
   ↓
3. Salva no banco de dados
   ↓
4. Usuário faz login
   ↓
5. Backend retorna token + user com role
   ↓
6. Frontend armazena no AuthContext
   ↓
7. Frontend redireciona baseado no role
   ↓
8. ProtectedRoute valida acesso
```

## 🗄️ Mudanças no Banco de Dados

Não é necessário migração - o campo `role` já existe como string.
Apenas adicione novos valores possíveis.

## 🧪 Testes

**Backend:**
```python
def test_create_user_with_teacher_role():
    user = UserCreate(username="teacher1", password="pass", role="Teacher_User")
    created = create_user(db, user)
    assert created.role == "Teacher_User"

def test_teacher_access_teacher_dashboard():
    response = client.get("/teacher/dashboard", headers=teacher_headers)
    assert response.status_code == 200

def test_common_user_cannot_access_teacher_dashboard():
    response = client.get("/teacher/dashboard", headers=common_headers)
    assert response.status_code == 403
```

**Frontend:**
```typescript
test('redirects teacher to teacher dashboard', () => {
  const user = { id: 1, username: 'teacher1', role: 'Teacher_User' };
  // Test redirect logic
});
```

## 📝 Documentação

Atualizar:
- `docs/ARCHITECTURE.md` - Adicionar novo role
- `docs/README.md` - Documentar permissões
- `.kiro/steering/project-overview.md` - Atualizar tipos de usuário
