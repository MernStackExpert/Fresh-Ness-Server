// routes/product.routes.js
const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// READ
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// CREATE
router.post("/", createProduct);

// UPDATE
router.patch("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;
