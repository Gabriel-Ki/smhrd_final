require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bp=require('body-parser')

const mainRouter=require('./router/mainrouter')
const robotRouter=require('./router/robotRouter')
const orderRouter=require('./router/orderRouter')
const btnRouter=require('./router/btnrouter')
const buyRouter=require('./router/buyrouter')
const moveRouter=require('./router/moverouter')

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors({
    origin : 'http://localhost:3000'
}));
app.use(bp.json());
app.use('/robot', robotRouter);
app.use('/', mainRouter)
app.use('/order', orderRouter)
app.use('/btn', btnRouter);
app.use('/buy', buyRouter);
app.use('/move', moveRouter);

// 기본 응답
app.get('/', (req, res) => {
    res.send('🚀 배달 로봇 시스템 백엔드 서버 실행 중');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
