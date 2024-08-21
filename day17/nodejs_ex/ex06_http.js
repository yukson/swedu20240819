var http = require('http');
var server = http.createServer();
server.listen(3000, () => {
    console.log("http://localhost:3000");
});

const html = `
    <!DOCTYPE html>
    <html lang="ko">
        <head>
            <title>Node.js 응답</title>
            <meta charset="UTF-8" />
        </head>
        <body>
            <h1>Node.js 응답 페이지</h1>
        </body>
    </html>
`;

server.on('request', function(req, res){
    console.log('>>> 클라이언트 요청이 들어왔습니다.');
    
    //res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write(html);
    setTimeout(() => {
        res.end();
    }, 1000)
    res.end();
    // res.write()는 여러번 호출 가능, res.end()는 한번만 호출해야함
    // res.end()는 문자열 데이터만 사용
    // res.send()는 수식, 객체 등을 body 화면에 바로 출력
});
