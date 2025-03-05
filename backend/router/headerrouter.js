// routes/Headerrouter.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ title: 'Main header', subtitle: 'Subtitle for Main header' });
});

module.exports = router;
