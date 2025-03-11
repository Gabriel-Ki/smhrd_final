const express = require('express');
const router = express.Router();

// 샘플 데이터 (API가 제공하는 로봇 상태 개수)
const robotStatusSummary = {
    total: 8,       // 전체 로봇 개수
    working: 4,     // 작업 중
    waiting: 2,     // 대기 중
    error: 1,       // 에러
    emergencyStop: 1 // 비상 정지
};

// 로봇 상태 요약 데이터 반환 API
router.get('/status', (req, res) => {
    res.json(robotStatusSummary);
});

module.exports = router;