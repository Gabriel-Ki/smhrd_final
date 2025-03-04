const mysql = require('mysql2');
require('dotenv').config(); // .env 파일 로드

const pool = mysql.createPool({
    host: process.env.DB_HOST,      // 환경 변수 사용
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise(); // async/await 사용 가능