const express = require('express');
const router = express.Router();
const pool=require('../db')

router.get('/dashboard', async(req,res)=>{
    const sql="select * from robot_status "
    try{
        const [results]= await pool.query(sql)
        res.status(200).json(results)
    }catch(err){
        console.error('데이터 베이스 조회 오류:', err);
        res.status(500).json({error: '연결 실패', details: err.message})

    }
})

router.get('/log', async(req,res)=>{
    const sql="SELECT robot_id, status, destination, log_m,  DATE_FORMAT(log_t, '%H:%i') AS log_t FROM (SELECT robot_id, status, destination, log_m, log_t, ROW_NUMBER() OVER (PARTITION BY robot_id ORDER BY log_t DESC) AS rn FROM robot_logs) AS ranked_logs WHERE rn <= 3"
    try{
        const [results]=await pool.query(sql)
        res.status(200).json(results)
    }catch(err){
        console.error('db 조ㅗ회 오류', err);
        res.status(500).json({error:'연결 실패', details:err.message})
    }
})



module.exports = router;
