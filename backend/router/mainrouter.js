const express = require('express');
const router = express.Router();
const conn=require('../config/config')

// 샘플 데이터 (API가 제공하는 로봇 상태 데이터)
// const robots = [
//     { id: 1, name: '프로그램명 -1', status: '작업 중' },
//     { id: 2, name: '프로그램명 -2', status: '대기 중' },
//     { id: 3, name: '프로그램명 -3', status: '작업 중' },
//     { id: 4, name: '프로그램명 -4', status: '작업 중' },
//     { id: 5, name: '프로그램명 -5', status: '작업 중' },
//     { id: 6, name: '프로그램명 -6', status: '에러' }
// ];

// 모든 로봇 데이터를 반환하는 API
router.get('/robots', (req, res) => {
    const sql='select * from js_robot_delivery';
    conn.query(sql,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({error : '연결 실패', details:err.message})
        }else{
            res.status(200).json({message : '연결 성공'})
            console.log(res);
        }
    })

});

// 특정 ID의 로봇을 반환하는 API
router.get('/robots/:id', (req, res) => {
    const robotId = parseInt(req.params.id);
    const robot = robots.find(r => r.id === robotId);

    if (!robot) {
        return res.status(404).json({ message: '로봇을 찾을 수 없습니다.' });
    }

    res.json(robot);
});

module.exports = router;
