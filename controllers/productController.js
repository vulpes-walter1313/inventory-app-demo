const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");

// GET /product/create
exports.product_create_get = (req, res) => {
  res.send("Route not implemented: send a create new product form");
};

// POST /product/create
exports.product_create_post = asyncHandler(async (req, res) => {
  res.send("Route not implemented: send a create new product form");
});

// GET /product/:productId
exports.product_detail = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: product detailed page for product: ${req.params.productId}`,
  );
});

// GET /product/:productId/edit
exports.product_edit_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: prefilled product form to edit: ${req.params.productId}`,
  );
});

// POST /product/:productId/edit
exports.product_edit_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to edit product: ${req.params.productId}`,
  );
});

// GET /product/:productId/delete
exports.product_delete_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: confirmation page to delete: ${req.params.productId}`,
  );
});

// POST /product/:productId/delete
exports.product_delete_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to delete product: ${req.params.productId}`,
  );
});
