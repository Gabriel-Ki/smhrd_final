const express = require("express");
const router = express.Router();


app.get('/api/Main', (req, res) => {
    res.json(mainData);
});


module.exports = router;