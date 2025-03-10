const express = require('express');
const router = express.Router();
const conn=require('../config/config')


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
