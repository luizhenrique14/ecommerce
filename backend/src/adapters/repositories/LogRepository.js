const db = require('../database/pool');

/**
 * LogRepository - Repositório para persistência de logs no banco
 */
class LogRepository {
  constructor() {
    this.tableName = 'api_logs';
  }

  /**
   * Cria um novo registro de log
   */
  async create(logEntry) {
    const connection = await db.getConnection();
    try {
      const { actionType, message, metadata, level, status, ipAddress, userId, userEmail, endpoint, httpMethod, responseTime } = logEntry;
      
      await connection.query(`
        INSERT INTO ${this.tableName} (action_type, message, metadata, level, status, ip_address, user_id, user_email, endpoint, http_method, response_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [actionType, message, metadata, level, status, ipAddress, userId, userEmail, endpoint, httpMethod, responseTime]);
      
      return true;
    } finally {
      connection.release();
    }
  }

  /**
   * Busca logs por tipo de ação
   */
  async findByActionType(actionType, limit = 100) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT * FROM ${this.tableName}
        WHERE action_type = ?
        ORDER BY created_at DESC
        LIMIT ?
      `, [actionType, limit]);
      return rows;
    } finally {
      connection.release();
    }
  }

  /**
   * Busca logs por status
   */
  async findByStatus(status, limit = 100) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT * FROM ${this.tableName}
        WHERE status = ?
        ORDER BY created_at DESC
        LIMIT ?
      `, [status, limit]);
      return rows;
    } finally {
      connection.release();
    }
  }

  /**
   * Busca logs recentes
   */
  async findRecent(limit = 100) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT * FROM ${this.tableName}
        ORDER BY created_at DESC
        LIMIT ?
      `, [limit]);
      return rows;
    } finally {
      connection.release();
    }
  }

  /**
   * Limpa logs antigos (manutenção)
   */
  async deleteOlderThan(days) {
    const connection = await db.getConnection();
    try {
      await connection.query(`
        DELETE FROM ${this.tableName}
        WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
      `, [days]);
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = LogRepository;
