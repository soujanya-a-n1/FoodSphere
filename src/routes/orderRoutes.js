const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOrder);
router.put('/:id/status', auth, orderController.updateOrderStatus);
router.put('/:id/cancel', auth, orderController.cancelOrder);

module.exports = router;
