import asyncHandler from "express-async-handler";
import { body, validationResult, matchedData, query } from "express-validator";
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
  body("name").trim().notEmpty().isLength({ min: 4 }).escape(),
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
      console.log(errResult, req.body.name);
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
export const category_products_list = [
  query("limit").optional().isInt(),
  query("page").optional().isInt(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
      const error = new HttpError("Validation error", 400);
      next(error);
      return;
    }
    const data = matchedData(req);
    const category = await Category.getCategoryBySlug(req.params.categoryName);

    if (category === undefined) {
      const err = new HttpError("Category not found", 404);
      return next(err);
    }
    // normalize query params
    let limit = parseInt(data.limit || "9");
    let page = parseInt(data.page || "1");
    if (limit > 20) limit = 20;
    const totalCount = await Products.getCount(category.id);
    const totalPages = Math.ceil(totalCount / limit);
    if (totalPages > 0 && page > totalPages) page = totalPages;
    if (totalPages === 0) page = 1;

    const products = await Products.getProductsByCategoryId({
      categoryId: category.id,
      limit,
      page,
    });
    const totalPagesArr: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      totalPagesArr.push(i);
    }

    res.render("products_list", {
      title: `${category.name}`,
      category: category,
      products: products,
      totalPages: totalPagesArr,
      currentPage: page,
      limit,
    });
  }),
];

// GET /category/:categoryName/edit
export const category_edit_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
        await Category.updateCategoryById(
          { name: data.name, slug: data.slug, description: data.description },
          category.id,
        );
        res.redirect(`/category/${data.slug}`);
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
    const category = await Category.getCategoryBySlug(req.params.categoryName);

    if (category === undefined) {
      const err = new HttpError("Category not found", 404);
      return next(err);
    }
    const products = await Products.getProductsByCategoryId({
      categoryId: category.id,
      limit: 9,
      page: 1,
    });

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
  body("categoryid").trim().isInt(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    const category = await Category.getCategoryBySlug(req.params.categoryName);
    if (category === undefined) {
      const err = new HttpError("Category doesn't exist", 500);
      return next(err);
    }

    if (errResult.isEmpty()) {
      // no errors
      const products = await Products.getProductsByCategoryId({
        categoryId: category.id,
        limit: 2,
        page: 1,
      });
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
