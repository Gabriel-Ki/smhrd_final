const express = require('express');
const router = express.Router();
const pool=require('../db')


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
