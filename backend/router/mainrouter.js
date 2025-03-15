const express = require('express');
const router = express.Router();
const pool=require('../db')

router.get('/grid_maincard', async(req,res)=>{
    const sql1 = `WITH ranked_status AS (
    SELECT 
        robots_idx, 
        status, 
        updated_at,
        ROW_NUMBER() OVER (PARTITION BY robots_idx ORDER BY updated_at DESC) AS rn
    FROM robots_status_logs
)
SELECT 
    r.robots_idx, 
    r.orders_idx, 
    o.destination, 
    rs.status, 
    rs.updated_at
FROM robots r
LEFT JOIN orders o ON r.orders_idx = o.orders_idx
LEFT JOIN ranked_status rs ON r.robots_idx = rs.robots_idx
WHERE rs.rn <= 3
ORDER BY r.robots_idx, rs.updated_at DESC;`

    // sql1 , 2 에 robots 합쳐서 하나의 테이블로 만들기 
    try{
        const [gridmainResult] = await Promise.all([
            pool.query(sql1),
        ])
        res.status(200).json({
            gridmain: gridmainResult[0]
        });
    }catch(err){
        console.error('데이터 베이스 조회 오류:', err);
        res.status(500).json({error: '연결 실패', details: err.message})

    }
})






router.get('/robots/status', async(req,res)=>{
    const sql2= "select status, count(*) as count from robots_status_logs group by status"
    try{
        const [results] = await pool.query(sql2);
        // console.log(results);

        if (results.length === 0){
            return res.status(404).json({error:'DB에 로봇이 업습니다'});
        }

        let response = {total : 0};
        results.forEach((row)=>{
            response[row.status] = row.count;
            // console.log("response : ",response);
            // console.log("response[row.status] : ",response[row.status]);
            // console.log("row.count : ",row.count);
            response.total += row.count;
            // console.log("response.totoal : ", response.total);
            
        })

        res.status(200).json(response);
    }catch(err){
        console.error('데이터 베이스 조회 오류', err);
        res.status(500).json({error:'연결 실패', details:err.message})
    }
})

router.get('/log', async(req,res)=>{
    const sql="SELECT robot_id, status, destination, log_m,  DATE_FORMAT(log_t, '%H:%i') AS log_t FROM (SELECT robot_id, status, destination, log_m, log_t, ROW_NUMBER() OVER (PARTITION BY robot_id ORDER BY log_t DESC) AS rn FROM robot_logs) AS ranked_logs WHERE rn <= 3"
    try{
        const [results]=await pool.query(sql)
        res.status(200).json(results)
    }catch(err){
        console.error('db 조회 오류', err);
        res.status(500).json({error:'연결 실패', details:err.message})
    }
})



module.exports = router;
