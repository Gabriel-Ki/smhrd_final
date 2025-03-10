const express = require('express');
const router = express.Router();

// 샘플 로봇 데이터 (DB 대체용)
let robots = [
    { id: 1, name: "창영-1", lat: 37.5665, lng: 126.9780, status: "배송 중" },
    { id: 2, name: "창영-2", lat: 37.5660, lng: 126.9770, status: "대기 중" }
];

// 모든 로봇 데이터 조회 API
router.get('/robots', (req, res) => {
    res.json(robots);
});

// 특정 로봇 조회 API
router.get('/robots/:id', (req, res) => {
    const robotId = parseInt(req.params.id, 10);
    const robot = robots.find(r => r.id === robotId);

    if (robot) {
        res.json(robot);
    } else {
        res.status(404).json({ error: "로봇을 찾을 수 없습니다." });
    }
});

// 로봇 추가 API (POST)
router.post('/robots', (req, res) => {
    const { name, lat, lng, status } = req.body;
    
    if (!name || !lat || !lng || !status) {
        return res.status(400).json({ error: "모든 필드를 입력하세요." });
    }

    const newRobot = {
        id: robots.length + 1,
        name,
        lat,
        lng,
        status
    };

    robots.push(newRobot);
    res.status(201).json(newRobot);
});

// 로봇 위치 업데이트 API (PUT)
router.put('/robots/:id', (req, res) => {
    const robotId = parseInt(req.params.id, 10);
    const { lat, lng, status } = req.body;
    const robot = robots.find(r => r.id === robotId);

    if (!robot) {
        return res.status(404).json({ error: "로봇을 찾을 수 없습니다." });
    }

    if (lat) robot.lat = lat;
    if (lng) robot.lng = lng;
    if (status) robot.status = status;

    res.json(robot);
});

// 로봇 삭제 API (DELETE)
router.delete('/robots/:id', (req, res) => {
    const robotId = parseInt(req.params.id, 10);
    robots = robots.filter(r => r.id !== robotId);

    res.json({ message: "로봇이 삭제되었습니다." });
});

module.exports = router;
