const express = require('express');
const pool = require('../db'); // MySQL 연결 파일

const router = express.Router();

// 특정 테이블 데이터 조회 API
router.get('/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const query = `SELECT * FROM \`${tableName}\``;

  pool.query(query, (err, results) => {
    if (err) {
      console.error(`데이터 조회 오류 (테이블: ${tableName}):`, err);
      res.status(500).json({ message: '데이터 조회 실패' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;