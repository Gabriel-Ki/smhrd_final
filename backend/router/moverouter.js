const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📌 두 좌표 간 거리 계산 (Haversine 공식)
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

// 📌 로봇 이동 업데이트 API (5초마다 호출)
router.post('/', async (req, res) => {
    const {robotId, storeX, storeY}=req.body;

    if(!robotId || !storeX || !storeY){
        return res.status(400).json({error : "필수 데이터가 없습니다"})
    }

    try {
        console.log(`${robotId} 10초 후 이동 시작 예정`)

        setTimeout(async ()=>{
            let moveIndex=0;

            const path=[
                { y: 126.913354, x: 35.152468 }, // 시작점
                { y: 126.912702, x: 35.151841 },
                { y: 126.913465, x: 35.151418 }, // 중간 지점
                { y: 126.913921, x: 35.150905 },
                { y: 126.913545, x: 35.150641 },
            ];


            const interval=setInterval(async ()=>{
                if(moveIndex >= path.length){
                    clearInterval(interval);
                    console.log(`${robotId} 매장 도착 `)

                    const statusSql= `UPDATE robots_status_logs SET status='픽업 대기'
                        WHERE robots_idx=?`

                    await pool.query(statusSql,[robotId])

                    return;
                }

                const nextPos=path[moveIndex];

                const lagLngUpdateSql=`UPDATE robots_coord_logs SET 
                rbs_x_coord=?, rbs_y_coord=? WHERE robots_idx=?`

                await pool.query(lagLngUpdateSql,[nextPos.x,nextPos.y,robotId])

                console.log(`${robotId} 이동 중: ${nextPos.x}, ${nextPos.y}`)


                const distance=getDistance(nextPos.x, nextPos.y, storeX, storeY);
                if (distance <=20){
                    console.log(`${robotId} 매장 반경 20m 내 도착 ! 픽업 대기로 상태 변경`)

                    const checkStatusSql=`SELECT status FROM robots_status_logs
                                        WHERE robots_idx=?
                                        ORDER BY updated_at desc LIMIT 1`

                    const [statusRows]= await pool.query(checkStatusSql, [robotId]);
                    console.log(statusRows);

                    if (statusRows.length===0 || statusRows[0].status !=='픽업 대기'){
                        const statusChangeSql=`INSERT INTO robots_status_logs (robots_idx, status, updated_at)
                                                    VALUES (?, '픽업 대기', NOW())
                                                    ON DUPLICATE KEY UPDATE updated_at = NOW()`
                        await pool.query( statusChangeSql, [robotId]);
                        console.log(`${robotId} 상태 변경 완료`)
                    }else{
                        console.log(`${robotId} 이미 픽업 대기 상태`)
                    }

                    clearInterval(interval);
                }
                moveIndex++;
            }, 2000);

        }, 2000);

        res.json({message : "10초 후 로봇 이동이 시작됩니다.", robotId});
    } catch (error) {
        console.error("🚨 로봇 이동 업데이트 오류:", error);
        res.status(500).json({ error: "로봇 이동 업데이트 중 오류 발생" });
    }
});

router.get('/:robotId', async(req,res)=>{
    const {robotId} = req.params;

    if(!robotId){
        return res.status(400).json({error : "로봇 ID가 필요합니다"})
    }

    try{
        const positionSql=`
        SELECT rbs_x_coord AS x, rbs_y_coord AS y
        FROM robots_coord_logs
        WHERE robots_idx=?
        ORDER BY updated_at DESC
        LIMIT 1`

        const [rows]=await pool.query(positionSql,[robotId]);

        if(rows.length ===0){
            return res.status(404).json({error : '로봇 위치를 찾을 수 없습니다'})
        }

        res.json(rows[0]);
    }catch(error){
        console.error('로봇 위치 조회 오류', error)
        res.status(500).json({error : ' 로봇 위치 조회 중 오류 발생'})
    }
})




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
        SET order_status='배달중'
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

                    return;
                }

                const endNextPos=destPath[destIndex];

                const endLagLngUpdateSql=`
                UPDATE robots_coord_logs 
                SET rbs_x_coord=?, rbs_y_coord=? 
                WHERE robots_idx=?`

                await pool.query(endLagLngUpdateSql,[endNextPos.x,endNextPos.y,robotId])

                console.log(`${robotId} 이동 중: ${endNextPos.x}, ${endNextPos.y}`)


                const endDistance=getDistance(endNextPos.x, endNextPos.y, parseFloat(destX), parseFloat(destY));
                if (endDistance <=20){
                    console.log(`${robotId} 도착지 반경 20m 내 도착 ! 배달완료로 상태 변경`)

                   
                    const endRobotStatusChangeSql=`
                    INSERT INTO robots_status_logs (robots_idx, status, updated_at)
                    VALUES (?, '배달 완료', NOW())
                    ON DUPLICATE KEY UPDATE updated_at = NOW()`

                    await pool.query(endRobotStatusChangeSql, [robotId]);

                    const endOrderStatusChangeSql=`
                    UPDATE orders
                    SET order_status='완료'
                    WHERE orders_idx=?`

                    await pool.query(endOrderStatusChangeSql, [orderId])
                   
                    clearInterval(interval);

                    setTimeout(async ()=>{
                        const delayedConn= await pool.getConnection();
                        try{
                            await delayedConn.beginTransaction();

                            // 로봇 상태 => 대기 중
                            const resetRobotStatusSql=`
                            INSERT INTO robots_status_logs ( robots_idx, status, updated_at)
                            VALUES (?, '대기 중',NOW())
                            ON DUPLICATE KEY UPDATE updated_at=NOW()`

                            await delayedConn.query(resetRobotStatusSql, [robotId]);

                            const clearOrderSql=`UPDATE robots SET orders_idx=NULL WHERE robots_idx=?`
                            await delayedConn.query(clearOrderSql, [robotId]);

                            await delayedConn.commit();
                            console.log(`로봇 (${robotId}) -> 대기 중 , 주문 (${orderId}) 해제 완료`)
                        }catch(err){
                            await delayedConn.rollback();
                            console.error(`로봇 (${robotId}) 상태 초기화 실패 :`, err);
                        }finally{
                            delayedConn.release();
                        }
                    }, 60000)
                }
                destIndex++;
            }, 2000);

        }, 2000);

        res.json({message : "10초 후 로봇 목적지로 이동이 시작됩니다.", robotId, orderId});
    } catch (error) {
        console.error("🚨 로봇 목적지 이동 업데이트 오류:", error);
        await connect.rollback();
        connect.release()
        res.status(500).json({ error: "로봇 목적지 이동 업데이트 중 오류 발생" , details: error.message});
    }
});

module.exports = router;
