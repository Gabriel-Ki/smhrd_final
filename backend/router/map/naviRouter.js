const express = require('express');
const router = express.Router();

// 내비게이션 관련 데이터 예제
const navigationData = [
    { id: 1, name: "경로1", start: "서울", end: "부산", distance: "400km" },
    { id: 2, name: "경로2", start: "서울", end: "대구", distance: "300km" }
];

// 내비게이션 경로 리스트 반환 API
router.get('/routes', (req, res) => {
    res.json(navigationData);
});

// 특정 경로 정보 조회 API
router.get('/routes/:id', (req, res) => {
    const routeId = parseInt(req.params.id, 10);
    const route = navigationData.find(r => r.id === routeId);

    if (route) {
        res.json(route);
    } else {
        res.status(404).json({ error: "경로를 찾을 수 없습니다." });
    }
});

module.exports = router;
