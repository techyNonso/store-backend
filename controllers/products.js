const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  //any error thrown here can be handled in custom error handler (even errors with mongoose)
  //throw new Error("Testing async errors");
  const products = await Product.find({ featured: true });
  res.status(200).json({
    products,
    nbHits: products.length,
  });
};
const getAllProducts = async (req, res) => {
  res.status(200).json({
    msg: "Products testing route",
  });
};

module.exports = { getAllProductsStatic, getAllProducts };
