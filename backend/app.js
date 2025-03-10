require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp=require('body-parser')

const authRouter = require('./router/authRouter');
const protectedRouter = require('./router/protectedRouter');
const mainRouter = require('./router/mainRouter');
const cardRouter = require('./router/cardRouter');
const headerRouter = require('./router/headerRouter');
const gridRouter = require('./router/gridRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(bp.json());
app.use(express.json()); // JSON 요청 본문 파싱

// 라우터 설정
app.use('/api/auth', authRouter);
app.use('/api/protected', protectedRouter);
app.use('/', mainRouter)
app.use('/api/card', cardRouter);
app.use('/api/header', headerRouter);
app.use('/api/gird', gridRouter)

// 기본 응답
app.get('/', (req, res) => {
    res.send('🚀 배달 로봇 시스템 백엔드 서버 실행 중');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
