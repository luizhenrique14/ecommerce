// Database Configuration
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const dbHostRaw = (process.env.DB_HOST || 'localhost').trim();
const dbHostParts = dbHostRaw.split(':');
const dbHost = dbHostParts[0];
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (dbHostParts[1] ? parseInt(dbHostParts[1], 10) : 3306);

const config = {
  host: dbHost,
  port: isNaN(dbPort) ? 3306 : dbPort,
  user: (process.env.DB_USER || 'root').trim(),
  password: (process.env.DB_PASSWORD || '').trim(),
  database: (process.env.DB_NAME || 'ecommerce_db').trim(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = config;
