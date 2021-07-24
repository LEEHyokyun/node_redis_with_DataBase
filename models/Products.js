const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  //prodcuts에 대한 data를 담는 table
  //Products가 table 이름이 된다
  const Products = sequelize.define("Products", {
    //atuoIncrement : 1씩 자동증가
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
  });

  //함수만들기(dateFormat)
  Products.prototype.dateFormat = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  return Products;
};
