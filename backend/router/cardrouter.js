const express = require('express');
const router = express.Router();

// 샘플 데이터 (API가 제공하는 로봇 상세 정보 및 로그 데이터)
const robots = [
    {
        id: 1,
        name: '로봇 A',
        status: '작업 중',
        battery: '80%',
        location: 'Zone 1',
        logs: [
            { time: '12:10', message: '목적지 발견' },
            { time: '12:12', message: '목적지 도착' },
            { time: '12:15', message: '배터리 부족 경고' },
            { time: '12:20', message: '내부 인식기 오류' }
        ]
    },
    {
        id: 2,
        name: '로봇 B',
        status: '대기 중',
        battery: '60%',
        location: 'Zone 2',
        logs: [
            { time: '11:50', message: '대기 상태 진입' },
            { time: '12:00', message: '충전 중' }
        ]
    },
    {
        id: 3,
        name: '로봇 C',
        status: '작업 중',
        battery: '90%',
        location: 'Zone 3',
        logs: [
            { time: '11:30', message: '작업 시작' },
            { time: '11:45', message: '목적지 도착' }
        ]
    }
];

// 모든 로봇의 카드 정보 반환 API
router.get('/robots', (req, res) => {
    res.json(robots);
});

// 특정 ID의 로봇 상세 정보 반환 API
router.get('/robots/:id', (req, res) => {
    const robotId = parseInt(req.params.id);
    const robot = robots.find(r => r.id === robotId);

    if (!robot) {
        return res.status(404).json({ message: '로봇을 찾을 수 없습니다.' });
    }

    res.json(robot);
});

module.exports = router;
