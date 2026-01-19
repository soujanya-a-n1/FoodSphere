# FoodEasy - Food Delivery Application

A full-stack food delivery application built with Node.js, Express, MongoDB, HTML, CSS, and JavaScript.

## Features

- **User Authentication**: Register, login, and user profile management
- **Restaurant Browsing**: View all restaurants with ratings and delivery info
- **Menu Management**: Browse and explore restaurant menus with items and prices
- **Shopping Cart**: Add items to cart with quantity management
- **Order Management**: Place orders, track status, and view order history
- **Real-time Updates**: Order status tracking with delivery updates
- **Responsive Design**: Mobile-friendly interface for all devices

## Project Structure

```
Food Delivery/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styling for the app
│   └── js/
│       └── app.js          # Frontend JavaScript
├── src/
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── Restaurant.js   # Restaurant schema
│   │   ├── MenuItem.js     # Menu item schema
│   │   └── Order.js        # Order schema
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── restaurantController.js # Restaurant operations
│   │   └── orderController.js      # Order operations
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── restaurantRoutes.js # Restaurant endpoints
│   │   └── orderRoutes.js      # Order endpoints
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   └── app.js              # Express app configuration
├── server.js               # Server entry point
├── package.json            # Dependencies
└── .env                    # Environment variables
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Edit `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/food-delivery
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your machine or update the MONGODB_URI in .env

4. **Run the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:5000`

## Available Scripts

```bash
# Start the server
npm start

# Development mode with nodemon (if installed)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get single restaurant
- `POST /api/restaurants` - Create restaurant (protected)
- `PUT /api/restaurants/:id` - Update restaurant (protected)
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/menu` - Add menu item (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/status` - Update order status (protected)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)

## Usage

### User Registration
1. Click "Register" on the login page
2. Fill in your details (name, email, password, phone)
3. Click "Register" button
4. You'll be logged in automatically

### Browsing Restaurants
1. Once logged in, click "Restaurants" in navigation
2. View all available restaurants with ratings and delivery info
3. Click "View Menu" on any restaurant to see their items

### Placing an Order
1. Select a restaurant and view their menu
2. Click on menu items to add them to cart
3. Adjust quantities as needed
4. Click "Proceed to Checkout"
5. Enter delivery address and select payment method
6. Click "Place Order" to complete

### Tracking Orders
1. Click "Orders" in the navigation menu
2. View all your orders with current status
3. Click on any order to see detailed information

## Status Types

- **pending**: Order received, waiting for confirmation
- **confirmed**: Restaurant confirmed the order
- **preparing**: Restaurant is preparing your food
- **ready**: Order is ready for delivery
- **out_for_delivery**: Delivery driver is on the way
- **delivered**: Order successfully delivered
- **cancelled**: Order was cancelled

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcryptjs (password hashing)
- CORS

## Demo Restaurants

The app comes with sample restaurants:
1. **Pizza Palace** - Italian cuisine
2. **Burger Barn** - American cuisine
3. **Sushi Supreme** - Japanese cuisine

## Notes

- This is a demo application with sample data
- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Tax is automatically calculated at 10%
- Delivery fee is set at $5 by default
- The app uses localStorage to persist authentication tokens

## Future Enhancements

- Email notifications for order updates
- Payment gateway integration (Stripe, PayPal)
- Real-time order tracking with Google Maps
- Restaurant admin dashboard
- Customer reviews and ratings
- Promo codes and discounts
- Multiple delivery addresses
- Order scheduling for future dates
- Social login (Google, Facebook)
- Push notifications

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file

### Port Already in Use
- Change PORT in .env file to another port (e.g., 5001)

### CORS Error
- Ensure CORS middleware is enabled in server
- Check that frontend is accessing correct API_BASE_URL

## Support

For issues or questions, check the code comments or contact the development team.

## License

This project is open source and available under the MIT License.
