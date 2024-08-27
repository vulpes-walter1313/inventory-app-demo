import asyncHandler from "express-async-handler";
import Products from "../models/Products";
import Category from "../models/Category";
import { matchedData, query, validationResult } from "express-validator";
import HttpError from "../lib/HttpError";

export const index_homepage = [
  asyncHandler(async function (req, res, next) {
    const [categories, products] = await Promise.all([
      Category.getCategories(),
      Products.getProducts({ limit: 3, page: 1 }),
    ]);
    res.render("index", {
      title: "Music Store Inventory",
      categories: categories,
      products: products,
    });
  }),
];

export const categories_list = asyncHandler(async (req, res) => {
  const categories = await Category.getCategories();
  res.render("categories", {
    title: "Categories",
    categories: categories,
  });
});

export const products_list = [
  query("limit").optional().isInt(),
  query("page").optional().isInt(),
  asyncHandler(async (req, res, next) => {
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
      const error = new HttpError("validation error", 400);
      next(error);
      return;
    }
    const data = matchedData(req);
    let limit = parseInt(data.limit || "9");
    if (limit > 20) {
      limit = 20;
    }
    let page = parseInt(data.page || "1");
    const totalCount = await Products.getCount();
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) {
      page = totalPages;
    }
    // at this point, page and limit are within safe boundries
    const products = await Products.getProducts({ limit, page });
    const totalPagesArr: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      totalPagesArr.push(i);
    }
    res.render("products", {
      title: "Products",
      products: products,
      currentPage: page,
      totalPages: totalPagesArr,
      limit,
    });
  }),
];
