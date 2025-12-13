# Scripts de Banco de Dados

Esta pasta contém os scripts SQL para criar e configurar o banco de dados do ecommerce.

## Arquivos

- `database.sql` - Script principal para criar todas as tabelas e dados iniciais

## Como Usar

### Opção 1: MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte-se ao servidor MySQL (porta 3308)
3. Abra o arquivo `database.sql`
4. Execute o script completo (Ctrl+Shift+Enter)

### Opção 2: Linha de Comando MySQL

```bash
mysql -u admin -pAdmin123 -P 3308 < database.sql
```

### Opção 3: Copiar e Colar

1. Abra o arquivo `database.sql`
2. Copie todo o conteúdo
3. Cole no MySQL Workbench ou terminal MySQL
4. Execute

## Estrutura das Tabelas

### users
- Armazena os usuários do sistema
- Campos: id, email, password, name, created_at

### products
- Armazena os produtos disponíveis
- Campos: id, name, description, price, image, stock, created_at, updated_at

### orders
- Armazena os pedidos realizados
- Campos: id, user_id, total, status, shipping_address, shipping_name, shipping_city, shipping_zip_code, shipping_phone, created_at, updated_at
- Relacionamento: FOREIGN KEY com users

### order_items
- Armazena os itens de cada pedido
- Campos: id, order_id, product_id, quantity, price, subtotal, created_at
- Relacionamentos: FOREIGN KEY com orders e products

## Dados Iniciais

O script já inclui:
- 6 produtos iniciais
- O usuário admin será criado automaticamente pelo backend na primeira execução

## Credenciais Padrão

Após executar o script e iniciar o backend, você pode fazer login com:
- **Email:** admin@example.com
- **Senha:** Admin123

