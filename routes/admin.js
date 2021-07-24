//로그인시 들어오는 요청 / url들이 모두 보관되는 장소
// 어떤 기능을 하는지 유추할 수 있도록 js파일 명명을 하는 것이 중요

const express = require("express");
const router = express.Router();

//MiddleWare
//요청/응답함수의 중간인자로 넣어
//요청을 받으면 중간에 실행된 후에 응답을 진행하는 로직
function testMiddleWare(req, res, next) {
  console.log("first middelWare");
  next();
}

//router 객체에 대한 내장함수 사용
//get함수
//해당 url 요청을 받으면 이후 로직을 통해 사용자에게 응답
router.get("/", testMiddleWare, (req, res) => {
  res.send("admin 이후 url");
});

router.get("/products", (req, res) => {
  //message를 보낸다면 send!
  //res.send("admin/products이후 url");

  //template를 보낸다면 render!
  res.render("admin/products.html", {
    message: "hello!",
  });
});

//products.html의 작성클릭시
//해당 url요청을 받으며 넘어오게 됨
router.get("/products/write", (req, res) => {
  res.render("admin/write.html");
});

//write.html의 부트스트립화면에서 작성하기 클릭시
//post 함수를 통해 다음 로직을 구현

//write.html에서 각 데이터 입력후 작성하기를 눌렀을때
//그 입력한 값들에 데이터들도 post를 통해 제출됨

router.post("/products/write", (req, res) => {
  //client가 요청할때 req에는 입력한 정보들이 담긴다!
  res.send(req.body.name);
  res.send(req.body.price);
  res.send(req.body.description);
});

//admin.js 파일을 export 조치하기.
//이 파일은 app.js에서 import(require)하여 사용한다.
module.exports = router;
