const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const mainrouter = require("./routes/mainrouter");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bp.urlencoded({extended:true}));
app.use("/Main",mainrouter);
app.use("/Main/card",cardrouter);
app.use("/Main/header",Headerrouter);

app.get('/api/', (req, res) => {
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다.`);
});