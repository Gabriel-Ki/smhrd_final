const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결


router.post('/',async(req,res)=>{
    const {orderId}=req.body
    const connect=await pool.getConnection();

    try{
        await connect.beginTransaction();

        const orderUpdateSql=`update orders
        set order_status='완료'
        where orders_idx=?`
        await connect.query(orderUpdateSql,[orderId]);

        const robotUpdateSql=`INSERT INTO robots_status_logs 
        (robots_idx, status, updated_at)
        VALUES (
        (SELECT robots_idx FROM robots WHERE orders_idx = ?), 
        '배달 완료', 
        NOW())`
        await connect.query(robotUpdateSql,[orderId]);

        const getRobotIdSql=`SELECT robots_idx FROM robots WHERE orders_idx=?`
        const [robotRows]=await connect.query(getRobotIdSql, [orderId])

        if (robotRows.length===0){
            throw new Error("해당 주문을 수행한 로봇을 찾을 수 없습니다");
        }

        const robotId=robotRows[0].robots_idx;

        await connect.commit();
        res.status(201).json({message : '배달 완료로 상태 변경 완료'})

        // 5초 후 실행 위해
        setTimeout(async()=>{
            const delayedConnect=await pool.getConnection();
            try{
                await delayedConnect.beginTransaction();

                const clearOrderSql=`
                Update robots Set orders_idx=Null
                where robots_idx=?`

                await delayedConnect.query(clearOrderSql,[robotId]);

                const resetRobotStatusSql=`
                Insert Into robots_status_logs (robots_idx, status, updated_at)
                Values(?,'대기 중',NOW())`

                await delayedConnect.query(resetRobotStatusSql, [robotId]);

                await delayedConnect.commit();
            }catch(error){
                await delayedConnect.rollback();
                console.error('로봇 상태 초기화 실패:', error);
            }finally{
                delayedConnect.release();
            }
        }, 2000) 


    }catch(err){
        await connect.rollback();
        console.error('완료 상태 오류:', err);
        res.status(500).json({error:'배달 상태 변경 실패', details:err.message})
    }finally{
        connect.release();
    }   
})




module.exports=router;