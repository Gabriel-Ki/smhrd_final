const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결


router.get('/',async(req,res)=>{

    const sql=`SELECT 
    o.orders_idx, 
    COALESCE(r.robots_idx, NULL) AS robots_idx,  -- 배차되지 않은 주문은 NULL 처리
    rs.status AS delivery_status, 
    o.destination, 
    GROUP_CONCAT(CONCAT(
        oi.menu_name, 'x', oi.quantity, ' ', 
        oi.unit_price * oi.quantity, '원') 
        SEPARATOR ', ') 
    AS order_items, 
    o.total_price,
    o.order_status,
    DATE_FORMAT(o.created_at, '%H:%i') AS order_time,
    a.store,
    -- 목적지 좌표 가져오기 (각 orders_idx당 하나만 선택)
    (SELECT ROUND(od.dst_x_coord,6) 
    FROM orders_destination od 
    WHERE od.orders_idx = o.orders_idx 
    LIMIT 1) AS dest_x,
    (SELECT ROUND(od.dst_y_coord,6) 
    FROM orders_destination od 
    WHERE od.orders_idx = o.orders_idx 
    LIMIT 1) AS dest_y
FROM orders o
LEFT JOIN admin a ON o.admin_idx = a.admin_idx
LEFT JOIN orders_items oi ON o.orders_idx = oi.orders_idx
LEFT JOIN robots r ON o.orders_idx = r.orders_idx  -- 배차되지 않은 주문도 포함
LEFT JOIN robots_status_logs rs 
    ON r.robots_idx = rs.robots_idx 
    AND rs.updated_at = (
        SELECT MAX(updated_at) 
        FROM robots_status_logs 
        WHERE robots_idx = r.robots_idx
    )
-- 주문을 상태별로 가져오기 위해 ORDER BY 유지
GROUP BY o.orders_idx, r.robots_idx, rs.status, o.destination, o.total_price
ORDER BY o.orders_idx DESC limit 6;
`

    try{
        const [results]= await pool.query(sql);
        res.status(200).json(results)
    }catch(err){
        console.error('데이터 베이스 조회 오류 : ',err);
        res.status(500).json({error: '연결 실패', details: err.message})
    }


})


router.post('/accept', async(req, res) => {
    const {orderId}=req.body
    const connect=await pool.getConnection();

    

    try{
        await connect.beginTransaction();

        console.log('주문 접수 API 호출:', orderId);


        const acceptUpdateSql = `update orders 
        set order_status='조리중'
        where orders_idx=?` ;
        await connect.query(acceptUpdateSql,[orderId]);

        const acceptFindRobotSql=`UPDATE robots r
            JOIN (
                SELECT rc.robots_idx
                FROM robots r
                JOIN robots_status_logs rs ON r.robots_idx = rs.robots_idx
                JOIN robots_coord_logs rc ON r.robots_idx = rc.robots_idx
                JOIN admin a ON a.admin_idx = (SELECT admin_idx FROM orders WHERE orders_idx = ?)
                WHERE r.orders_idx IS NULL
                ORDER BY (6371 * ACOS(
                    COS(RADIANS(a.store_x_coord)) * COS(RADIANS(rc.rbs_x_coord)) * 
                    COS(RADIANS(rc.rbs_y_coord) - RADIANS(a.store_y_coord)) + 
                    SIN(RADIANS(a.store_x_coord)) * SIN(RADIANS(rc.rbs_x_coord))
                    )) ASC
                LIMIT 1
            ) AS closest_robot
            ON r.robots_idx = closest_robot.robots_idx
            SET r.orders_idx = ?`

        const [updateResult]= await connect.query(acceptFindRobotSql,[orderId,orderId]);

        if (updateResult.affectedRows>0){
            const getAssignedRobotSql=`SELECT robots_idx FROM robots where orders_idx=?`

            const [robotRows]= await connect.query(getAssignedRobotSql,[orderId]);

            if(robotRows.length>0){
                const robotId=robotRows[0].robots_idx;

                const robotStatusSql=
                `INSERT INTO robots_status_logs 
                (robots_idx, status, updated_at)
                VALUES (?, '가게 이동 중', NOW())`

                await connect.query(robotStatusSql, [robotId]);

            }
        }else{
            console.log('배정 가능한 로봇 없음')
        }

        await connect.commit();
        res.status(201).json({message: '주문 상태 변경 및 배정 완료'})
    }catch(err){
        await connect.rollback();
        console.error('주문 접수 오류 :', err);
        res.status(500).json({error:'주문 처리 실패', details: err.message})
    }finally{
        connect.release();
    }
});


// router.post('/cooking',async(req,res)=>{
//     const {orderId}=req.body;
//     const connection=await pool.getConnection();

//     try{
//         await connection.beginTransaction();

//         const cookingOrderUpdateSql=`update orders
//         set order_status='배달중'
//         where orders_idx=?`
//         // 클릭한 order_idx를 기준으로 order_status를 다음 단계로
//         await connection.query(cookingOrderUpdateSql,[orderId]);

//         const cookingRobotSql=`INSERT INTO robots_status_logs 
//         (robots_idx, status, updated_at)
//         VALUES (
//         (SELECT robots_idx FROM robots WHERE orders_idx = ?), 
//         '목적지 이동 중', 
//         NOW()
//         )`  
//         // 클릭한 order_idx를 기준으로 해당하는 로봇 _idx를 찾고 그거와 일치하는 로봇 상태를 추가
//         await connection.query(cookingRobotSql,[orderId])

//         await connection.commit();
//         res.status(201).json({message : '로봇 및 주문 상태 변경 완료'})
//     }catch(err){
//         await connection.rollback();
//         console.error('상태 변경 오류:', err);
//         res.status(500).json({error:'상태 변경 실패', details:err.message})
//     }finally{
//         connection.release();
//     }
// });



module.exports=router;