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
            }, 5000);

        }, 5000);

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

module.exports = router;
