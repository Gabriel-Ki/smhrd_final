const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // 비밀 키

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"에서 TOKEN만 추출

    if (!token) return res.sendStatus(401); // 토큰이 없으면 401 Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // 토큰이 유효하지 않으면 403 Forbidden
        req.user = user; // 유효한 경우 요청 객체에 사용자 정보 추가
        next(); // 다음 미들웨어로 진행
    });
};

module.exports = authenticateToken;
