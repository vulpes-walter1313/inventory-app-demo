const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");

module.exports.index_homepage = asyncHandler(async function (req, res, next) {
  const [categories, products] = await Promise.all([
    Category.find().exec(),
    await Instrument.find().limit(3).exec(),
  ]);
  res.render("index", { title: "Express" });
});

module.exports.categories_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().exec();
  res.send("Route not implemented: list of all categories");
});

module.exports.products_list = asyncHandler(async (req, res) => {
  const products = await Instrument.find().exec();
  res.send("Route not implemented: a full list of all the products");
});