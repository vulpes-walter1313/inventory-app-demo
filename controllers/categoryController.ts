import asyncHandler from "express-async-handler";
import { body, validationResult, matchedData } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";
import HttpError from "../lib/HttpError";
import Category from "../models/Category";
import Products from "../models/Products";

// GET /category/create
export const category_create_get = (req: Request, res: Response) => {
  res.render("category_form", { title: "Create Category" });
};

// POST /category/create
export const category_create_post = [
  body("name").trim().notEmpty().isAlpha().isLength({ min: 4 }).escape(),
  body("slug").trim().isSlug().escape().toLowerCase(),
  body("description").optional().notEmpty().trim().escape(),
  asyncHandler(async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // No errors present

      await Category.createCategory(data.name, data.slug, data.description);
      res.redirect(`/category/${data.slug}`);
    } else {
      console.log(errResult);
      res.render("category_form", {
        title: "Create Category",
        errors: errResult,
        category: {
          name: data.name,
          slug: data.slug,
          description: data.description,
        },
      });
    }
  }),
];

// GET /category/:categoryName
export const category_products_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const category = await Category.findOne({
    //   slug: req.params.categoryName,
    // }).exec();
    // const { rows: categories } = await db.query(
    //   "SELECT name, slug, description FROM categories WHERE slug = $1",
    //   [req.params.categoryName],
    // );
    // const category = categories[0];
    const category = await Category.getCategoryBySlug(req.params.categoryName);

    if (category === undefined) {
      const err = new HttpError("Category not found", 404);
      return next(err);
    }
    // const {rows: products} = await Instrument.find({ category: category }).exec();
    // const { rows: products } = await db.query(
    //   "SELECT id, name, description, category_id, price, in_stock, slug FROM instrument WHERE category_id = $1",
    //   [category.id],
    // );
    const products = await Products.getProductsByCategoryId(category.id);
    res.render("products_list", {
      title: `${category.name}`,
      category: category,
      products: products,
    });
  },
);

// GET /category/:categoryName/edit
export const category_edit_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const category = await Category.findOne({
    //   slug: req.params.categoryName,
    // }).exec();
    // const { rows: categories } = await db.query(
    //   "SELECT id, name, slug, description FROM categories WHERE slug = $1",
    //   [req.params.categoryName],
    // );
    // const category = categories[0];
    const category = await Category.getCategoryBySlug(req.params.categoryName);

    if (category === undefined) {
      const err = new HttpError("Category not found", 404);
      return next(err);
    }

    res.render("category_form", {
      title: `Edit: ${category.name} Category`,
      category: category,
      showPassword: true,
    });
  },
);

// POST /category/:categoryName/edit
export const category_edit_post = [
  body("name").trim().notEmpty().isAlpha().isLength({ min: 4 }).escape(),
  body("slug").trim().isSlug().escape().toLowerCase(),
  body("description").optional().notEmpty().trim().escape(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const category = await Category.findOne({
    //   slug: req.params.categoryName,
    // }).exec();
    // const { rows: categories } = await db.query(
    //   "SELECT id, name, slug, description FROM categories WHERE slug = $1",
    //   [req.params.categoryName],
    // );
    // const category = categories[0];
    const category = await Category.getCategoryBySlug(req.params.categoryName);
    if (category === undefined) {
      const err = new HttpError("Category Not Found", 404);
      return next(err);
    }

    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no errors
      if (data.password === process.env.EDIT_PASSWORD) {
        // category.name = data.name;
        // category.slug = data.slug;
        // category.description = data.description;
        // await category.save();
        await Category.updateCategoryById(
          { name: data.name, slug: data.slug, description: data.description },
          category.id,
        );
        res.redirect(`/category/${category.slug}`);
      } else {
        res.status(400).render("category_form", {
          title: `Edit: ${category.name} Category`,
          category: {
            name: data.name,
            description: data.description,
            slug: data.slug,
          },
          showPassword: true,
          passwordIncorrect: true,
        });
      }
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
export const category_delete_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const category = await Category.findOne({ slug: req.params.categoryName });
    const category = await Category.getCategoryBySlug(req.params.categoryName);

    if (category === undefined) {
      const err = new HttpError("Category not found", 404);
      return next(err);
    }
    const products = await Products.getProductsByCategoryId(category.id);
    // const products = await Instrument.find({ category: category });

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
        showPassword: true,
      });
    }
  },
);

// POST /category/:categoryName/delete
export const category_delete_post = [
  body("categoryid").trim().isMongoId(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    // const { rows: categories } = await db.query(
    //   "SELECT * FROM categories WHERE slug = $1",
    //   [req.params.categoryName],
    // );
    // const category = categories[0];
    const category = await Category.getCategoryBySlug(req.params.categoryName);
    if (category === undefined) {
      const err = new HttpError("Category doesn't exist", 500);
      return next(err);
    }
    // const products = await Instrument.find({ category: category });
    if (errResult.isEmpty()) {
      // no errors
      const products = await Products.getProductsByCategoryId(category.id);
      if (products.length > 0) {
        // There are still products under that category
        res.render("category_delete", {
          title: `You can't delete ${category.name}`,
          category: category,
          products: products,
        });
      } else {
        // the category exists but there are not products under it.
        if (data.password === process.env.EDIT_PASSWORD) {
          // password is correct
          // await Category.findByIdAndDelete(data.categoryid).exec();
          await Category.deleteCategoryById(category.id);
          res.redirect("/categories");
        } else {
          // password is incorrect
          res.status(400).render("category_delete", {
            title: `Delete: ${category.name}`,
            category: category,
            products: undefined,
            showPassword: true,
            passwordIncorrect: true,
          });
        }
      }
    } else {
      // errors in validation
      const err = new HttpError("Unknown error occured", 500);
      return next(err);
    }
  }),
];
