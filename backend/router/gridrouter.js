const express = require('express');
const router = express.Router();

// 샘플 데이터 (API가 제공하는 로봇 목록)
const robots = [
    { id: 1, name: '로봇 A', status: '작업 중', battery: '80%', location: 'Zone 1' },
    { id: 2, name: '로봇 B', status: '대기 중', battery: '60%', location: 'Zone 2' },
    { id: 3, name: '로봇 C', status: '작업 중', battery: '90%', location: 'Zone 3' },
    { id: 4, name: '로봇 D', status: '작업 중', battery: '75%', location: 'Zone 4' },
    { id: 5, name: '로봇 E', status: '에러', battery: '50%', location: 'Zone 5' }
];

// 모든 로봇 목록을 반환하는 API
router.get('/robots', (req, res) => {
    res.json(robots);
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
