const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결

router.get('/', async(req, res) => {
    
    const sql=`SELECT 
    r.robots_idx, 
    ROUND(rcl.rbs_x_coord,6) AS robot_x, 
    ROUND(rcl.rbs_y_coord,6) AS robot_y, 
    o.orders_idx, 
    rs.status AS delivery_status, 
    o.destination, 
    ROUND(od.dst_x_coord,6) AS dest_x, 
    ROUND(od.dst_y_coord,6) AS dest_y, 
    GROUP_CONCAT(CONCAT(oi.menu_name, 'x', oi.quantity, ' ', oi.unit_price * oi.quantity, '원') SEPARATOR ', ') AS order_items, 
    o.total_price,
    a.store,
    ROUND(a.store_x_coord,6) AS store_x,
    ROUND(a.store_y_coord,6) AS store_y
FROM orders o
INNER JOIN robots r ON o.orders_idx = r.orders_idx
LEFT JOIN orders_items oi ON o.orders_idx = oi.orders_idx
LEFT JOIN orders_destination od ON o.orders_idx = od.orders_idx
LEFT JOIN robots_status_logs rs ON r.robots_idx = rs.robots_idx 
    AND rs.updated_at = (
        SELECT MAX(updated_at) 
        FROM robots_status_logs 
        WHERE robots_idx = r.robots_idx
    )
LEFT JOIN robots_coord_logs rcl ON r.robots_idx = rcl.robots_idx 
    AND rcl.updated_at = (
        SELECT MAX(updated_at) 
        FROM robots_coord_logs 
        WHERE robots_idx = r.robots_idx
    )
LEFT JOIN admin a ON o.admin_idx = a.admin_idx
GROUP BY r.robots_idx, rcl.rbs_x_coord, rcl.rbs_y_coord, o.orders_idx, rs.status, o.destination, od.dst_x_coord, od.dst_y_coord, o.total_price, a.store
ORDER BY o.orders_idx DESC`

        try{
            const [results]=await pool.query(sql);
            res.status(200).json(results)
        }catch(err){
            console.error('데이터 베이스 조회 오류:', err);
            res.status(500).json({error: '연결 실패', details: err.message})
        }
    });

module.exports = router;
