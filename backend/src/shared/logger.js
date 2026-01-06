/**
 * Logger Helper - Funções auxiliares para logging de ações específicas
 * Use este módulo para logar ações importantes do sistema
 */

const logger = require('../application/services/LoggerService');
const logRepository = require('../adapters/repositories/LogRepository');

// Instância do logger (inicializada lazy para evitar erros de dependência circular)
let loggerInstance = null;

function getLogger() {
  if (!loggerInstance) {
    loggerInstance = new logger(logRepository);
  }
  return loggerInstance;
}

/**
 * Loga uma ação realizada por um usuário
 * @param {Object} req - Objeto de requisição do Express (contém req.user)
 * @param {string} actionType - Tipo da ação (ex: PRODUCT_CREATE, ORDER_COMPLETE)
 * @param {string} message - Mensagem descritiva
 * @param {Object} additionalData - Dados adicionais para o log
 */
function logAction(req, actionType, message, additionalData = {}) {
  const l = getLogger();
  
  const metadata = {
    userId: req.user?.id || null,
    userEmail: req.user?.email || null,
    isAdmin: req.user?.isAdmin || false,
    ipAddress: req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
    ...additionalData
  };
  
  l.success(actionType, message, metadata);
}

/**
 * Loga uma ação de criação
 */
function logCreate(req, entityType, entityName, additionalData = {}) {
  logAction(req, `${entityType}_CREATE`, `Criação de ${entityType}: ${entityName}`, additionalData);
}

/**
 * Loga uma ação de atualização
 */
function logUpdate(req, entityType, entityId, additionalData = {}) {
  logAction(req, `${entityType}_UPDATE`, `Atualização de ${entityType} ID: ${entityId}`, additionalData);
}

/**
 * Loga uma ação de exclusão
 */
function logDelete(req, entityType, entityId, additionalData = {}) {
  logAction(req, `${entityType}_DELETE`, `Exclusão de ${entityType} ID: ${entityId}`, additionalData);
}

/**
 * Loga uma ação de compra/pedido
 */
function logOrder(req, orderId, orderDetails = {}) {
  logAction(req, 'ORDER_COMPLETE', `Pedido #${orderId} concluído`, {
    orderId,
    total: orderDetails.total,
    itemsCount: orderDetails.itemsCount,
    ...orderDetails
  });
}

/**
 * Loga autenticação
 */
function logAuth(req, actionType, success, additionalData = {}) {
  const l = getLogger();
  const metadata = {
    ipAddress: req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
    ...additionalData
  };
  
  if (success) {
    l.success(actionType, `Autenticação bem-sucedida: ${req.body?.email || 'unknown'}`, metadata);
  } else {
    l.error(actionType, `Autenticação falhou: ${req.body?.email || 'unknown'}`, metadata);
  }
}

/**
 * Loga erro
 */
function logError(req, actionType, errorMessage, additionalData = {}) {
  const l = getLogger();
  
  const metadata = {
    userId: req.user?.id || null,
    userEmail: req.user?.email || null,
    ipAddress: req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
    error: errorMessage,
    ...additionalData
  };
  
  l.error(actionType, errorMessage, metadata);
}

module.exports = {
  logAction,
  logCreate,
  logUpdate,
  logDelete,
  logOrder,
  logAuth,
  logError,
  getLogger
};
