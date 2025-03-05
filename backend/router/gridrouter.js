// routes/gridrouter.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Grid router is working!' });
});

module.exports = router;
