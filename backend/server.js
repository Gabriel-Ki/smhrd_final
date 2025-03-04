const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// 라우터 불러오기
const authRoutes = require('./routes/auth');
const deliveryRoutes = require('./routes/delivery');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 라우터 등록
app.use('/auth', authRoutes);
app.use('/delivery', deliveryRoutes);

// 기본 응답
app.get('/', (req, res) => {
    res.send('🚀 배달 로봇 시스템 백엔드 서버 실행 중...');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`✅ 서버 실행: http://localhost:${PORT}`);
});