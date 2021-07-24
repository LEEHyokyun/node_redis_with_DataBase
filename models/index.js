var Sequelize = require("sequelize");
var path = require("path");
var fs = require("fs");
var dotenv = require("dotenv");

//환경변수를 활용하기위해 dotenv를 import하고, 이에 대한 config설정
dotenv.config();

//Sequelize를 이용하여 DB접근
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+09:00",
    operatorsAliases: Sequelize.Op,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

let db = [];

//index.js 파일을 제외한 나머지 파일과 sync
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".js") && file !== "index.js";
  })
  .forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
