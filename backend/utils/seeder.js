require("dotenv").config();
const Product = require("../models/product");
const connectDatabase = require("../config/database");
const products = require("../data/products.json");

connectDatabase();

(async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");
    await Product.insertMany(products);
    console.log("Products are seeded");
    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
})();
