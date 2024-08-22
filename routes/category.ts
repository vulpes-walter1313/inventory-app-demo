import express from "express";
import * as categoryController from "../controllers/categoryController";
const router = express.Router();

// All routes here are prepended with "/category"
router.get("/create", categoryController.category_create_get);

router.post("/create", categoryController.category_create_post);

router.get("/:categoryName", categoryController.category_products_list);

router.get("/:categoryName/edit", categoryController.category_edit_get);

router.post("/:categoryName/edit", categoryController.category_edit_post);

router.get("/:categoryName/delete", categoryController.category_delete_get);

router.post("/:categoryName/delete", categoryController.category_delete_post);

export default router;
