const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");

// GET /category/create
exports.category_create_get = (req, res) => {
  res.send("Route not implemented: a create category form");
};

// POST /category/create
exports.category_create_post = asyncHandler(async (req, res) => {
  res.send("Route not implemented: Post for /category/create");
});

// GET /category/:categoryName
exports.category_products_list = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: list of products from category: ${req.params.categoryName}`,
  );
});

// GET /category/:categoryName/edit
exports.category_edit_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: a prefilled category form to make an edit to ${req.params.categoryName}`,
  );
});

// POST /category/:categoryName/edit
exports.category_edit_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to edit ${req.params.categoryName}`,
  );
});

// GET /category/:categoryName/delete
exports.category_delete_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: confirmation page to delete ${req.params.categoryName} category`,
  );
});

// POST /category/:categoryName/delete
exports.category_delete_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to delete ${req.params.categoryName} category`,
  );
});
