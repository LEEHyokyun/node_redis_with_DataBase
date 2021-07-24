//기능별 class화하여 나타낸다

const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");
const db = require("./models");

class App {
  constructor() {
    //기본적인 express 세팅
    this.app = express();

    //db접속
    this.dbConnection();

    //뷰엔진 세팅
    this.setViewEngine();

    //미들웨어 세팅
    this.setMiddleWare();

    //정적 디렉토리 추가
    this.setStatic();

    //로컬 변수
    this.setLocals();

    //라우팅
    this.getRouting();

    //404 error controlling
    this.status404();

    //error controlling
    this.errorHandler();
  }

  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully");
      })
      .then(() => {
        console.log("DB Sync complete");
        //db와 sync
        // return db.sequelize.sync();
      })
      .catch((err) => {
        console.error("Unable to connect to the database: ", err);
      });
  }

  setViewEngine() {
    nunjucks.configure("template", {
      autoescape: true,
      express: this.app,
    });
  }

  setMiddleWare() {
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  setStatic() {
    this.app.use("/uploads", express.static("uploads"));
  }

  setLocals() {
    this.app.use((req, res, next) => {
      this.app.locals.isLogin = true;
      this.app.locals.req_path = req.path;
      next();
    });
  }

  //Routing을 하기위해 controllers 폴더를 호출
  //폴더 안의 index.html 자체를 불러온다
  getRouting() {
    this.app.use(require("./controllers"));
  }

  status404() {
    this.app.use((req, res, _) => {
      res.status(404).render("common/404.html");
    });
  }

  errorHandler() {
    this.app.use((err, req, res, _) => {
      res.status(500).render("common/500.html");
    });
  }
}

module.exports = new App().app;
