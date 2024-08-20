const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.set('port', 5000);

// static 미들 웨어
app.use('/', express.static("public"));
// URL 또는 포트가 다른 클라이언트 요청 허용
app.use(cors());
// post 요청 파라미터 처리
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 데이터 임시 저장 배열
const todoList = [{no:101, title:"공부하기(서버)", done: false},
    {no:102, title:"자바하기(서버)", done: true},
    {no:103, title:"리액트하기(서버)", done: false},
    {no:104, title:"스프링하기(서버)", done: false}];
let noCnt = 105;

app.get("/todo", (req, res)=>{
    // 목록 출력
    res.send(todoList);
});

app.post("/todo", (req, res)=>{
    // 할일 입력 
    // bodyParser 미들웨어 등록을 해야 파라미터 처리 가능.
    const newTodo = {
        no:noCnt++, 
        title:req.body.title, 
        done: false
    };
    todoList.push(newTodo);
    res.send(todoList);
});

app.put("/todo", (req, res)=>{
    // 할일 수정
    const idx = todoList.findIndex((item) => {
        return item.no === parseInt(req.body.no);
    });
    if(idx != -1) {
        todoList[idx] = req.body;
    }
    res.send(todoList);
});

// localhost:5000/todo/105
app.delete("/todo/:no", (req, res)=>{
    console.log("Delete /todo :", req.params.no);
    // 할일 삭제
    // no가 같은 index 찾아서 제거
    const idx = todoList.findIndex((item) => {
        return item.no === parseInt(req.params.no);
    });
    if(idx != -1) {
        todoList.splice(idx, 1);
    }
    res.send(todoList);
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log("서버 실행 중 >>> http://localhost:"+app.get('port'));
});