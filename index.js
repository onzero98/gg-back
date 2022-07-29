const express = require("express");
const cors = require("cors");
const fs = require("fs");
// MySQL DB 연동
const dotenv = require('dotenv');

dotenv.config();

const {
    api_manager,
} = require("./router");

const app = express();
const PORT = 8080;
// const SECRET = process.env.SECRET;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버 상태 확인
app.get("/", (req, res) => {
    res.send("Success !");
});

// API
app.use(api_manager);

app.listen(PORT, () => {
    console.log(`${PORT} 로 연결 중입니다.`);
})