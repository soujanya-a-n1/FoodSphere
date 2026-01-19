const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cuisine: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: Number,
    default: 30,
    unit: 'minutes'
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrder: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/default-restaurant.png'
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  menu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
