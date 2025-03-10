const express = require('express');
const router = express.Router();

// 샘플 배달 데이터 (DB 대체용)
let deliveries = [
    {
        id: 1,
        robotId: 101,
        robotName: "창영-1",
        status: "배달 중",
        destination: "서울 강남구 테헤란로",
        items: [
            { name: "햄버거", price: 5000 },
            { name: "콜라", price: 2000 }
        ],
        totalPrice: 7000
    },
    {
        id: 2,
        robotId: 102,
        robotName: "창영-2",
        status: "대기 중",
        destination: "서울 종로구 세종대로",
        items: [
            { name: "치킨", price: 15000 },
            { name: "맥주", price: 5000 }
        ],
        totalPrice: 20000
    }
];

// 모든 배달 조회 API
router.get('/deliveries', (req, res) => {
    res.json(deliveries);
});

// 특정 로봇의 배달 조회 API
router.get('/deliveries/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    const delivery = deliveries.find(d => d.robotId === robotId);

    if (delivery) {
        res.json(delivery);
    } else {
        res.status(404).json({ error: "해당 로봇의 배달 정보를 찾을 수 없습니다." });
    }
});

// 배달 상태 업데이트 API (PUT)
router.put('/deliveries/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    const { status } = req.body;
    const delivery = deliveries.find(d => d.robotId === robotId);

    if (!delivery) {
        return res.status(404).json({ error: "해당 로봇의 배달 정보를 찾을 수 없습니다." });
    }

    if (!status) {
        return res.status(400).json({ error: "상태 값을 입력하세요." });
    }

    delivery.status = status;
    res.json(delivery);
});

// 배달 추가 API (POST)
router.post('/deliveries', (req, res) => {
    const { robotId, robotName, status, destination, items } = req.body;

    if (!robotId || !robotName || !status || !destination || !items) {
        return res.status(400).json({ error: "모든 필드를 입력하세요." });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    const newDelivery = {
        id: deliveries.length + 1,
        robotId,
        robotName,
        status,
        destination,
        items,
        totalPrice
    };

    deliveries.push(newDelivery);
    res.status(201).json(newDelivery);
});

// 배달 삭제 API (DELETE)
router.delete('/deliveries/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    deliveries = deliveries.filter(d => d.robotId !== robotId);

    res.json({ message: "배달이 삭제되었습니다." });
});

module.exports = router;
