const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결

router.get('/', async(req, res) => {
    
    const sql=`SELECT
    r.robots_idx,
    -- 좌표
    ROUND(rcl.rbs_x_coord, 6) AS robot_x,
    ROUND(rcl.rbs_y_coord, 6) AS robot_y,

    -- 주문 정보
    o.orders_idx,
    rs.status AS delivery_status,
    o.destination,
    ROUND(od.dst_x_coord, 6) AS dest_x,
    ROUND(od.dst_y_coord, 6) AS dest_y,

    -- 주문 아이템은 별도 서브쿼리에서 GROUP_CONCAT
    oi2.order_items,
    o.total_price,
    a.store,
    ROUND(a.store_x_coord, 6) AS store_x,
    ROUND(a.store_y_coord, 6) AS store_y

FROM orders o
-- 로봇 (orders_idx = robots.orders_idx)
INNER JOIN robots r ON o.orders_idx = r.orders_idx

-- (A) 주문 아이템: 서브쿼리로 GROUP_CONCAT
LEFT JOIN (
    SELECT 
        oi.orders_idx,
        GROUP_CONCAT(CONCAT(oi.menu_name, 'x', oi.quantity, ' ', oi.unit_price * oi.quantity, '원') SEPARATOR ', ') AS order_items
    FROM orders_items oi
    GROUP BY oi.orders_idx
) AS oi2 ON o.orders_idx = oi2.orders_idx

-- 목적지
LEFT JOIN orders_destination od ON o.orders_idx = od.orders_idx

-- 매장(admin)
LEFT JOIN admin a ON o.admin_idx = a.admin_idx

-- (B) 최신 로봇 상태: 서브쿼리
LEFT JOIN (
    SELECT rsl.robots_idx, rsl.status
    FROM robots_status_logs rsl
    INNER JOIN (
        SELECT robots_idx, MAX(updated_at) AS max_updated
        FROM robots_status_logs
        GROUP BY robots_idx
    ) AS sub
    ON rsl.robots_idx = sub.robots_idx
    AND rsl.updated_at = sub.max_updated
) AS rs ON r.robots_idx = rs.robots_idx

-- (C) 최신 로봇 좌표: 서브쿼리
LEFT JOIN (
    SELECT rcl2.robots_idx, rcl2.rbs_x_coord, rcl2.rbs_y_coord
    FROM robots_coord_logs rcl2
    INNER JOIN (
        SELECT robots_idx, MAX(updated_at) AS max2
        FROM robots_coord_logs
        GROUP BY robots_idx
    ) AS sub2
    ON rcl2.robots_idx = sub2.robots_idx
    AND rcl2.updated_at = sub2.max2
) AS rcl ON r.robots_idx = rcl.robots_idx

-- (D) 마지막에 ORDER BY
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
