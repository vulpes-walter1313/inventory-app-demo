import express from "express";
import * as indexController from "../controllers/indexControllers";
const router = express.Router();

/* GET home page. */
router.get("/", indexController.index_homepage);

router.get("/categories", indexController.categories_list);

router.get("/products", indexController.products_list);

export default router;
