const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");

app.set('port', 3000);
app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.static("uploads"));
// POST 방식으로 파라미터 전달 받기 위한 설정
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// 쿠키 사용 미들웨어 설정
app.use(cookieParser());
// 세션 미들웨어 등록
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

// 임시 데이터 
const memberList = [
    {no:101, id:"user01", password:"1234", name:"홍길동", email:"hong@gmail.com"},
    {no:102, id:"user02", password:"12345", name:"김길동", email:"kim@gmail.com"},
    {no:103, id:"user03", password:"123", name:"박길동", email:"lee@gmail.com"},
    {no:104, id:"user04", password:"123456", name:"이길동", email:"park@gmail.com"}
];
let noCnt = 105;

// 쇼핑몰 상품 목록
const carList = [
    {
        _id:111, 
        name:'SM5', 
        price:3000, 
        year:1999, 
        company:'SAMSUNG', 
        originalname: "", 
        filename: "",
        filesize: 0,
        mimetype: "",
        writedate: "",
        photos: [
            {
                originalname: "OIP.jpg",
                filename: "OIP/jpg",
                filesize: 371000,
                mimetype: "img/jpg"
            }, {
                originalname: "OIP.jpg",
                filename: "OIP/jpg",
                filesize: 95900,
                mimetype: "img/jpg"
            }
        ]
    },
];
let carSeq=117;

// 요청 라운팅 사용
const router = express.Router();

router.route("/home").get((req,res)=> {
    req.app.render("home/Home", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/profile").get((req,res)=> {
    req.app.render("profile/Profile", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/member").get((req,res)=> {
    // 로그인이 되어 있다면 member 페이지를 보여준다.
    // 쿠키는 사용자쪽에 전달(res), 세션은 요청 들어올때 생성(req)
    if(req.session.user !== undefined) {
        const user = req.session.user;
        req.app.render("member/Member", {user}, (err, html)=>{
            res.end(html);
        });
    } else {
        res.redirect("/login");
    }
});
router.route("/login").get((req,res)=> {
    req.app.render("member/Login", {}, (err, html)=>{
        // 사용자(접속자)의 로컬에 쿠키가 저장 된다.
        res.cookie('user', {
            id:'TestUser',
            name: '테스트 유저',
            authorized: true
        });
        res.end(html);
    });
});
router.route("/login").post((req,res)=> {
    console.log(req.body.id, req.body.password);
    const idx = memberList.findIndex(member=>member.id===req.body.id);
    if(idx != -1) {
        if(memberList[idx].password === req.body.password) {
            console.log("로그인 성공!");
            // 세션에 로그인 정보를 등록 후 멤버 페이지 이동
            req.session.user = {
                id: req.body.id,
                name: memberList[idx].name,
                email: memberList[idx].email, 
                no: memberList[idx].no
            }
            res.redirect("/member");
        } else {
            console.log("로그인 실패! 패스워드가 맞지 않습니다.");
            // 다시 로그인 페이지로 다시 이동
            res.redirect("/login");
        }
    } else {
        console.log("존재하지 않는 계정입니다.");
        res.redirect("/login");
    }
});
router.route("/logout").get((req, res)=>{
    console.log("GET - /logout 호출 ...");
    // 로그인 된 상태라면 로그아웃
    if(!req.session.user) {
        console.log("아직 로그인 전 상태입니다.");
        res.redirect("/login");
        return;
    }
    // 세션의 user 정보를 제거 해서 logout처리
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log("로그아웃 성공!");
        res.redirect("/login");
    });
});
router.route("/joinus").get((req,res)=> {
    // 회원 가입 ejs 페이지 forward
    req.app.render("member/Joinus", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/joinus").post((req,res)=> {
    // 회원 가입 처리 후 목록으로 갱신
    res.redirect("/member");
});
router.route("/gallery").get((req,res)=> {
    req.app.render("gallery/Gallery", {}, (err, html)=>{
        res.end(html);
    });
});
// ---- 쇼핑몰 기능
router.route("/shop").get((req,res)=> {
    req.app.render("shop/Shop", {carList}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/insert").get((req,res)=> {
    req.app.render("shop/Insert", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/shop/insert").post((req,res)=> {
    // 파일 업르도 기능 추가
    res.redirect("/shop");
});
router.route("/shop/modify").get((req,res)=> {
    const _id = parseInt(req.query._id);
    console.log(_id)
    const idx = carList.findIndex(car=>_id===car._id);
    console.log(idx);
    if(idx === -1) {
        console.log("상품이 존재 하지 않습니다.")
        res.redirect("/shop");
        return;
    }
    req.app.render("shop/Modify", {car:carList[idx]}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/modify").post((req,res)=> {
    console.log("POST - /shop/modify 호출");
    console.dir(req.body);
    res.redirect('/shop');
});
router.route("/shop/detail").get((req,res)=> {
    // 쿼리로 전송된 데이터는 모두 문자열이다. 
    // parseInt() 필수 "56" <-- numeric
    const _id = parseInt(req.query._id);
    //console.log(_id)
    const idx = carList.findIndex(car=>_id===car._id);
    //console.log(idx);
    if(idx === -1) {
        console.log("상품이 존재 하지 않습니다.")
        res.redirect("/shop");
        return;
    }
    req.app.render("shop/Detail", {car:carList[idx]}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/delete").get((req,res)=> {
    req.app.render("shop/Delete", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/shop/cart").get((req,res)=> {
    req.app.render("shop/Cart", {}, (err, html)=>{
        res.end(html);
    });
});

// router 설정 맨 아래에 미들웨어 등록
app.use('/', router);

// 등록되지 않은 패스에 대해 페이지 오류 응답
// app.all('*', function(req, res) {
//     res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>')
// });

const expressErrorHandler = require('express-error-handler');
//모든 라우터 처리 후 404 오류 페이지 처리
const errorHandler = expressErrorHandler({
    static : {
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404) );
app.use(errorHandler );

// 서버 생성 및 실행
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`Run on server >>> http://localhost:${app.get('port')}`);
});