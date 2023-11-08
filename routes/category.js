const Category = require("../models/category");
const Instrument = require("../models/instrument");
const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// All routes here are prepended with "/category"
router.get("/create", categoryController.category_create_get);

router.post("/create", categoryController.category_create_post);

router.get("/:categoryName", categoryController.category_products_list);

router.get("/:categoryName/edit", categoryController.category_edit_get);

router.post("/:categoryName/edit", categoryController.category_edit_post);

router.get("/:categoryName/delete", categoryController.category_delete_get);

router.post("/:categoryName/delete", categoryController.category_delete_post);

module.exports = router;
