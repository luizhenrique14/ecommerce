/**
 * LoggerService - Serviço centralizado de logging
 * Loga no console e persiste no banco de dados
 */
class LoggerService {
  constructor(logRepository) {
    this.logRepository = logRepository;
    this.logLevels = {
      DEBUG: 'DEBUG',
      INFO: 'INFO',
      WARN: 'WARN',
      ERROR: 'ERROR'
    };
  }

  /**
   * Log genérico
   */
  async log(actionType, message, metadata = {}) {
    const logEntry = {
      actionType,
      message,
      metadata: JSON.stringify(metadata),
      level: metadata.level || this.logLevels.INFO,
      status: metadata.status || 'SUCCESS',
      // Campos adicionais para o banco
      ipAddress: metadata.ipAddress || null,
      userId: metadata.userId || null,
      userEmail: metadata.userEmail || null,
      endpoint: metadata.endpoint || null,
      httpMethod: metadata.httpMethod || null,
      responseTime: metadata.responseTime || null
    };

    // Log no console com formato padronizado
    this._consoleLog(logEntry);

    // Persistir no banco
    if (this.logRepository) {
      try {
        await this.logRepository.create(logEntry);
      } catch (error) {
        console.error('[LOGGER][DB ERROR] Falha ao persistir log:', error.message);
      }
    }
  }

  /**
   * Log de sucesso
   */
  async success(actionType, message, metadata = {}) {
    return this.log(actionType, message, { ...metadata, status: 'SUCCESS' });
  }

  /**
   * Log de erro
   */
  async error(actionType, message, metadata = {}) {
    return this.log(actionType, message, { 
      ...metadata, 
      status: 'ERROR',
      level: this.logLevels.ERROR 
    });
  }

  /**
   * Log de warning
   */
  async warn(actionType, message, metadata = {}) {
    return this.log(actionType, message, { 
      ...metadata, 
      status: 'WARNING',
      level: this.logLevels.WARN 
    });
  }

  /**
   * Log de debug
   */
  async debug(actionType, message, metadata = {}) {
    return this.log(actionType, message, { 
      ...metadata, 
      level: this.logLevels.DEBUG 
    });
  }

  /**
   * Formata e exibe log no console
   */
  _consoleLog(entry) {
    const timestamp = new Date().toISOString();
    const { actionType, message, level, status } = entry;
    
    const prefix = `[${timestamp}] [${level}] [${actionType}]`;
    const emoji = this._getEmoji(level, status);
    
    console.log(`${emoji} ${prefix}: ${message}`);
    
    // Se houver metadata, exibe
    if (entry.metadata && entry.metadata !== '{}') {
      try {
        const parsed = JSON.parse(entry.metadata);
        if (Object.keys(parsed).length > 0) {
          console.log(`    Metadata: ${JSON.stringify(parsed)}`);
        }
      } catch (e) {
        console.log(`    Metadata: ${entry.metadata}`);
      }
    }
  }

  /**
   * Retorna emoji baseado no nível e status
   */
  _getEmoji(level, status) {
    if (level === this.logLevels.ERROR || status === 'ERROR') return '❌';
    if (status === 'WARNING' || level === this.logLevels.WARN) return '⚠️';
    if (level === this.logLevels.DEBUG) return '🔍';
    return '✅';
  }
}

module.exports = LoggerService;
