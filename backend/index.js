const pool = require('./db');

async function getUsers() {
  try {
    const [rows] = await pool.query('SELECT * FROM js_robot_delivery');
    console.log('사용자 목록:', rows);
  } catch (error) {
    console.error('쿼리 실행 실패:', error);
  }
}

getUsers();