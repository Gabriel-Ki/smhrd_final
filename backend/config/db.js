// 디비의 연결정보를 관리하는 파일
// 파일이 호출 될 때마다 DB에 연결하는 역할
const mysql = require("mysql2");

// DB연결정보 셋팅
const conn = mysql.createConnection({
    // 사용자의 서버이름 host네임
    host : "localhost",
    //포트번호 지정
    port :3306,
    //사용자 계정정보
    user : "root",
    //사용자 계정 비밀번호
    password :"1234",
    //연결할 데이터 베이스 
    database : "js_db"
}) 

// 실제 DB와 연결
conn.connect();
console.log("디비연결!");

module.exports = conn;