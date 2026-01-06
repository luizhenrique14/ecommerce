/**
 * Logging Middleware - Intercepta todas as requisições para logging automático
 * Este middleware captura informações da requisição e responde automaticamente
 */
const loggingMiddleware = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;

    // Capturar IP do cliente
    const ip = req.ip || req.connection.remoteAddress || 
               req.headers['x-forwarded-for'] || 'unknown';

    // Interceptar resposta
    res.send = function(body) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      const success = statusCode >= 200 && statusCode < 400;

      // Apenas logar ações (POST, PUT, DELETE) - NÃO logar GET (leituras)
      if (req.method === 'GET') {
        return originalSend.call(this, body);
      }

      // Determinar tipo de ação baseado no método e rota
      const actionType = mapRouteToActionType(req.method, req.route?.path || req.path);

      // Criar metadata
      const metadata = {
        ipAddress: ip,
        endpoint: req.originalUrl,
        httpMethod: req.method,
        statusCode,
        responseTime,
        userId: req.user?.id || null,
        userEmail: req.user?.email || null,
        isAdmin: req.user?.isAdmin || false,
        success
      };

      // Log da requisição
      if (success) {
        logger.success(actionType, `${req.method} ${req.originalUrl} - ${statusCode}`, metadata);
      } else {
        logger.error(actionType, `${req.method} ${req.originalUrl} - ${statusCode}`, metadata);
      }

      // Chamar send original
      return originalSend.call(this, body);
    };

    next();
  };
};

/**
 * Mapeia rota e método para tipo de ação padronizado
 */
function mapRouteToActionType(method, route) {
  const routeMap = {
    // Auth
    'POST /api/auth/register': 'AUTH_REGISTER',
    'POST /api/auth/login': 'AUTH_LOGIN',
    'POST /api/auth/request-password-reset': 'AUTH_REQUEST_PASSWORD_RESET',
    'POST /api/auth/reset-password': 'AUTH_RESET_PASSWORD',
    
    // Categories
    'GET /api/categories': 'CATEGORY_LIST',
    'POST /api/categories': 'CATEGORY_CREATE',
    'PUT /api/categories/:id': 'CATEGORY_UPDATE',
    'DELETE /api/categories/:id': 'CATEGORY_DELETE',
    
    // Products
    'GET /api/products': 'PRODUCT_LIST',
    'GET /api/products/:id': 'PRODUCT_GET',
    'POST /api/products': 'PRODUCT_CREATE',
    'PUT /api/products/:id': 'PRODUCT_UPDATE',
    'DELETE /api/products/:id': 'PRODUCT_DELETE',
    
    // User
    'GET /api/user/profile': 'USER_PROFILE_GET',
    'PUT /api/user/profile': 'USER_PROFILE_UPDATE',
    
    // Health
    'GET /api/health': 'HEALTH_CHECK'
  };

  // Tentar encontrar rota exata
  const exactKey = `${method} ${route}`;
  if (routeMap[exactKey]) {
    return routeMap[exactKey];
  }

  // Fallback para rotas dinâmicas
  if (method === 'GET' && route.includes('/products/:id')) return 'PRODUCT_GET';
  if (method === 'DELETE' && route.includes('/products/:id')) return 'PRODUCT_DELETE';
  if (method === 'PUT' && route.includes('/categories/:id')) return 'CATEGORY_UPDATE';
  if (method === 'DELETE' && route.includes('/categories/:id')) return 'CATEGORY_DELETE';

  // Fallback genérico
  return `${method}_${route.replace(/\//g, '_').replace(/:id/g, '').toUpperCase().replace(/^_|_$/g, '')}`;
}

module.exports = loggingMiddleware;
