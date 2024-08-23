const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

app.set('port', 3000);
console.log("__dirname:", __dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", express.static(path.join(__dirname, "public") ));
app.use(cors());

//POST 요청 시 파라미터를 body에서 사용하기 위한 설정
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const saramList = [
    {no: 1035, name: "박태호", dept: "기획부", grade: "부장"},
    {no: 1036, name: "손유일", dept: "개발부", grade: "과장"},
    {no: 1037, name: "오수철", dept: "인사부", grade: "대리"},
    {no: 1038, name: "안재홍", dept: "영업부", grade: "사원"},
    {no: 1039, name: "홍길동", dept: "개발부", grade: "대리"}
];

let noCnt = 1040;

//index.html에서 Ajax 요청 처리
//구현하고 Postman으로 테스트 하세요
app.get("/saram", (req, res) => {
    console.log("GET - /saram 요청");
    res.send(saramList);
});

app.post("/saram", (req, res) => {
    console.log("POST - /saram 요청");
    const newEmployee = {
        no: noCnt++,
        name: req.body.name,
        dept: req.body.dept,
        grade: req.body.grade
    };
    saramList.push(newEmployee);
    res.send(saramList);
});

app.put("/saram", (req, res) => {
    console.log("PUT - /saram 요청");
    res.send();
});

app.delete("/saram", (req, res) => {
    console.log("DELETE - /saram 요청");
    res.send();
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`서버 실행 중>>> http://localhost:${app.get('port')}`);
    console.log(saramList);
});