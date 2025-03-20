const express = require('express');
const router = express.Router();
const pool = require('../db'); // DB 연결

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // 지구 반지름 (미터)
    const toRad = (degree) => (degree * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

router.post('/destination', async (req, res) => {
    const {orderId, robotId, destX, destY}=req.body;
    const connect = await pool.getConnection();

    if(!orderId || !robotId || !destX || !destY){
        return res.status(400).json({error : "필수 데이터가 없습니다"})
    }

    try {

        await connect.beginTransaction();

        // 1. 주문 상태 -> 배달 중

        const endOrderUpdateSql=`
        UPDATE orders 
        SET order_status='배달 중
        where orders_idx=?`
        await connect.query(endOrderUpdateSql, [orderId]);

        const endInsertRobotStatusSql=`
        INSERT INTO robots_status_logs (robots_idx, status, updated_at)
        VALUES (?, '목적지 이동 중', NOW())
        ON DUPLICATE KEY UPDATE updated_at=NOW()`

        await connect.query(endInsertRobotStatusSql, [robotId]);

        await connect.commit();
        connect.release();

        console.log(`주문 (${orderId}) 상태 '배달중', 로봇(${robotId}) 상태 '목적지 이동 중' 설정 완료`)


        console.log(`${robotId} 10초 후 목적지로 이동 시작 예정`)

        setTimeout(async ()=>{
            let destIndex=0;

            const destPath=[
                { y: 126.911953, x: 35.149272 }, // 시작점
                { y: 126.910838, x: 35.150258 },
                { y: 126.912537, x: 35.151778 }, // 중간 지점
                { y: 126.914179, x: 35.150855 },
                { y: 126.916067, x: 35.150604 },
            ];


            const interval=setInterval(async ()=>{
                if(destIndex >= destPath.length){
                    clearInterval(interval);
                    console.log(`${robotId} 매장 도착 `)

                    const endStatusSql= `UPDATE robots_status_logs SET status='배달 완료'
                        WHERE robots_idx=?`

                    await pool.query(endStatusSql,[robotId])

                    return;
                }

                const endNextPos=destPath[destIndex];

                const endLagLngUpdateSql=`UPDATE robots_coord_logs SET 
                rbs_x_coord=?, rbs_y_coord=? WHERE robots_idx=?`

                await pool.query(endLagLngUpdateSql,[endNextPos.x,endNextPos.y,robotId])

                console.log(`${robotId} 이동 중: ${endNextPos.x}, ${endNextPos.y}`)


                const endDistance=getDistance(endNextPos.x, endNextPos.y, destX, destY);
                if (endDistance <=20){
                    console.log(`${robotId} 도착지 반경 20m 내 도착 ! 배달완료로 상태 변경`)

                    const endCheckStatusSql=`SELECT status FROM robots_status_logs
                                        WHERE robots_idx=?
                                        ORDER BY updated_at desc LIMIT 1`

                    const [endStatusRows]= await pool.query(endCheckStatusSql, [robotId]);
                    console.log(endStatusRows);

                    if (endStatusRows.length===0 || endStatusRows[0].status !=='배달 완료'){
                        const endStatusChangeSql=`INSERT INTO robots_status_logs (robots_idx, status, updated_at)
                                                    VALUES (?, '배달 완료', NOW())
                                                    ON DUPLICATE KEY UPDATE updated_at = NOW()`
                        await pool.query(endStatusChangeSql, [robotId]);
                        console.log(`${robotId} 상태 변경 완료`)

                        const endOrderStatusChangeSql=`UPDATE orders 
                        SET order_status='완료' WHERE orders_idx=?
                        `
                        await pool.query(endOrderStatusChangeSql, [orderId])

                    }else{
                        console.log(`${robotId} 이미 픽업 대기 상태`)
                    }

                    clearInterval(interval);
                }
                destIndex++;
            }, 2000);

        }, 2000);

        await connect.commit();

        res.json({message : "10초 후 로봇 목적지로 이동이 시작됩니다.", robotId, orderId});
    } catch (error) {
        console.error("🚨 로봇 목적지 이동 업데이트 오류:", error);
        res.status(500).json({ error: "로봇 목적지 이동 업데이트 중 오류 발생" });
    }finally{
        connect.release()
    }
});




module.exports=router;