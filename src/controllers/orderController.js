const Order = require('../models/Order');
const User = require('../models/User');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod } = req.body;

    // Calculate total
    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    const tax = totalPrice * 0.1; // 10% tax
    const deliveryFee = 5; // Fixed delivery fee
    const grandTotal = totalPrice + tax + deliveryFee;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    const order = new Order({
      orderNumber,
      user: req.user.id,
      restaurant,
      items,
      totalPrice: grandTotal,
      deliveryFee,
      tax,
      deliveryAddress,
      paymentMethod
    });

    await order.save();

    // Add order to user
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { orders: order._id } }
    );

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant')
      .populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant')
      .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('restaurant').populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
