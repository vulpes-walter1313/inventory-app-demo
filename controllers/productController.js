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
exports.product_detail = asyncHandler(async (req, res, next) => {
  try {
    const product = await Instrument.findById(req.params.productId)
      .populate("category")
      .exec();
    if (product) {
      res.render("product_detail", {
        title: product.name
          .slice(0, 30)
          .concat("", "... | Music Inventory App"),
        product: product,
      });
    } else {
      const err = new Error("Product Not found");
      err.status = 404;
      return next(err);
    }
  } catch (e) {
    console.log(e);
    const err = new Error(`Product: ${e.value} Not found`);
    err.status = 404;
    return next(err);
  }
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
