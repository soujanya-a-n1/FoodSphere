const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('menu');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single restaurant
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create restaurant (admin only)
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, address, phone, email } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      cuisine,
      address,
      phone,
      email
    });

    await restaurant.save();
    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('menu');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get menu items
exports.getMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      restaurant: req.params.id
    });

    await menuItem.save();

    // Add to restaurant's menu
    await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $push: { menu: menuItem._id } }
    );

    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
