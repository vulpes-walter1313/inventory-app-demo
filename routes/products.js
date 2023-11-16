const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// All routes here are prepended with "/product"
router.get("/create", productController.product_create_get);

router.post("/create", productController.product_create_post);

router.get("/:productSlug", productController.product_detail);

router.get("/:productSlug/edit", productController.product_edit_get);

router.post("/:productSlug/edit", productController.product_edit_post);

router.get("/:productSlug/delete", productController.product_delete_get);

router.post("/:productSlug/delete", productController.product_delete_post);

module.exports = router;
