// Database Connection Pool Adapter
const mysql = require('mysql2/promise');
const dbConfig = require('../../config/database');

const pool = mysql.createPool(dbConfig);

async function getConnection() {
  return pool.getConnection();
}

async function query(sql, params = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

async function execute(sql, params = []) {
  const connection = await getConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return result;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  getConnection,
  query,
  execute
};
