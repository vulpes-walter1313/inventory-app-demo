import asyncHandler from "express-async-handler";
import Products from "../models/Products";
import Category from "../models/Category";

export const index_homepage = asyncHandler(async function (req, res, next) {
  const [categories, products] = await Promise.all([
    Category.getCategories(),
    Products.getProducts(),
  ]);
  console.log("categories", categories);
  console.log("products", products);
  res.render("index", {
    title: "Music Store Inventory",
    categories: categories,
    products: products,
  });
});

export const categories_list = asyncHandler(async (req, res) => {
  // const categories = await Category.find().exec();
  const categories = await Category.getCategories();
  // res.send("Route not implemented: list of all categories");
  res.render("categories", {
    title: "Categories",
    categories: categories,
  });
});

export const products_list = asyncHandler(async (req, res) => {
  // const products = await Instrument.find().exec();
  const products = await Products.getProducts();
  res.render("products", { title: "Products", products: products });
});