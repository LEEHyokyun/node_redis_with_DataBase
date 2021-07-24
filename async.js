const models = require("./models");

//특정제품정보를 가져오기 위함
async function getProducts() {
  
    try{
        const product1 = await models.Products.findByPk(5);
        const product2 = await models.Products.findByPk(6);
      
        console.log(product1.dataValues);
        console.log(product2.dataValues);
      }catch(err){
        console.log(err)
    }
  
    

getProducts();
