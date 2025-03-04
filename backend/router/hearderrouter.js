const express = require("express");
const router = express.Router();




// 예시 데이터
const headerData = {
    title: 'Main Header',
    subtitle: 'Subtitle for Main Header'
};

app.get('/api/header', (req, res) => {
    res.json(headerData);
});

module.exports = router;