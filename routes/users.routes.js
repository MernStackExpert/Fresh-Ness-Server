const express = require('express');
const { getAllUsers, createUsers, updateUsers, deleteUser } = require('../controllers/users.controller');
const verifyAdminOrManager = require('../middleware/verifyAdminOrManager');
const router = express.Router();



router.get("/" , getAllUsers)
router.post("/", createUsers);
router.patch("/:id", updateUsers);
router.delete("/:id", verifyAdminOrManager, deleteUser);

module.exports = router;
