const express = require('express');
const router = express.Router();
const pool=require('../db')

router.get('/grid_maincard', async(req,res)=>{
    const sql1 = `WITH ranked_status AS (
    SELECT 
        r.robots_idx, 
        r.orders_idx,
        rs.status, 
        rs.updated_at,
        ROW_NUMBER() OVER (PARTITION BY r.robots_idx, r.orders_idx ORDER BY rs.updated_at DESC) AS rn
    FROM robots_status_logs rs
    LEFT JOIN robots r ON rs.robots_idx = r.robots_idx
)
SELECT 
    r.robots_idx, 
    r.orders_idx, 
    o.destination, 
    rs.status, 
    rs.updated_at
FROM robots r
LEFT JOIN orders o ON r.orders_idx = o.orders_idx
LEFT JOIN ranked_status rs ON r.robots_idx = rs.robots_idx AND r.orders_idx = rs.orders_idx
WHERE rs.rn <= 3
ORDER BY r.robots_idx, r.orders_idx, rs.updated_at DESC;`

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
    const sql2= `WITH LatestStatus AS (
        SELECT rsl.robots_idx, rsl.status
        FROM robots_status_logs rsl
        WHERE rsl.robots_status_logs_idx = (
            SELECT rsl2.robots_status_logs_idx
            FROM robots_status_logs rsl2
            WHERE rsl2.robots_idx = rsl.robots_idx
            ORDER BY rsl2.updated_at DESC, rsl2.robots_status_logs_idx DESC
            LIMIT 1
        )
    ),
    StatusList AS (
        SELECT '대기 중' AS status UNION ALL
        SELECT '배차 대기 중' UNION ALL
        SELECT '가게 이동 중' UNION ALL
        SELECT '가게 도착' UNION ALL
        SELECT '목적지 이동 중' UNION ALL
        SELECT '엘리베이터 탑승 중' UNION ALL
        SELECT '목적지 도착' UNION ALL
        SELECT '회차 중'
    )
    SELECT sl.status, COALESCE(COUNT(ls.robots_idx), 0) AS count
    FROM StatusList sl
    LEFT JOIN (
        SELECT ls.status, r.robots_idx
        FROM robots r
        JOIN LatestStatus ls ON r.robots_idx = ls.robots_idx
    ) ls ON sl.status = ls.status
    GROUP BY sl.status;`
    try{
        const [results] = await pool.query(sql2);

        if (results.length === 0){
            return res.status(404).json({error:'DB에 로봇이 없없습니다'});
        }

        let response = {total : 0};
        results.forEach((row)=>{
            response[row.status] = row.count;
            response.total += row.count;        
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
