const { Router } = require("express");
const router = Router();

//admin url 요청을 받았을시 admin 폴더에 접근한다.
//admin폴더는 index.js와 admin.ctrl.js 두개의 파일을 생성한다.
//요청 url 및 기능에 따라 폴더와 파일을 구분짓는게 중요!
router.use("/admin", require("./admin"));

module.exports = router;
