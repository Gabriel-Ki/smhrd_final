const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: '인증 실패: 토큰이 없습니다.' });
    }

    // "Bearer <토큰>" 형식인지 확인
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: '인증 실패: 올바른 토큰 형식이 아닙니다.' });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // 정상 인증된 경우, 다음 미들웨어 실행
    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰' });
    }
};

module.exports = authenticateToken;

