// routes/cardrouter.js
const express = require('express');
const router = express.Router();


const cardData = [
    { id: 1, title: 'Card 1', content: 'Content for card 1' },
    { id: 2, title: 'Card 2', content: 'Content for card 2' },
];

router.get('/', (req, res) => {
    res.json(cardData);
});

module.exports = router;