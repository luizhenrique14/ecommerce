# Instruções para Configurar e Subir o Backend

## 1. Criar o arquivo .env

Na pasta `backend`, crie um arquivo chamado `.env` com o seguinte conteúdo:

```
PORT=3000
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=Admin123
DB_PORT=3308
DB_NAME=ecommerce_db
JWT_SECRET=seu-secret-key-super-seguro-mude-em-producao
```

**No Windows (PowerShell):**
```powershell
cd backend
copy env.example .env
```

**No Linux/Mac:**
```bash
cd backend
cp env.example .env
```

## 2. Executar o Script SQL

Antes de iniciar o backend, execute o script SQL para criar as tabelas:

1. Abra o MySQL Workbench ou terminal MySQL
2. Execute o arquivo `database.sql` que está na pasta `database` (mesmo nível de frontend e backend)
3. Ou copie e cole o conteúdo do arquivo no MySQL

**Importante:** Certifique-se de que o banco de dados `ecommerce_db` foi criado.

## 3. Instalar Dependências

```bash
cd backend
npm install
```

## 4. Iniciar o Backend

### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

## 5. Verificar se está funcionando

Abra o navegador e acesse:
```
http://localhost:3000/api/health
```

Você deve ver:
```json
{
  "status": "OK",
  "message": "API is running"
}
```

## Credenciais Padrão

Após executar o script SQL e iniciar o backend, você pode fazer login com:
- **Email:** admin@example.com
- **Senha:** Admin123

## Solução de Problemas

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando na porta 3308
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente no MySQL Workbench

### Porta já em uso
- Altere a porta no arquivo `.env` (ex: `PORT=3001`)

### Erro ao criar tabelas
- Execute o script `database.sql` manualmente no MySQL
- Verifique se você tem permissões para criar tabelas

