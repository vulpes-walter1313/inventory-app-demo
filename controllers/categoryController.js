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
exports.category_edit_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.categoryName,
  }).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: `Edit: ${category.name} Category`,
    category: category,
  });
});

// POST /category/:categoryName/edit
exports.category_edit_post = [
  body("name").trim().notEmpty().isAlpha().isLength({ min: 4 }).escape(),
  body("slug").trim().isSlug().escape().toLowerCase(),
  body("description").optional().notEmpty().trim().escape(),
  asyncHandler(async (req, res) => {
    const category = await Category.findOne({
      slug: req.params.categoryName,
    }).exec();
    if (category === null) {
      const err = new Error("Category Not Found");
      err.status = 404;
      return next(err);
    }

    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no errors
      category.name = data.name;
      category.slug = data.slug;
      category.description = data.description;
      await category.save();
      res.redirect(`/category/${category.slug}`);
    } else {
      res.render("category_form", {
        title: `Edit: ${category.name} Category`,
        category: {
          name: data.name,
          slug: data.slug,
          description: data.description,
        },
        errors: errResult,
      });
    }
  }),
];

// GET /category/:categoryName/delete
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.categoryName });
  const products = await Instrument.find({ category: category });

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  if (products.length > 0) {
    res.render("category_delete", {
      title: `Delete ${category.name}?`,
      category: category,
      products: products,
    });
  } else {
    res.render("category_delete", {
      title: `Delete ${category.name}?`,
      category: category,
      products: undefined,
    });
  }
});

// POST /category/:categoryName/delete
exports.category_delete_post = [
  body("categoryid").trim().isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    const category = await Category.findById(data.categoryid).exec();
    const products = await Instrument.find({ category: category });
    if (category === null) {
      const err = new Error("Category doesn't exist");
      err.status = 500;
      return next(err);
    }
    if (errResult.isEmpty()) {
      // no errors
      if (products.length > 0) {
        // There are still products under that category
        res.render("category_delete", {
          title: `You can't delete ${category.name}`,
          category: category,
          products: products,
        });
      } else {
        // the category exists but there are not products under it.
        await Category.findByIdAndDelete(data.categoryid).exec();
        res.redirect("/categories");
      }
    } else {
      // errors in validation
      const err = new Error("Unknown error occured");
      err.status = 500;
      return next(err);
    }
  }),
];
