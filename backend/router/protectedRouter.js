const express = require('express');
const authenticateToken = require('../middleware/auth.js');

const router = express.Router();

//  보호된 API (인증된 사용자만 접근 가능)
router.get('/', authenticateToken, (req, res) => {
    res.json({ message: ` 인증 성공: ${req.user.admin_id}님, 보호된 데이터를 볼 수 있습니다.` });
});

module.exports = router;
