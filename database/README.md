# Scripts de Banco de Dados - Ecommerce

## Scripts Disponíveis

### `init.sql` - Script Principal de Inicialização
**Use este script quando o banco estiver vazio ou para resetar tudo.**

Este script único faz tudo:
- ✅ Cria o banco de dados `ecommerce_db`
- ✅ Cria todas as tabelas necessárias
- ✅ Adiciona colunas e constraints de forma segura
- ✅ Insere categorias iniciais
- ✅ Insere produtos com imagens corretas
- ✅ Pode ser executado múltiplas vezes sem erros

**Como usar:**
```bash
mysql -u root -p < database/init.sql
```

### `fix_admin_user.sql` - Corrigir Usuário Admin
**Use este script se o menu administrativo não aparecer.**

Garante que o usuário admin tenha `is_admin = 1`:
```bash
mysql -u root -p < database/fix_admin_user.sql
```

## Estrutura do Banco

### Tabelas Principais:
- `users` - Usuários do sistema (campo `is_admin` para administradores)
- `categories` - Categorias de produtos
- `products` - Produtos do ecommerce
- `orders` - Pedidos realizados
- `order_items` - Itens de cada pedido
- `password_reset_tokens` - Tokens para recuperação de senha

## Dados Iniciais

### Usuário Admin Padrão:
- **Email:** admin@example.com
- **Senha:** Admin123
- **is_admin:** 1 (criado automaticamente pelo backend)

### Categorias:
11 categorias pré-cadastradas (Fone, Smartphone, Laptop, etc.)

### Produtos:
11 produtos de exemplo com imagens em `/assets/img/`

## Notas Importantes

1. **Imagens:** As imagens devem estar na pasta `frontend/src/assets/img/`
2. **Caminhos:** Os produtos usam caminhos `/assets/img/` que são resolvidos pelo Angular
3. **Idempotência:** O script `init.sql` pode ser executado múltiplas vezes sem causar erros
4. **Segurança:** Todas as verificações usam `IF NOT EXISTS` e `INFORMATION_SCHEMA`
