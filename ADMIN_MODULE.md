# Módulo Administrativo - Documentação Técnica

## Visão Geral

Este documento descreve a implementação do módulo administrativo do e-commerce, que permite usuários com perfil ADMIN gerenciar categorias e produtos do sistema.

## Decisões Técnicas

### 1. Autenticação e Autorização

**Backend:**
- Utiliza o middleware `authenticateToken` existente para verificar JWT
- Criado novo middleware `requireAdmin` que verifica se `req.user.isAdmin === true`
- Todos os endpoints administrativos usam ambos os middlewares: `authenticateToken, requireAdmin`

**Frontend:**
- O `authGuard` existente já verifica rotas `/admin` e redireciona não-admins
- O `AuthService` armazena `isAdmin` no localStorage após login
- Componentes verificam `isAdmin` para mostrar/ocultar elementos administrativos

**Decisão:** Reutilizar a infraestrutura existente ao invés de criar novos sistemas, mantendo consistência e reduzindo complexidade.

### 2. Padrão de Imagens

**Estratégia Atual:**
- Imagens são armazenadas em `frontend/src/assets/img/`
- Caminhos são salvos no banco como `/assets/img/nome-arquivo.extensao`
- Não há upload de arquivos via API - o desenvolvedor coloca as imagens manualmente na pasta

**Decisão:** Manter o padrão existente. O formulário de cadastro de produtos aceita o caminho da imagem, seguindo o formato `/assets/img/...`. Isso evita:
- Adicionar dependências de upload (multer, etc.)
- Criar endpoints de upload
- Gerenciar armazenamento de arquivos no servidor

**Nota:** Se no futuro for necessário upload real, pode-se adicionar multer e endpoints de upload sem quebrar o código existente.

### 3. Estrutura de Endpoints

**Endpoints Administrativos:**
- `POST /api/categories` - Criar categoria (Admin only)
- `POST /api/products` - Criar produto (Admin only)
- `DELETE /api/products/:id` - Excluir produto (Admin only)

**Decisão:** Usar `/api/` ao invés de `/admin/` para manter consistência com os outros endpoints (`/api/products`, `/api/categories`). A segurança é garantida pelo middleware `requireAdmin`.

### 4. Validações

**Backend:**
- Validação de campos obrigatórios
- Validação de tipos (preço numérico, estoque inteiro)
- Validação de existência de categoria antes de criar produto
- Validação de slug único para categorias

**Frontend:**
- Validação de formulários com ReactiveForms
- Validação de padrões (slug com regex)
- Feedback visual com Material Snackbar

**Decisão:** Validação em ambas as camadas para melhor UX e segurança.

### 5. Componentes Frontend

**Estrutura:**
- `AdminProductsListComponent` - Lista todos os produtos com ações de exclusão
- `AdminProductComponent` - Formulário de cadastro de produto
- `AdminCategoryComponent` - Formulário de cadastro de categoria
- `AdminService` - Serviço para chamadas à API administrativa

**Decisão:** Componentes standalone seguindo o padrão do projeto. Cada componente tem responsabilidade única.

## Arquivos Criados/Modificados

### Backend

**Modificados:**
- `backend/server.js`
  - Adicionado middleware `requireAdmin`
  - Criados endpoints: `POST /api/categories`, `POST /api/products`, `DELETE /api/products/:id`
  - Removido endpoint antigo `/admin/products` (substituído por `/api/products`)

### Frontend

**Novos Arquivos:**
- `frontend/src/app/services/admin.service.ts` - Serviço para operações administrativas
- `frontend/src/app/components/admin-category/` - Componente de cadastro de categoria
- `frontend/src/app/components/admin-product/` - Componente de cadastro de produto (melhorado)
- `frontend/src/app/components/admin-products-list/` - Componente de listagem e gerenciamento de produtos

**Modificados:**
- `frontend/src/app/app.routes.ts` - Adicionadas rotas administrativas
- `frontend/src/app/components/sidenav/sidenav.component.html` - Adicionado menu administrativo

## Como Usar

### Para Administradores

