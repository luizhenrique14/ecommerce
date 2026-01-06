-- Script de criação da tabela de logs da API
-- Execute este script para criar a tabela api_logs no banco de dados

CREATE TABLE IF NOT EXISTS api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL COMMENT 'Tipo da ação (ex: CREATE_PRODUCT, LOGIN, DELETE_CATEGORY)',
    message TEXT NOT NULL COMMENT 'Mensagem descritiva do log',
    metadata JSON COMMENT 'Metadados adicionais em formato JSON (payload, user info, etc)',
    level VARCHAR(20) NOT NULL DEFAULT 'INFO' COMMENT 'Nível do log (DEBUG, INFO, WARN, ERROR)',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' COMMENT 'Status da operação (SUCCESS, ERROR, WARNING)',
    ip_address VARCHAR(45) COMMENT 'Endereço IP do cliente',
    user_id INT NULL COMMENT 'ID do usuário (se autenticado)',
    user_email VARCHAR(255) NULL COMMENT 'Email do usuário (se autenticado)',
    endpoint VARCHAR(500) COMMENT 'Endpoint acessado',
    http_method VARCHAR(10) COMMENT 'Método HTTP (GET, POST, PUT, DELETE)',
    response_time INT COMMENT 'Tempo de resposta em milissegundos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data/hora de criação do registro',
    
    INDEX idx_action_type (action_type),
    INDEX idx_status (status),
    INDEX idx_level (level),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action_status (action_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabela central de logs para auditoria e rastreabilidade da API';
