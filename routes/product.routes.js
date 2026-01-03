const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
} = require("../controllers/product.controller");
const verifyAdminOrManager = require("../middleware/verifyAdminOrManager");

router.get("/" , getAllProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id" , singleProduct)

module.exports = router;