1. **Acessar Painel Admin:**
   - Faça login como admin (admin@example.com / Admin123)
   - No menu lateral, aparecerá a seção "Administração"
   - Clique em "Gerenciar Produtos" para ver a lista

2. **Cadastrar Categoria:**
   - Menu lateral → "Nova Categoria"
   - Preencha: Nome, Slug (gerado automaticamente), Ícone (Material Icon)
   - Clique em "Salvar Categoria"

3. **Cadastrar Produto:**
   - Menu lateral → "Novo Produto" ou botão "Novo Produto" na lista
   - Preencha todos os campos obrigatórios
   - Para imagem: coloque o arquivo em `frontend/src/assets/img/` e use o caminho `/assets/img/nome-arquivo.extensao`
   - Clique em "Salvar Produto"

4. **Excluir Produto:**
   - Na lista de produtos administrativa, clique no ícone de lixeira
   - Confirme a exclusão

### Para Desenvolvedores

**Adicionar Novo Endpoint Admin:**
```javascript
app.post('/api/seu-endpoint', authenticateToken, requireAdmin, async (req, res) => {
  // Sua lógica aqui
});
```

**Adicionar Nova Rota Admin no Frontend:**
```typescript
// app.routes.ts
{ path: 'admin/seu-componente', component: SeuComponente, canActivate: [authGuard] }
```

O `authGuard` já protege automaticamente rotas que começam com `/admin`.

## Segurança

### Backend
- ✅ Todos os endpoints administrativos requerem autenticação (JWT)
- ✅ Todos os endpoints administrativos verificam `isAdmin === true`
- ✅ Validação de dados de entrada
- ✅ Verificação de existência de relacionamentos (categoria existe antes de criar produto)

### Frontend
- ✅ Guard de rota bloqueia acesso não-admin
- ✅ Menu administrativo só aparece para admins
- ✅ Serviço admin inclui token JWT em todas as requisições
- ✅ Validação de formulários

### Testes de Segurança

Para testar se a segurança está funcionando:

1. **Como usuário comum:**
   - Tente acessar `/admin/products` diretamente na URL
   - Deve redirecionar para `/products`

2. **Via API (sem token):**
   ```bash
   curl -X POST http://localhost:3000/api/products
   # Deve retornar 401 Unauthorized
   ```

3. **Via API (com token de usuário comum):**
   ```bash
   curl -X POST http://localhost:3000/api/products \
     -H "Authorization: Bearer TOKEN_DO_USUARIO_COMUM"
   # Deve retornar 403 Forbidden
   ```

## Banco de Dados

### Tabelas Utilizadas

- `categories` - Já existente, sem modificações
- `products` - Já existente, sem modificações
- `users` - Campo `is_admin` já existe

### Estrutura de Dados

**Categoria:**
```json
{
  "name": "Smartphone",
  "slug": "smartphone",
  "icon": "smartphone"
}
```

**Produto:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Smartphone de última geração",
  "price": 4999.99,
  "image": "/assets/img/iphone-15.jpg",
  "images": ["/assets/img/iphone-15.jpg", "/assets/img/iphone-15-2.jpg"],
  "category_id": 2,
  "stock": 30
}
```

## Próximos Passos (Opcional)

1. **Upload de Imagens Real:**
   - Adicionar multer no backend
   - Criar endpoint `POST /api/upload`
   - Modificar componente de produto para fazer upload antes de salvar

2. **Edição de Produtos/Categorias:**
   - Criar endpoints `PUT /api/products/:id` e `PUT /api/categories/:id`
   - Criar componentes de edição

3. **Paginação na Lista Admin:**
   - Adicionar paginação na lista de produtos administrativa

4. **Filtros e Busca:**
   - Adicionar busca por nome na lista administrativa
   - Filtros por categoria

## Conclusão

O módulo administrativo foi implementado seguindo os padrões existentes do projeto, reutilizando infraestrutura de autenticação e mantendo consistência com o código atual. A segurança está garantida em múltiplas camadas e o sistema é extensível para futuras funcionalidades.

