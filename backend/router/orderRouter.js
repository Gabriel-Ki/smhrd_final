const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결


router.get('/',async(req,res)=>{

    const sql=`SELECT 
    o.orders_idx, 
    r.robots_idx, 
    rs.status AS delivery_status, 
    o.destination, 
    GROUP_CONCAT(CONCAT(oi.menu_name, 'x', oi.quantity, ' ', oi.unit_price * oi.quantity, '원') SEPARATOR ', ') AS order_items,
    o.total_price,
	DATE_FORMAT(o.created_at, '%H:%i') AS order_time
FROM orders o
LEFT JOIN orders_items oi ON o.orders_idx = oi.orders_idx
LEFT JOIN robots r ON o.orders_idx = r.orders_idx
LEFT JOIN robots_status_logs rs ON r.robots_idx = rs.robots_idx 
    AND rs.updated_at = (
        SELECT MAX(updated_at) 
        FROM robots_status_logs 
        WHERE robots_idx = r.robots_idx
    )
GROUP BY o.orders_idx, r.robots_idx, rs.status, o.destination, o.total_price
ORDER BY o.orders_idx DESC

`

    try{
        const [results]= await pool.query(sql);
        res.status(200).json(results)
    }catch(err){
        console.error('데이터 베이스 조회 오류 : ',err);
        res.status(500).json({error: '연결 실패', details: err.message})
    }


})


router.get('/sidebar', async(req, res) => {
    const sql = 'SELECT * from deliverypage';
        try{
            const [results]=await pool.query(sql);
            res.status(200).json(results)
        }catch(err){
            console.error('데이터 베이스 조회 오류:', err);
            res.status(500).json({error: '연결 실패', details: err.message})
        }
    });

module.exports=router;