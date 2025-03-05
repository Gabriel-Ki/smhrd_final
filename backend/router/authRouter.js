const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// 로그인 API (JWT 발급)
router.post('/login', (req, res) => {
    console.log("요청 데이터:", req.body); // 요청 데이터 확인

    const { admin_id, admin_pw } = req.body;

    if (!admin_id || typeof admin_id !== 'string' || !admin_id.trim()) {
        return res.status(400).json({ message: 'admin_id가 유효하지 않습니다.' });
    }
    
    if (!admin_pw || typeof admin_pw !== 'string' || !admin_pw.trim()) {
        return res.status(400).json({ message: 'admin_pw가 유효하지 않습니다.' });
    }

    // 관리자 인증 (더 발전된 방식으로 DB 연동 가능)
    if (admin_id === 'admin' && admin_pw === '1234') {
        const token = jwt.sign({ admin_id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
