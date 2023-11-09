const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");

module.exports.index_homepage = asyncHandler(async function (req, res, next) {
  const [categories, products] = await Promise.all([
    Category.find().exec(),
    await Instrument.find().limit(12).exec(),
  ]);
  res.render("index", {
    title: "Music Store Inventory",
    categories: categories,
    products: products,
  });
});

module.exports.categories_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().exec();
  // res.send("Route not implemented: list of all categories");
  res.render("categories", {
    title: "Categories",
    categories: categories,
  });
});

module.exports.products_list = asyncHandler(async (req, res) => {
  const products = await Instrument.find().exec();
  res.render("products", { title: "Products", products: products });
});
