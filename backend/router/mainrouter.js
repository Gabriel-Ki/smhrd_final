const express = require('express');
const router = express.Router();
const pool=require('../db')

// 샘플 데이터 (API가 제공하는 로봇 상태 데이터)
// const robots = [
//     { id: 1, name: '프로그램명 -1', status: '작업 중' },
//     { id: 2, name: '프로그램명 -2', status: '대기 중' },
//     { id: 3, name: '프로그램명 -3', status: '작업 중' },
//     { id: 4, name: '프로그램명 -4', status: '작업 중' },
//     { id: 5, name: '프로그램명 -5', status: '작업 중' },
//     { id: 6, name: '프로그램명 -6', status: '에러' }
// ];

router.get('/dashboard', async(req,res)=>{
    const sql='select * from mainpage'
    try{
        const [results]= await pool.query(sql)
        res.status(200).json(results)
    }catch(err){
        console.error('데이터 베이스 조회 오류:', err);
        res.status(500).json({error: '연결 실패', details: err.message})

    }
})



module.exports = router;
