const express = require('express');
const { getOrders, createOrders, updateOrder, deleteOrder } = require('../controllers/orders.controller');
const verifyAdminOrManager = require('../middleware/verifyAdminOrManager');
const router = express.Router();

router.get('/', getOrders);           
router.post('/', verifyAdminOrManager, createOrders);       
router.patch('/:id', verifyAdminOrManager, updateOrder);    
router.delete('/:id', verifyAdminOrManager, deleteOrder);  

module.exports = router;