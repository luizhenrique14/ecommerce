# Guia de Instalação - Ecommerce

## Passo a Passo para Configurar o Projeto

### 1. Pré-requisitos

Certifique-se de ter instalado:
- Node.js (versão 18 ou superior) - [Download](https://nodejs.org/)
- MySQL (versão 8 ou superior) - [Download](https://www.mysql.com/downloads/)
- npm (vem com Node.js)

### 2. Configuração do Banco de Dados MySQL

1. Abra o MySQL Workbench ou terminal MySQL
2. Execute o comando para criar o banco de dados:

```sql
CREATE DATABASE ecommerce_db;
```

3. Anote suas credenciais do MySQL (host, usuário, senha)

### 3. Configuração do Backend

1. Abra um terminal e navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` na pasta `backend`:
```bash
# No Windows (PowerShell)
copy env.example .env

# No Linux/Mac
cp env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do MySQL:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=ecommerce_db
DB_PORT=3308
JWT_SECRET=seu-secret-key-super-seguro-aqui
```

**Importante:** Altere `DB_PASSWORD` para sua senha do MySQL e `JWT_SECRET` para uma chave secreta aleatória.

5. Inicie o servidor backend:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

**Nota:** Na primeira execução, o backend criará automaticamente as tabelas e inserirá dados iniciais (produtos e usuário admin).

### 4. Configuração do Frontend

1. Abra um **novo terminal** e navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

**Nota:** A instalação pode levar alguns minutos na primeira vez.

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará rodando em `http://localhost:4200`

### 5. Acessar a Aplicação

1. Abra seu navegador e acesse: `http://localhost:4200`
2. Você será redirecionado para a tela de login
3. Use as credenciais padrão:
   - **Email:** admin@example.com
   - **Senha:** admin123

### 6. Estrutura de Telas

Após o login, você terá acesso a:

1. **Tela de Produtos** (`/products`)
   - Visualize todos os produtos disponíveis
   - Adicione produtos ao carrinho
   - Veja a quantidade de itens no carrinho no ícone do carrinho

2. **Tela de Checkout** (`/checkout`)
   - Acesse clicando no ícone do carrinho
   - Workflow em 3 etapas:
     - **Etapa 1:** Revisar carrinho (adicionar/remover itens)
     - **Etapa 2:** Informações de entrega
     - **Etapa 3:** Informações de pagamento

3. **Tela de Sucesso** (`/success`)
   - Aparece após finalizar o pagamento
   - Permite continuar comprando

### 7. Comandos Úteis

#### Backend
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com auto-reload)

#### Frontend
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção

### 8. Solução de Problemas

#### Erro de conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados `ecommerce_db` foi criado

#### Erro "Cannot find module"
- Execute `npm install` novamente na pasta correspondente
- Delete a pasta `node_modules` e execute `npm install` novamente

#### Porta já em uso
- Backend: Altere a porta no arquivo `.env` (ex: `PORT=3001`)
- Frontend: Use `ng serve --port 4201` para usar outra porta

#### CORS Error
- Certifique-se de que o backend está rodando na porta 3000
- Verifique se a URL da API no `auth.service.ts` está correta

### 9. Desenvolvimento

Para desenvolvimento, mantenha ambos os servidores rodando:
- Terminal 1: Backend (`cd backend && npm run dev`)
- Terminal 2: Frontend (`cd frontend && npm start`)

### 10. Próximos Passos

Após a instalação bem-sucedida, você pode:
- Personalizar os produtos no banco de dados
- Adicionar mais funcionalidades ao backend
- Customizar o design do frontend
- Adicionar mais validações e segurança

