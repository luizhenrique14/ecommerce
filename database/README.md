# Scripts de Banco de Dados - Ecommerce

## Script Principal

### `init.sql` - Script de Inicialização Completo
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

Ou copie e cole o conteúdo no seu cliente MySQL (Workbench, phpMyAdmin, etc.)

## Estrutura do Banco

### Tabelas Principais:
- `users` - Usuários do sistema
- `categories` - Categorias de produtos
- `products` - Produtos do ecommerce
- `orders` - Pedidos realizados
- `order_items` - Itens de cada pedido
- `password_reset_tokens` - Tokens para recuperação de senha

## Dados Iniciais

### Categorias:
- Fone
- Smartphone
- Laptop
- Mouse
- Teclados
- Capinhas
- Tablet
- Monitor
- Cabos e Acessórios
- Carregadores
- Películas

### Produtos:
11 produtos de exemplo, cada um com:
- Nome e descrição
- Preço
- Imagem principal (`/assets/img/...`)
- Múltiplas imagens (array JSON)
- Categoria associada
- Estoque

### Usuário Admin:
O usuário admin padrão será criado automaticamente pelo backend na primeira execução:
- **Email:** admin@example.com
- **Senha:** Admin123

## Scripts Antigos (Arquivos de Referência)

Os seguintes arquivos são mantidos apenas para referência:
- `database.sql` - Script inicial básico
- `database_v2.sql` - Versão com categorias
- `database_v2_safe.sql` - Versão segura de atualização
- `update_images.sql` - Script para atualizar apenas imagens

**Recomendação:** Use apenas `init.sql` para inicialização completa.

## Notas Importantes

1. **Imagens:** As imagens devem estar na pasta `frontend/src/assets/img/`
2. **Caminhos:** Os produtos usam caminhos `/assets/img/` que são resolvidos pelo Angular
3. **Idempotência:** O script pode ser executado múltiplas vezes sem causar erros
4. **Segurança:** Todas as verificações usam `IF NOT EXISTS` e `INFORMATION_SCHEMA`
