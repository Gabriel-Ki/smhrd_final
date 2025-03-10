const express = require('express');
const router = express.Router();

// 샘플 주문 데이터 (DB 대체용)
let orders = [
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

// 모든 주문 조회 API
router.get('/orders', (req, res) => {
    res.json(orders);
});

// 특정 로봇의 주문 조회 API
router.get('/orders/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    const order = orders.find(o => o.robotId === robotId);

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: "해당 로봇의 주문 정보를 찾을 수 없습니다." });
    }
});

// 주문 상태 업데이트 API
router.put('/orders/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    const { status } = req.body;
    const order = orders.find(o => o.robotId === robotId);

    if (!order) {
        return res.status(404).json({ error: "해당 로봇의 주문 정보를 찾을 수 없습니다." });
    }

    if (!status) {
        return res.status(400).json({ error: "상태 값을 입력하세요." });
    }

    order.status = status;
    res.json(order);
});

// 주문 추가 API (POST)
router.post('/orders', (req, res) => {
    const { robotId, robotName, status, destination, items } = req.body;

    if (!robotId || !robotName || !status || !destination || !items) {
        return res.status(400).json({ error: "모든 필드를 입력하세요." });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    const newOrder = {
        id: orders.length + 1,
        robotId,
        robotName,
        status,
        destination,
        items,
        totalPrice
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// 주문 삭제 API (DELETE)
router.delete('/orders/:robotId', (req, res) => {
    const robotId = parseInt(req.params.robotId, 10);
    orders = orders.filter(o => o.robotId !== robotId);

    res.json({ message: "주문이 삭제되었습니다." });
});

module.exports = router;
