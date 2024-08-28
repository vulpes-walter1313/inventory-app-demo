import asyncHandler from "express-async-handler";
import { body, validationResult, matchedData } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";
import HttpError from "../lib/HttpError";
import Category from "../models/Category";
import Products from "../models/Products";

// GET /product/create
export const product_create_get = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await Category.getCategories();
    res.render("product_form", {
      title: "Create A New Product",
      categories: categories,
      errors: undefined,
      selectedCategory: undefined,
    });
  },
);

// POST /product/create
export const product_create_post = [
  body("name").trim().isLength({ max: 140 }).escape(),
  body("description").optional().trim().escape(),
  body("category").isInt().escape(),
  body("price").trim().isFloat({ gt: 0 }),
  body("instock").trim().isInt({ min: 0 }),
  body("slug").trim().isSlug(),
  asyncHandler(async (req: Request, res: Response) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no errors

      const name = String(data.name) || "";
      const description = String(data.description) || "";
      const category_id = parseInt(data.category);
      const price = String(data.price);
      const in_stock = parseInt(data.instock);
      const slug = String(data.slug) || "";

      await Products.createProduct({
        name,
        description,
        category_id,
        price,
        in_stock,
        slug,
      });
      res.redirect(`/product/${data.slug}`);
      return;
    } else {
      // errors in validation
      const categories = await Category.getCategories();

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
      return;
    }
  }),
];

// GET /product/:productSlug
export const product_detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Products.getProductBySlug(req.params.productSlug);
      if (product) {
        res.render("product_detail", {
          title: product.name
            .slice(0, 30)
            .concat("", "... | Music Inventory App"),
          product: product,
        });
      } else {
        const err = new HttpError("Product Not found", 404);
        return next(err);
      }
    } catch {
      const err = new HttpError(`Product: Not found`, 404);
      return next(err);
    }
  },
);

// GET /product/:productSlug/edit
export const product_edit_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [product, categories] = await Promise.all([
      Products.getProductBySlug(req.params.productSlug),
      Category.getCategories(),
    ]);

    if (product === null) {
      const err = new HttpError("Product not found", 404);
      return next(err);
    }

    res.render("product_form", {
      title: `Edit Product: ${product.name}`,
      product: product,
      selectedCategory: product.category_id,
      categories: categories,
      errors: undefined,
      showPassword: true,
    });
  },
);

// POST /product/:productSlug/edit
export const product_edit_post = [
  body("name").trim().isLength({ max: 140 }).escape(),
  body("description").optional().trim().escape(),
  body("category").isInt().escape(),
  body("price").trim().isFloat({ gt: 0 }).escape(),
  body("instock").trim().isInt({ min: 0 }).escape(),
  body("slug").trim().isSlug().escape(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const [product, categories] = await Promise.all([
      Products.getProductBySlug(req.params.productSlug),
      Category.getCategories(),
    ]);

    const errResult = validationResult(req);
    const data = matchedData(req);

    if (product === undefined) {
      const err = new HttpError("Product not found", 404);
      return next(err);
    }

    if (errResult.isEmpty()) {
      // no errors
      if (data.password === process.env.EDIT_PASSWORD) {
        const name = data.name;
        const description = data.description;
        const category_id = parseInt(data.category);
        const price = String(data.price);
        const in_stock = parseInt(data.instock);
        const slug = data.slug;
        await Products.updateProductBySlug(
          { name, description, category_id, price, in_stock, slug },
          req.params.productSlug,
        );
        res.redirect(`/product/${slug}`);
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
          selectedCategory: product.category_id,
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
        selectedCategory: product.category_id,
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
export const product_delete_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Products.getProductBySlug(req.params.productSlug);
    if (product === undefined) {
      const err = new HttpError("Product not found", 404);
      return next(err);
    }

    res.render("product_delete", {
      title: `Delete ${product.name}`,
      product: product,
    });
  },
);

// POST /product/:productSlug/delete
export const product_delete_post = [
  body("productid").trim().isInt().escape(),
  body("password").trim().notEmpty(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errResult = validationResult(req);
    const data = matchedData(req);

    if (errResult.isEmpty()) {
      // no validation errors
      if (data.password === process.env.EDIT_PASSWORD) {
        const productid = parseInt(data.productid);
        await Products.deleteProductById(productid);
        res.redirect("/products");
      } else {
        const productid = parseInt(data.productid);
        const product = await Products.getProductById(productid);
        res.render("product_delete", {
          title: `Delete: ${product.name}`,
          product: product,
          passwordIncorrect: true,
        });
      }
    } else {
      console.log(errResult);
      const err = new HttpError(
        "There was an error in deleting that product",
        500,
      );
      return next(err);
    }
  }),
];
