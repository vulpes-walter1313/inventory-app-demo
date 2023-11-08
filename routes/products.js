const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// All routes here are prepended with "/product"
router.get("/create", productController.product_create_get);

router.post("/create", productController.product_create_post);

router.get("/:productId", productController.product_detail);

router.get("/:productId/edit", productController.product_edit_get);

router.post("/:productId/edit", productController.product_edit_post);

router.get("/:productId/delete", productController.product_delete_get);

router.post("/:productId/delete", productController.product_delete_post);

module.exports = router;
