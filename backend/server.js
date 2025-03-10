const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 라우터 가져오기
const authRouter = require('./router/map/authRouter');
const cardRouter = require('./router/map/cardRouter');
const deliveryRouter = require('./router/map/deliveryRouter');
const gridRouter = require('./router/map/gridRouter');
const mainheaderRouter = require('./router/map/headerRouter');
const mainRouter = require('./router/map/mainRouter');
const protectedRouter = require('./router/map/protectedRouter');
const sideRouter = require('./router/map/sideRouter');
const userRouter = require('./router/map/userRouter');
const headerRouter = require('./router/headerRouter');

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 정책 허용
app.use(express.json()); // JSON 요청 본문 파싱


// API 라우터 설정
app.use('/api/auth', authRouter);
app.use('/api/card', cardRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/grid', gridRouter);
app.use('/api/mainheader', mainheaderRouter);
app.use('/api', mainRouter);
app.use('/api/protected', protectedRouter);
app.use('/api/side', sideRouter);
app.use('/api/user', userRouter);
app.use('/api', headerRouter);

// 기본 경로 (서버 상태 확인용)
app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
});

// 포트 설정
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
});
