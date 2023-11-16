const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");
const { body, validationResult, matchedData } = require("express-validator");

// GET /product/create
exports.product_create_get = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).exec();
  res.render("product_form", {
    title: "Create A New Product",
    categories: categories,
    errors: undefined,
    selectedCategory: undefined,
  });
});

// POST /product/create
exports.product_create_post = [
  body("name").trim().isLength({ max: 140 }).escape(),
  body("description").optional().trim().escape(),
  body("category").isMongoId().escape(),
  body("price").trim().isFloat({ gt: 0 }).escape(),
  body("instock").trim().isInt({ min: 0 }).escape(),
  body("slug").trim().isSlug().escape(),
  asyncHandler(async (req, res) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no errors
      const category = await Category.findById(data.category).exec();
      const product = new Instrument({
        name: data.name,
        description: data.description,
        category: category,
        price: data.price,
        inStock: data.instock,
        slug: data.slug,
      });
      product.save();
      res.redirect(product.url);
    } else {
      // errors in validation
      const categories = await Category.find({}).exec();
      res.render("product_form", {
        title: "Add a product",
        selectedCategory: data.category ?? "",
        product: {
          name: data.name,
          description: data.description,
          price: data.price,
          inStock: data.instock,
          slug: data.slug,
        },
        errors: errResult,
        categories: categories,
      });
    }
  }),
];

// GET /product/:productSlug
exports.product_detail = asyncHandler(async (req, res, next) => {
  try {
    const product = await Instrument.findOne({ slug: req.params.productSlug })
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

// GET /product/:productSlug/edit
exports.product_edit_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: prefilled product form to edit: ${req.params.productSlug}`,
  );
});

// POST /product/:productSlug/edit
exports.product_edit_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to edit product: ${req.params.productSlug}`,
  );
});

// GET /product/:productSlug/delete
exports.product_delete_get = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: confirmation page to delete: ${req.params.productSlug}`,
  );
});

// POST /product/:productSlug/delete
exports.product_delete_post = asyncHandler(async (req, res) => {
  res.send(
    `Route not implemented: post response to delete product: ${req.params.productSlug}`,
  );
});
