const express = require('express');
const router = express.Router();

// 샘플 헤더 데이터
const headerData = {
    siteName: "자율주행 배달 시스템",
    user: {
        id: 1,
        name: "홍길동",
        role: "관리자"
    },
    notifications: [
        { id: 1, message: "새로운 배달 요청이 있습니다.", read: false },
        { id: 2, message: "시스템 업데이트가 예정되었습니다.", read: true }
    ],
    language: "ko"
};

// 헤더 데이터 조회 API
router.get('/header', (req, res) => {
    res.json(headerData);
});

// 사용자 정보 업데이트 API (예: 이름 변경)
router.put('/header/user', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "이름을 입력하세요." });
    }

    headerData.user.name = name;
    res.json(headerData.user);
});

// 알림 읽음 상태 변경 API
router.put('/header/notifications/:id', (req, res) => {
    const notificationId = parseInt(req.params.id, 10);
    const notification = headerData.notifications.find(n => n.id === notificationId);

    if (!notification) {
        return res.status(404).json({ error: "알림을 찾을 수 없습니다." });
    }

    notification.read = true;
    res.json(notification);
});

// 언어 설정 변경 API
router.put('/header/language', (req, res) => {
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ error: "언어를 입력하세요." });
    }

    headerData.language = language;
    res.json({ message: `언어가 ${language}로 변경되었습니다.` });
});

module.exports = router;
