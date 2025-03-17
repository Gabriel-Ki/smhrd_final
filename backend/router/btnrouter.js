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

        const robotUpdateSql=`update robots_status_logs
        set status='배달 완료'
        where robots_idx=(select robots_idx from robots where orders_idx=?)
        order by updated_at desc limit 1`
        await connect.query(robotUpdateSql,[orderId]);


        await connect.commit();
        res.status(201).json({message : '배달 완료로 상태 변경 완료'})
    }catch(err){
        await connect.rollback();
        console.error('완료 상태 오류:', err);
        res.status(500).json({error:'배달 상태 변경 실패', details:err.message})
    }finally{
        connect.release();
    }
})




module.exports=router;