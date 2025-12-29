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
router.post("/", verifyAdminOrManager, createProduct);
router.patch("/:id", verifyAdminOrManager, updateProduct);
router.delete("/:id", verifyAdminOrManager, deleteProduct);
router.get("/:id" , singleProduct)

module.exports = router;
