const models = require("../../models");
const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function (err) {
  console.log("Error" + err);
});

const getAsync = (key) =>
  new Promise((resolve, reject) => {
    redisClient.get("products:all", (err, data) => {
      if (data) {
        //results = data;
        resolve(data);
      } else {
        //results = null;
        resolve(null);
      }
    });
  });

//실질적인 기능을 구현하기 위한 js파일
exports.get_products = async (_, res) => {
  let results = JSON.parse(await getAsync("products:all"));
  //let results = await getAsync("products:all");

  /*redisClient.get("products:all", (err, data) => {
    if (data) {
      results = data;
    } else {
      results = null;
    }
  });
  */

  console.log(results);

  //받은 데이터로 Products database 조회하기
  //data 조건에 맞춘 조회(Query의 where절)
  //변수를 productsList로 정하고 여기에 data들이 저장됨

  const products = await models.Products.findAll();

  if (!results) {
    results = products;
  }

  res.render("admin/products.html", { products: results });
  /*models.Products.findAll({}).then((productList) => {
    res.render("admin/products.html", { productList: productList });*/
  //변수에 맞게
};

exports.get_products_write = (_, res) => {
  res.render("admin/write.html");
};

//받은 데이터로 db table 생성하기
//이전 페이지에서 작성을 눌러 post 메소드를 통해 data를 받음
//그 data를 받고 Products table에 data를 기재해주는것 = create(생성)
exports.post_products_write = async (req, res) => {
  //data field 맞추기
  //넘어오는 data는 bodyParser형태!(req.body 형태)
  //Query = insert , Sequelize = create

  /*await models.Products.create(req.body);
  res.redirect("/admin/products");*/
  await models.Products.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  const products = await models.Products.findAll();

  redisClient.set("products:all", JSON.stringify(products));

  res.redirect("/admin/products");
};

//상세페이지
exports.get_products_detail = (req, res) => {
  //req.params.id
  models.Products.findByPk(req.params.id).then((product) => {
    res.render("admin/detail.html", { product: product });
  });
};

//edit(수정)페이지 보여주기
exports.get_products_edit = (req, res) => {
  models.Products.findByPk(req.params.id).then((product) => {
    res.render("admin/write.html", { product: product });
  });
};

//수정하기 클릭후 수정된 사항을 반영해주기
//수정된 data들이 반영되는 곳(조건)은 req.params의 Pk를 일치하도록 해준다
//수정하고 상세페이지로 이동
exports.post_products_edit = (req, res) => {
  models.Products.update(
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    },
    {
      where: { id: req.params.id },
    }
  ).then(() => res.redirect("/admin/products/detail/" + req.params.id));
};

exports.get_products_delete = (req, res) => {
  models.Products.destroy({
    where: { id: req.params.id },
  }).then(() => {
    res.redirect("/admin/products");
  });
};
