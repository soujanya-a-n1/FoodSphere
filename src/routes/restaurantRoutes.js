const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');

router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurant);
router.post('/', auth, restaurantController.createRestaurant);
router.put('/:id', auth, restaurantController.updateRestaurant);
router.get('/:id/menu', restaurantController.getMenu);
router.post('/:id/menu', auth, restaurantController.addMenuItem);

module.exports = router;
