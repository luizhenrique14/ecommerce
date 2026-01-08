# Ecommerce - Projeto Completo

Projeto de ecommerce com frontend em Angular e backend em Node.js/Express, seguindo arquitetura limpa (Clean Architecture).

## Estrutura do Projeto

```
teste_cursor/
├── frontend/          # Aplicação Angular 17+
├── backend/           # API Node.js/Express (Clean Architecture)
├── database/          # Scripts SQL do banco de dados
└── README.md
```

## Arquitetura do Backend (Clean Architecture)

```
backend/src/
├── application/       # Casos de uso e serviços
│   ├── services/      # Serviços compartilhados (LoggerService)
│   └── usecases/      # Casos de uso por domínio
│       ├── auth/      # Login, Registro, Recuperação de Senha
│       ├── categories/# CRUD de Categorias
│       └── products/  # CRUD de Produtos
├── domain/            # Entidades e interfaces (regras de negócio)
│   ├── entities/      # Entidades (Product, Category, User)
│   └── ports/         # Interfaces de repositório
├── infrastructure/    # Implementações externas
│   └── database/      # Pool de conexão MySQL
├── adapters/          # Adaptadores externos
│   ├── repositories/  # Implementações de repositório
│   └── database/      # Configuração de banco
├── presentation/      # Camada de apresentação
│   ├── controllers/   # Controladores HTTP
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── products/
│   │   └── users/
│   └── middlewares/   # Middlewares (logging)
├── config/            # Configurações (banco de dados)
└── shared/            # Utilitários compartilhados
```

## Pré-requisitos

-   Node.js (v18 ou superior)
-   MySQL (v8 ou superior)
-   Angular CLI (será instalado via npm)

## Configuração do Backend

1. Navegue até a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env`:

```bash
copy env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL:

```
PORT=3000
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=Admin123
DB_PORT=3308
DB_NAME=ecommerce_db
JWT_SECRET=seu-secret-key-super-seguro-mude-em-producao
```

4. Execute o script SQL para criar o banco de dados e tabelas:

    - Abra o MySQL Workbench
    - Execute o arquivo `database/init.sql`
    - Ou via linha de comando: `mysql -u admin -pAdmin123 -P 3308 < database/init.sql`

5. Inicie o servidor:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Configuração do Frontend

1. Navegue até a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

A aplicação estará rodando em `http://localhost:4200`

## Credenciais Padrão

Após a inicialização do banco de dados, um usuário administrador será criado:

-   **Email:** admin@example.com
-   **Senha:** Admin123

## Funcionalidades

### Frontend (Angular 17+)

| Componente            | Funcionalidade                         |
| --------------------- | -------------------------------------- |
| **Login**             | Autenticação de usuários com validação |
| **Register**          | Registro de novos usuários             |
| **Products**          | Catálogo de produtos com filtros       |
| **ProductDetail**     | Visualização detalhada de produtos     |
| **AdminProduct**      | CRUD de produtos (admin)               |
| **AdminProductsList** | Lista de produtos para administração   |
| **AdminCategory**     | CRUD de categorias (admin)             |
| **Checkout**          | Processo de compra em 3 etapas         |
| **PasswordReset**     | Solicitação de recuperação de senha    |
| **ResetPassword**     | Redefinição de senha via token         |
| **Sidenav**           | Navegação lateral                      |
| **Success**           | Confirmação de compra                  |

**Serviços:**

-   `AuthService` - Autenticação e gerenciamento de tokens JWT
-   `ProductService` - Operações com produtos
-   `CartService` - Gerenciamento do carrinho de compras
-   `AdminService` - Operações administrativas

**Guardas:**

-   `AuthGuard` - Proteção de rotas autenticadas

### Backend (Node.js/Express)

| Módulo         | Endpoints                         | Funcionalidade                 |
| -------------- | --------------------------------- | ------------------------------ |
| **Auth**       | POST /auth/register               | Registro de usuário            |
|                | POST /auth/login                  | Login com JWT                  |
|                | POST /auth/request-password-reset | Solicitar recuperação de senha |
|                | POST /auth/reset-password         | Redefinir senha                |
| **Products**   | GET /products                     | Listar produtos                |
|                | GET /products/:id                 | Obter produto por ID           |
|                | POST /products                    | Criar produto (admin)          |
|                | PUT /products/:id                 | Atualizar produto (admin)      |
|                | DELETE /products/:id              | Excluir produto (admin)        |
| **Categories** | GET /categories                   | Listar categorias              |
|                | POST /categories                  | Criar categoria (admin)        |
|                | PUT /categories/:id               | Atualizar categoria (admin)    |
|                | DELETE /categories/:id            | Excluir categoria (admin)      |
| **Users**      | GET /user/profile                 | Perfil do usuário              |
|                | PUT /user/profile                 | Atualizar perfil               |

## Endpoints da API

### Autenticação

-   `POST /api/auth/register` - Registrar novo usuário
-   `POST /api/auth/login` - Fazer login
-   `POST /api/auth/request-password-reset` - Solicitar recuperação de senha
-   `POST /api/auth/reset-password` - Redefinir senha com token

### Produtos

-   `GET /api/products` - Listar todos os produtos
-   `GET /api/products/:id` - Obter produto específico
-   `POST /api/products` - Criar produto (admin)
-   `PUT /api/products/:id` - Atualizar produto (admin)
-   `DELETE /api/products/:id` - Excluir produto (admin)

### Categorias

-   `GET /api/categories` - Listar categorias
-   `POST /api/categories` - Criar categoria (admin)
-   `PUT /api/categories/:id` - Atualizar categoria (admin)
-   `DELETE /api/categories/:id` - Excluir categoria (admin)

### Usuário

-   `GET /api/user/profile` - Obter perfil (protegido)
-   `PUT /api/user/profile` - Atualizar perfil (protegido)

## Tecnologias Utilizadas

### Frontend

-   Angular 17
-   Angular Material
-   RxJS
-   TypeScript
-   SCSS

### Backend

-   Node.js
-   Express
-   MySQL2
-   JWT (jsonwebtoken)
-   bcryptjs
-   CORS

### Banco de Dados

-   MySQL 8
-   Tabelas: users, products, categories, api_logs

## Estrutura de Telas

1. **Login** (`/login`)

    - Formulário de email e senha
    - Validação de campos
    - Link para registro e recuperação de senha

2. **Registro** (`/register`)

    - Criação de nova conta
    - Validação de email e senha

3. **Produtos** (`/products`)

    - Listagem de produtos em grid
    - Cards com imagem, nome, preço
    - Adicionar produtos ao carrinho
    - Badge com quantidade de itens
    - Filtro por categoria
    - Logout

4. **Detalhe do Produto** (`/products/:id`)

    - Visualização completa do produto
    - Adicionar ao carrinho

5. **Checkout** (`/checkout`)

    - Step 1: Revisar carrinho
    - Step 2: Endereço de entrega
    - Step 3: Informações de pagamento
    - Finalizar compra

6. **Sucesso** (`/success`)

    - Confirmação de pagamento
    - Resumo do pedido
    - Botão para continuar comprando

7. **Administração**
    - `/admin/products` - Gerenciar produtos
    - `/admin/categories` - Gerenciar categorias

## Notas

-   O carrinho é armazenado no localStorage do navegador
-   Os produtos são carregados do banco de dados MySQL
-   A autenticação utiliza JWT tokens
-   As senhas são criptografadas com bcrypt
-   Logging de API salvo na tabela `api_logs`
-   Middleware de logging para todas as requisições
