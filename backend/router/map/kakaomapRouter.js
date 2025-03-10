const express = require('express');
const router = express.Router();

// 샘플 로봇 데이터
const robots = [
    { id: 1, name: "창영-1", lat: 37.5665, lng: 126.9780, status: "배송 중" },
    { id: 2, name: "창영-2", lat: 37.5660, lng: 126.9770, status: "대기 중" }
];

// 로봇 리스트 API
router.get('/robots', (req, res) => {
    res.json(robots);
});

module.exports = router;
