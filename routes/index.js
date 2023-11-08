const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexControllers");

/* GET home page. */
router.get("/", indexController.index_homepage);

router.get("/categories", indexController.categories_list);

router.get("/products", indexController.products_list);

module.exports = router;
