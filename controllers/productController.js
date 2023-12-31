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
      await product.save();
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
exports.product_edit_get = asyncHandler(async (req, res, next) => {
  const [product, categories] = await Promise.all([
    Instrument.findOne({ slug: req.params.productSlug })
      .populate("category")
      .exec(),
    Category.find({}).exec(),
  ]);

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_form", {
    title: `Edit Product: ${product.name}`,
    product: product,
    selectedCategory: product.category.id,
    category: product.category,
    categories: categories,
    errors: undefined,
    showPassword: true,
  });
});

// POST /product/:productSlug/edit
exports.product_edit_post = [
  body("name").trim().isLength({ max: 140 }).escape(),
  body("description").optional().trim().escape(),
  body("category").isMongoId().escape(),
  body("price").trim().isFloat({ gt: 0 }).escape(),
  body("instock").trim().isInt({ min: 0 }).escape(),
  body("slug").trim().isSlug().escape(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req, res, next) => {
    const [product, categories] = await Promise.all([
      Instrument.findOne({ slug: req.params.productSlug })
        .populate("category")
        .exec(),
      Category.find({}).exec(),
    ]);

    const errResult = validationResult(req);
    const data = matchedData(req);

    if (product === null) {
      const err = new Error("Product not found");
      err.status = 404;
      return next(err);
    }

    if (errResult.isEmpty()) {
      // no errors
      if (data.password === process.env.EDIT_PASSWORD) {
        product.name = data.name;
        product.description = data.description;
        product.category = data.category;
        product.price = data.price;
        product.inStock = data.instock;
        product.slug = data.slug;
        await product.save();
        res.redirect(product.url);
      } else {
        res.status(400).render("product_form", {
          title: `Edit Product: ${product.name}`,
          product: {
            name: data.name,
            description: data.description,
            price: data.price,
            inStock: data.instock,
            slug: data.slug,
          },
          selectedCategory: product.category.id,
          category: product.category,
          categories: categories,
          errors: undefined,
          showPassword: true,
          passwordIncorrect: true,
        });
      }
    } else {
      // validation errors
      res.status(500).render("product_form", {
        title: `Edit Product: ${product.name}`,
        selectedCategory: product.category.id,
        product: {
          name: data.name,
          description: data.description,
          price: data.price,
          inStock: data.instock,
          slug: data.slug,
        },
        categories: categories,
        errors: errResult,
      });
    }
  }),
];

// GET /product/:productSlug/delete
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Instrument.findOne({ slug: req.params.productSlug })
    .populate("category")
    .exec();
  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_delete", {
    title: `Delete ${product.name}`,
    product: product,
  });
});

// POST /product/:productSlug/delete
exports.product_delete_post = [
  body("productid").trim().isMongoId().escape(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req, res, next) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no validation errors
      if (data.password === process.env.EDIT_PASSWORD) {
        await Instrument.findByIdAndDelete(data.productid).exec();
        res.redirect("/products");
      } else {
        const product = await Instrument.findById(data.productid)
          .populate("category")
          .exec();
        res.render("product_delete", {
          title: `Delete: ${product.name}`,
          product: product,
          passwordIncorrect: true,
        });
      }
    } else {
      console.log(errResult);
      const err = new Error("There was an error in deleting that product");
      err.status = 500;
      return next(err);
    }
  }),
];
