const mysql = require('mysql2');
const config = require('./config'); // 설정 파일 가져오기

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise 기반으로 변환
const promisePool = pool.promise();

module.exports = promisePool;
