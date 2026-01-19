const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Restaurant = require('./src/models/Restaurant');
const MenuItem = require('./src/models/MenuItem');

async function initializeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '555-0001',
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '555-0002',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        zipCode: '90001'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        phone: '555-0003',
        address: '789 Pine St',
        city: 'Chicago',
        zipCode: '60601'
      }
    ]);
    console.log('Created sample users');

    // Create 10 restaurants with enhanced details
    const restaurants = await Restaurant.create([
      {
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas made with fresh ingredients and traditional recipes',
        cuisine: 'Italian',
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 5,
        minOrder: 15,
        address: '123 Pizza Street, Little Italy',
        phone: '555-1001',
        email: 'pizzapalace@example.com',
        image: '🍕'
      },
      {
        name: 'Burger Barn',
        description: 'Juicy gourmet burgers and crispy fries made from premium beef',
        cuisine: 'American',
        rating: 4.3,
        deliveryTime: 25,
        deliveryFee: 4,
        minOrder: 12,
        address: '456 Burger Lane, Downtown',
        phone: '555-1002',
        email: 'burgerbarn@example.com',
        image: '🍔'
      },
      {
        name: 'Sushi Supreme',
        description: 'Fresh sushi and sashimi prepared by master chefs daily',
        cuisine: 'Japanese',
        rating: 4.7,
        deliveryTime: 35,
        deliveryFee: 6,
        minOrder: 20,
        address: '789 Sushi Road, Japan Town',
        phone: '555-1003',
        email: 'sushisupreme@example.com',
        image: '🍣'
      },
      {
        name: 'Taco Fiesta',
        description: 'Authentic Mexican street food with bold flavors and fresh ingredients',
        cuisine: 'Mexican',
        rating: 4.4,
        deliveryTime: 20,
        deliveryFee: 3,
        minOrder: 10,
        address: '321 Taco Street, Mexican Quarter',
        phone: '555-1004',
        email: 'tacofiesta@example.com',
        image: '🌮'
      },
      {
        name: 'Dragon Wok',
        description: 'Traditional Chinese cuisine with modern twists and authentic flavors',
        cuisine: 'Chinese',
        rating: 4.6,
        deliveryTime: 28,
        deliveryFee: 5,
        minOrder: 18,
        address: '654 Dragon Avenue, Chinatown',
        phone: '555-1005',
        email: 'dragonwok@example.com',
        image: '🥡'
      },
      {
        name: 'Curry House',
        description: 'Aromatic Indian curries and fresh naan bread from traditional recipes',
        cuisine: 'Indian',
        rating: 4.5,
        deliveryTime: 32,
        deliveryFee: 4,
        minOrder: 16,
        address: '987 Spice Boulevard, Little India',
        phone: '555-1006',
        email: 'curryhouse@example.com',
        image: '🍛'
      },
      {
        name: 'Mediterranean Grill',
        description: 'Fresh Mediterranean cuisine with grilled meats and healthy options',
        cuisine: 'Mediterranean',
        rating: 4.8,
        deliveryTime: 30,
        deliveryFee: 6,
        minOrder: 20,
        address: '147 Olive Street, Mediterranean District',
        phone: '555-1007',
        email: 'medgrill@example.com',
        image: '🥙'
      },
      {
        name: 'Thai Garden',
        description: 'Authentic Thai dishes with perfect balance of sweet, sour, and spicy',
        cuisine: 'Thai',
        rating: 4.6,
        deliveryTime: 26,
        deliveryFee: 5,
        minOrder: 14,
        address: '258 Thai Lane, Asian Quarter',
        phone: '555-1008',
        email: 'thaigarden@example.com',
        image: '🍜'
      },
      {
        name: 'BBQ Smokehouse',
        description: 'Slow-smoked meats and authentic BBQ flavors with homemade sauces',
        cuisine: 'BBQ',
        rating: 4.7,
        deliveryTime: 35,
        deliveryFee: 7,
        minOrder: 22,
        address: '369 Smoke Street, BBQ District',
        phone: '555-1009',
        email: 'bbqsmokehouse@example.com',
        image: '🍖'
      },
      {
        name: 'Sweet Treats Bakery',
        description: 'Artisan desserts, fresh pastries, and premium ice cream made daily',
        cuisine: 'Desserts',
        rating: 4.9,
        deliveryTime: 15,
        deliveryFee: 3,
        minOrder: 8,
        address: '741 Sugar Lane, Sweet District',
        phone: '555-1010',
        email: 'sweettreats@example.com',
        image: '🍰'
      }
    ]);
    console.log('Created 10 restaurants');

    // Create comprehensive menu items for each restaurant
    const menuItems = [];

    // Pizza Palace Menu (Restaurant 0) - 5 items
    const pizzaItems = [
      { name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, basil, and olive oil', price: 14.99, category: 'Pizza', image: '🍕' },
      { name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese and tomato sauce', price: 16.99, category: 'Pizza', image: '🍕' },
      { name: 'Supreme Pizza', description: 'Pepperoni, sausage, bell peppers, onions, mushrooms, olives', price: 19.99, category: 'Pizza', image: '🍕' },
      { name: 'Veggie Deluxe', description: 'Bell peppers, onions, mushrooms, olives, tomatoes, spinach', price: 17.99, category: 'Pizza', image: '🍕' },
      { name: 'Caesar Salad', description: 'Crispy romaine lettuce with homemade Caesar dressing', price: 9.99, category: 'Salads', image: '🥗' }
    ];

    // Burger Barn Menu (Restaurant 1) - 5 items
    const burgerItems = [
      { name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, onion, pickles', price: 12.99, category: 'Burgers', image: '🍔' },
      { name: 'Double Cheeseburger', description: 'Two beef patties with melted cheddar cheese', price: 15.99, category: 'Burgers', image: '🍔' },
      { name: 'BBQ Bacon Burger', description: 'BBQ sauce, crispy bacon, and onion rings', price: 17.99, category: 'Burgers', image: '🍔' },
      { name: 'Chicken Deluxe', description: 'Crispy chicken breast with special sauce and lettuce', price: 13.99, category: 'Burgers', image: '🍔' },
      { name: 'Loaded Fries', description: 'Crispy fries with cheese, bacon, and green onions', price: 8.99, category: 'Sides', image: '�' }
    ];

    // Sushi Supreme Menu (Restaurant 2) - 5 items
    const sushiItems = [
      { name: 'California Roll', description: 'Crab, avocado, cucumber with sesame seeds', price: 9.99, category: 'Rolls', image: '�' },
      { name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo and sriracha', price: 11.99, category: 'Rolls', image: '�' },
      { name: 'Dragon Roll', description: 'Eel, cucumber, avocado with sesame seeds', price: 15.99, category: 'Rolls', image: '🍣' },
      { name: 'Salmon Nigiri', description: 'Fresh salmon over seasoned sushi rice (2 pieces)', price: 7.99, category: 'Nigiri', image: '🍣' },
      { name: 'Miso Soup', description: 'Traditional soybean soup with tofu and seaweed', price: 4.99, category: 'Soups', image: '�' }
    ];

    // Taco Fiesta Menu (Restaurant 3) - 5 items
    const tacoItems = [
      { name: 'Beef Tacos', description: 'Seasoned ground beef with lettuce, cheese, tomatoes (3 tacos)', price: 10.99, category: 'Tacos', image: '🌮' },
      { name: 'Chicken Tacos', description: 'Grilled chicken with cilantro, onions, lime (3 tacos)', price: 11.99, category: 'Tacos', image: '🌮' },
      { name: 'Fish Tacos', description: 'Grilled fish with cabbage slaw and chipotle sauce (3 tacos)', price: 13.99, category: 'Tacos', image: '🌮' },
      { name: 'Chicken Burrito', description: 'Grilled chicken, rice, beans, cheese, salsa', price: 12.99, category: 'Burritos', image: '🌯' },
      { name: 'Guacamole & Chips', description: 'Fresh avocado dip with crispy tortilla chips', price: 7.99, category: 'Appetizers', image: '🥑' }
    ];

    // Dragon Wok Menu (Restaurant 4) - 5 items
    const chineseItems = [
      { name: 'Sweet & Sour Chicken', description: 'Crispy chicken with pineapple and bell peppers', price: 14.99, category: 'Chicken', image: '🥡' },
      { name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts and vegetables', price: 15.99, category: 'Chicken', image: '🥡' },
      { name: 'Beef Lo Mein', description: 'Stir-fried noodles with tender beef and vegetables', price: 13.99, category: 'Noodles', image: '🍜' },
      { name: 'Shrimp Fried Rice', description: 'Wok-fried rice with shrimp, egg, and vegetables', price: 12.99, category: 'Rice', image: '🍚' },
      { name: 'Vegetable Spring Rolls', description: 'Crispy rolls with fresh vegetables (4 pieces)', price: 6.99, category: 'Appetizers', image: '🥢' }
    ];

    // Curry House Menu (Restaurant 5) - 5 items
    const indianItems = [
      { name: 'Chicken Tikka Masala', description: 'Creamy tomato curry with tender chicken pieces', price: 16.99, category: 'Curry', image: '🍛' },
      { name: 'Lamb Biryani', description: 'Fragrant basmati rice with spiced lamb', price: 18.99, category: 'Rice', image: '🍛' },
      { name: 'Butter Chicken', description: 'Rich and creamy chicken curry with spices', price: 17.99, category: 'Curry', image: '🍛' },
      { name: 'Garlic Naan', description: 'Fresh baked bread with garlic and herbs', price: 4.99, category: 'Bread', image: '🫓' },
      { name: 'Samosas', description: 'Crispy pastries with spiced potato filling (4 pieces)', price: 7.99, category: 'Appetizers', image: '🥟' }
    ];

    // Mediterranean Grill Menu (Restaurant 6) - 5 items
    const medItems = [
      { name: 'Chicken Shawarma', description: 'Marinated chicken with tahini sauce in pita', price: 13.99, category: 'Wraps', image: '�' },
      { name: 'Lamb Kebab Platter', description: 'Grilled lamb skewers with rice and vegetables', price: 19.99, category: 'Kebabs', image: '🍢' },
      { name: 'Falafel Wrap', description: 'Crispy chickpea balls with hummus and vegetables', price: 11.99, category: 'Wraps', image: '🥙' },
      { name: 'Greek Salad', description: 'Tomatoes, olives, feta cheese, cucumber, onions', price: 10.99, category: 'Salads', image: '🥗' },
      { name: 'Hummus Platter', description: 'Creamy chickpea dip with warm pita bread', price: 8.99, category: 'Appetizers', image: '�' }
    ];

    // Thai Garden Menu (Restaurant 7) - 5 items
    const thaiItems = [
      { name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, tofu, and peanuts', price: 13.99, category: 'Noodles', image: '🍜' },
      { name: 'Green Curry Chicken', description: 'Spicy coconut curry with Thai basil', price: 15.99, category: 'Curry', image: '🍛' },
      { name: 'Tom Yum Soup', description: 'Spicy and sour soup with shrimp and mushrooms', price: 8.99, category: 'Soups', image: '🍜' },
      { name: 'Thai Fried Rice', description: 'Jasmine rice with egg, vegetables, and choice of protein', price: 11.99, category: 'Rice', image: '�' },
      { name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango slices', price: 7.99, category: 'Desserts', image: '🥭' }
    ];

    // BBQ Smokehouse Menu (Restaurant 8) - 5 items
    const bbqItems = [
      { name: 'Pulled Pork Sandwich', description: 'Slow-smoked pork with BBQ sauce on brioche bun', price: 14.99, category: 'Sandwiches', image: '�' },
      { name: 'Beef Brisket Platter', description: 'Tender smoked brisket with two sides', price: 22.99, category: 'Platters', image: '�' },
      { name: 'BBQ Ribs Half Rack', description: 'Fall-off-the-bone ribs with signature sauce', price: 18.99, category: 'Ribs', image: '🍖' },
      { name: 'Smoked Chicken', description: 'Half chicken smoked to perfection', price: 16.99, category: 'Chicken', image: '�' },
      { name: 'Mac & Cheese', description: 'Creamy macaroni and cheese with breadcrumb topping', price: 7.99, category: 'Sides', image: '🧀' }
    ];

    // Sweet Treats Bakery Menu (Restaurant 9) - 10 items
    const dessertItems = [
      { name: 'Chocolate Fudge Cake', description: 'Rich chocolate cake with fudge frosting', price: 8.99, category: 'Cakes', image: '�' },
      { name: 'New York Cheesecake', description: 'Classic cheesecake with graham cracker crust', price: 7.99, category: 'Cakes', image: '�' },
      { name: 'Apple Pie', description: 'Traditional apple pie with cinnamon and flaky crust', price: 6.99, category: 'Pies', image: '🥧' },
      { name: 'Vanilla Ice Cream', description: 'Premium vanilla ice cream (3 scoops)', price: 5.99, category: 'Ice Cream', image: '🍦' },
      { name: 'Chocolate Chip Cookies', description: 'Fresh baked cookies with chocolate chips (6 pieces)', price: 4.99, category: 'Cookies', image: '🍪' },
      { name: 'Strawberry Shortcake', description: 'Fluffy cake with fresh strawberries and cream', price: 8.99, category: 'Cakes', image: '🍰' },
      { name: 'Cinnamon Rolls', description: 'Warm cinnamon rolls with cream cheese glaze (3 pieces)', price: 7.99, category: 'Pastries', image: '🥐' },
      { name: 'Hot Chocolate', description: 'Rich hot chocolate with whipped cream and marshmallows', price: 4.99, category: 'Drinks', image: '☕' },
      { name: 'Blueberry Muffins', description: 'Fresh baked muffins with wild blueberries (4 pieces)', price: 6.99, category: 'Pastries', image: '🧁' },
      { name: 'Red Velvet Cake', description: 'Classic red velvet cake with cream cheese frosting', price: 9.99, category: 'Cakes', image: '🍰' }
    ];

    // Combine all menu items with restaurant references
    const allMenus = [pizzaItems, burgerItems, sushiItems, tacoItems, chineseItems, indianItems, medItems, thaiItems, bbqItems, dessertItems];
    
    for (let i = 0; i < restaurants.length; i++) {
      const restaurantMenuItems = allMenus[i].map(item => ({
        ...item,
        restaurant: restaurants[i]._id
      }));
      menuItems.push(...restaurantMenuItems);
    }

    // Create all menu items
    const createdMenuItems = await MenuItem.create(menuItems);
    console.log(`Created ${createdMenuItems.length} menu items`);

    // Update restaurants with their menu items
    for (let i = 0; i < restaurants.length; i++) {
      const restaurantMenuItems = createdMenuItems.filter(item => 
        item.restaurant.toString() === restaurants[i]._id.toString()
      );
      await Restaurant.findByIdAndUpdate(
        restaurants[i]._id,
        { menu: restaurantMenuItems.map(item => item._id) }
      );
    }
    console.log('Updated all restaurants with their menu items');

    console.log('Database initialization completed successfully!');
    console.log(`Created ${restaurants.length} restaurants with ${createdMenuItems.length} total menu items`);
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
}

initializeData();
