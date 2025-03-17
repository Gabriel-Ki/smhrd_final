const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결


router.get('/',async(req,res)=>{

    const sql=`SELECT 
    o.orders_idx, 
    r.robots_idx, 
    rs.status AS delivery_status, 
    o.destination, 
    GROUP_CONCAT(CONCAT
    (oi.menu_name, 'x', oi.quantity, ' ', 
    oi.unit_price * oi.quantity, '원') 
    SEPARATOR ', ') AS order_items, 
    o.total_price,
    o.order_status,
    DATE_FORMAT(o.created_at, '%H:%i') AS order_time,
    a.store
    FROM orders o
    LEFT JOIN admin a ON o.admin_idx = a.admin_idx
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


router.post('/accept', async(req, res) => {
    const {orderId}=req.body
    const connect=await pool.getConnection();

    try{
        await connect.beginTransaction();


        const acceptUpdateSql = `update orders 
        set order_status='조리중'
        where orders_idx=?` ;
        await connect.query(acceptUpdateSql,[orderId]);

        const acceptFindRobotSql=`select robots_idx
        from robots
        where orders_idx is NULL`;
        const [robot]= await connect.query(acceptFindRobotSql);

        if (robot.length>0){
            const robotId=robot[0].robots_idx;

            const acceptRobotUpdateSql=`update robots 
            set orders_idx=? 
            where robots_idx=?`
            await connect.query(acceptRobotUpdateSql,[orderId,robotId]);

            const aceeptStatusUpdateSql=
            `INSERT INTO robots_status_logs 
            (robots_idx, status, updated_at)
            VALUES (?, '가게 이동 중', NOW())`
            await connect.query(aceeptStatusUpdateSql, [robotId]);

            console.log('로봇이 주문에 배정됨')
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


router.post('/cooking',async(req,res)=>{
    const {orderId}=req.body;
    const connection=await pool.getConnection();

    try{
        await connection.beginTransaction();

        const cookingOrderUpdateSql=`update orders
        set order_status='배달중'
        where orders_idx=?`
        // 클릭한 order_idx를 기준으로 order_status를 다음 단계로
        await connection.query(cookingOrderUpdateSql,[orderId]);

        const cookingRobotSql=`INSERT INTO robots_status_logs 
        (robots_idx, status, updated_at)
        VALUES (
        (SELECT robots_idx FROM robots WHERE orders_idx = ?), 
        '목적지 이동 중', 
        NOW()
        )`  
        // 클릭한 order_idx를 기준으로 해당하는 로봇 _idx를 찾고 그거와 일치하는 로봇 상태를 추가
        await connection.query(cookingRobotSql,[orderId])

        await connection.commit();
        res.status(201).json({message : '로봇 및 주문 상태 변경 완료'})
    }catch(err){
        await connection.rollback();
        console.error('상태 변경 오류:', err);
        res.status(500).json({error:'상태 변경 실패', details:err.message})
    }finally{
        connection.release();
    }




});

module.exports=router;