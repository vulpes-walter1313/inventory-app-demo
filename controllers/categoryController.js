const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Instrument = require("../models/instrument");
const { body, validationResult, matchedData } = require("express-validator");

// GET /category/create
exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "Create Category" });
};

// POST /category/create
exports.category_create_post = [
  body("name").trim().notEmpty().isAlpha().isLength({ min: 4 }).escape(),
  body("slug").trim().isSlug().escape().toLowerCase(),
  body("description").optional().notEmpty().trim().escape(),
  asyncHandler(async (req, res) => {
    const errResult = validationResult(req);
    const data = matchedData(req);
    const category = new Category({
      name: data.name,
      slug: data.slug,
      description: data.description,
    });

    if (errResult.isEmpty()) {
      // No errors present
      category.save();
      res.redirect(`/category/${category.slug}`);
    } else {
      console.log(errResult);
      res.render("category_form", {
        title: "Create Category",
        errors: errResult,
        category: category,
      });
    }
  }),
];

// GET /category/:categoryName
exports.category_products_list = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.categoryName,
  }).exec();
  const products = await Instrument.find({ category: category }).exec();
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("products_list", {
    title: `${category.name}`,
    category: category,
    products: products,
  });
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
