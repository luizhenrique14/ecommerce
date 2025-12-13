# Ecommerce - Projeto Completo

Projeto de ecommerce com frontend em Angular e backend em Node.js/Express.

## Estrutura do Projeto

```
teste_cursor/
├── frontend/          # Aplicação Angular
├── backend/           # API Node.js/Express
├── database/          # Scripts SQL do banco de dados
│   ├── database.sql  # Script principal de criação das tabelas
│   └── README.md       # Documentação dos scripts
└── README.md
```

## Pré-requisitos

- Node.js (v18 ou superior)
- MySQL (v8 ou superior)
- Angular CLI (será instalado via npm)

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
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=ecommerce_db
DB_PORT=3308
JWT_SECRET=seu-secret-key-aqui
```

4. Execute o script SQL para criar o banco de dados e tabelas:
   - Abra o MySQL Workbench
   - Execute o arquivo `database/database.sql`
   - Ou via linha de comando: `mysql -u admin -pAdmin123 -P 3308 < database/database.sql`

5. Inicie o servidor:
```bash
npm start
# ou para desenvolvimento com auto-reload:
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

Após a inicialização do banco de dados, um usuário padrão será criado:

- **Email:** admin@example.com
- **Senha:** Admin123

## Funcionalidades

### Frontend (Angular + Material Design)
- ✅ Tela de login
- ✅ Tela de produtos com carrinho
- ✅ Workflow de checkout (3 etapas)
- ✅ Tela de sucesso no pagamento
- ✅ Autenticação com JWT
- ✅ Gerenciamento de carrinho

### Backend (Node.js/Express)
- ✅ API de autenticação (login/registro)
- ✅ Endpoints protegidos com JWT
- ✅ Integração com MySQL
- ✅ CRUD de produtos
- ✅ Inicialização automática do banco de dados

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Produtos
- `GET /api/products` - Listar produtos

### Usuário
- `GET /api/user/profile` - Obter perfil do usuário (protegido)

## Tecnologias Utilizadas

### Frontend
- Angular 17
- Angular Material
- RxJS
- TypeScript

### Backend
- Node.js
- Express
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## Estrutura de Telas

1. **Login** (`/login`)
   - Formulário de email e senha
   - Validação de campos
   - Redirecionamento após login

2. **Produtos** (`/products`)
   - Listagem de produtos em grid
   - Adicionar produtos ao carrinho
   - Badge com quantidade de itens
   - Logout

3. **Checkout** (`/checkout`)
   - Step 1: Revisar carrinho
   - Step 2: Endereço de entrega
   - Step 3: Informações de pagamento
   - Finalizar compra

4. **Sucesso** (`/success`)
   - Confirmação de pagamento
   - Botão para continuar comprando

## Notas

- O carrinho é armazenado no localStorage do navegador
- Os produtos são carregados do banco de dados MySQL
- A autenticação utiliza JWT tokens
- As senhas são criptografadas com bcrypt

