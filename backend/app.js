const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mainrouter = require("./router/mainrouter");
const cardrouter = require("./router/cardrouter");
const headerrouter = require("./router/headerrouter");
const gridrouter = require("./router/gridrouter");
const jwt = require('jsonwebtoken'); // JWT 패키지 추가

const app = express();
const PORT = 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use("/", mainrouter);
app.use("/card", cardrouter);
app.use("/header", headerrouter);
app.use("/grid", gridrouter);

// 비밀 키 설정 (환경변수로 관리하는 것이 좋습니다)
const SECRET_KEY = 'your_secret_key';

// 로그인 API 구현
app.post('/api/auth/admin/login', (req, res) => {
    const { admin_id, admin_pw } = req.body;

    // 관리자 로그인 검증 (예시로 간단한 조건 사용)
    if (admin_id === 'admin' && admin_pw === '1234') {
        // JWT 토큰 생성
        const token = jwt.sign({ admin_id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// JWT 인증 미들웨어
const authenticateToken = require('./middleware/auth');

// 보호된 API 엔드포인트
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다.`);
});
