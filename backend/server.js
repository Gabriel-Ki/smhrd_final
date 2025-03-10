require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp=require('body-parser')

const authRouter = require('./router/authRouter');
const protectedRouter = require('./router/protectedRouter');
const mainRouter = require('./router/mainRouter');
const cardRouter = require('./router/cardRouter');
const mainheaderRouter = require('./router/mainheaderRouter')
const headerRouter = require('./router/headerRouter');
const gridRouter = require('./router/gridRouter');
const KakaomapRouter = require('./router/map/kakaomapRouter');
const naviRouter = require('./router/map/naviRouter')
const robotmakerRouter = require('./router/map/robotmakerRouter');
const sideRouter= require('./router/sideRouter');
const deliveryRouter= require('./router/deliveryRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(bp.json());
app.use(express.json()); // JSON 요청 본문 파싱

// 라우터 설정
app.use('/api/auth', authRouter);
app.use('/api/protected', protectedRouter);
<<<<<<< HEAD:backend/app.js
app.use('/', mainRouter)
=======
app.use('/api', mainRouter);
>>>>>>> 7f810b6eb7c0bebe47cfb6599241c2673473df7f:backend/server.js
app.use('/api/card', cardRouter);
app.use('/api/mainheader', mainheaderRouter);
app.use('/api/header', headerRouter);
app.use('/api/gird', gridRouter);
app.use('/api/kakao', KakaomapRouter);
app.use('api/navi', naviRouter);
app.use('api/robotmaker', robotmakerRouter);
app.use('/api/side', sideRouter);
app.use('/api/delivery', deliveryRouter);

// 기본 응답
app.get('/', (req, res) => {
    res.send('🚀 배달 로봇 시스템 백엔드 서버 실행 중');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
