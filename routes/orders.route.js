const express = require('express');
const { getOrders, createOrders, updateOrder, deleteOrder, getSingleOrder } = require('../controllers/orders.controller');
const verifyAdminOrManager = require('../middleware/verifyAdminOrManager');
const router = express.Router();

router.get('/', getOrders);           
router.get('/:id', getSingleOrder);           
router.post('/', createOrders);       
router.patch('/:id', updateOrder);    
router.delete('/:id', deleteOrder);  

module.exports = router;