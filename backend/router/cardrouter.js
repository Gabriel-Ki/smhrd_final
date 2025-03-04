const express = require("express");
const router = express.Router();

// 예시 데이터
const cardData = [
    { id: 1, title: 'Card 1', content: 'Content for card 1' },
    { id: 2, title: 'Card 2', content: 'Content for card 2' },
];

app.get('/api/card', (req, res) => {
    res.json(cardData);
});

module.exports = router;