const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결


router.get('/',async(req,res)=>{
    const sql=`SELECT 
    p.order_id, 
    p.robot_id, 
    p.destination, 
    p.status, 
    p.order_time, 
    p.total_amount,
    GROUP_CONCAT(
        CASE 
            WHEN pi.quantity > 1 
            THEN CONCAT(pi.item_name, ' x', pi.quantity, ' ', FORMAT(pi.quantity * pi.price, 0), '원')
            ELSE CONCAT(pi.item_name, ' ', FORMAT(pi.price, 0), '원')
        END
        SEPARATOR ', '
    ) AS items
FROM pickup AS p
INNER JOIN pickup_items AS pi 
    ON p.order_id = pi.order_id
GROUP BY p.order_id`
    // const sql2=`select * from pickup_items`
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