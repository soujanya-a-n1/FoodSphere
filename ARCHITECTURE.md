# FoodEasy - Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    FOOD DELIVERY APP ARCHITECTURE               │
└─────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════╗
║                         CLIENT LAYER (Browser)                  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │                   HTML/CSS/JavaScript                     │  ║
║  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  ║
║  │  │   index.html   │   style.css   │   app.js    │         │  ║
║  │  └────────────┘  └────────────┘  └────────────┘         │  ║
║  │                                                            │  ║
║  │  • Responsive UI                                         │  ║
║  │  • User Authentication                                  │  ║
║  │  • Restaurant Browsing                                 │  ║
║  │  • Shopping Cart                                        │  ║
║  │  • Order Management                                    │  ║
║  │  • Order Tracking                                      │  ║
║  │                                                         │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║                        HTTP/REST API                            ║
║                    (JSON requests/responses)                    ║
║                                                                  ║
╚════════════════════════════════════════════════════════════════╝

                              ↕↕↕ API Calls ↕↕↕

╔════════════════════════════════════════════════════════════════╗
║                       SERVER LAYER (Node.js)                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │                    Express.js Server                      │  ║
║  │                    (Port 5000)                            │  ║
║  │                                                           │  ║
║  │  Middleware:                                             │  ║
║  │  • CORS Handler                                          │  ║
║  │  • JSON Parser                                           │  ║
║  │  • Authentication (JWT)                                 │  ║
║  │  • Error Handler                                         │  ║
║  │                                                           │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          ║
║  │    Routes    │  │ Controllers  │  │  Middleware  │          ║
║  ├──────────────┤  ├──────────────┤  ├──────────────┤          ║
║  │ Auth Routes  │  │    Auth      │  │     JWT      │          ║
║  │ Restaurant   │  │ Restaurant   │  │             │          ║
║  │ Order Routes │  │ Order Logic  │  │             │          ║
║  └──────────────┘  └──────────────┘  └──────────────┘          ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │                     Data Models (Mongoose)               │  ║
║  │  ┌──────────┐  ┌────────────┐  ┌────────┐  ┌───────┐   │  ║
║  │  │  User    │  │ Restaurant │  │ MenuItem│  │ Order │   │  ║
║  │  ├──────────┤  ├────────────┤  ├────────┤  ├───────┤   │  ║
║  │  │ name     │  │ name       │  │ name   │  │ items │   │  ║
║  │  │ email    │  │ cuisine    │  │ price  │  │ total │   │  ║
║  │  │ password │  │ rating     │  │ menu   │  │ status│   │  ║
║  │  │ phone    │  │ address    │  │ avail  │  │ user  │   │  ║
║  │  │ orders   │  │ phone      │  │        │  │ rest  │   │  ║
║  │  └──────────┘  └────────────┘  └────────┘  └───────┘   │  ║
║  │                                                            │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                  ║
╚════════════════════════════════════════════════════════════════╝

                         ↕↕↕ Database Queries ↕↕↕

╔════════════════════════════════════════════════════════════════╗
║                    DATABASE LAYER (MongoDB)                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │               MongoDB Collections                         │  ║
║  │                                                           │  ║
║  │  📊 users          (Authentication & profiles)           │  ║
║  │  📊 restaurants    (Restaurant information)              │  ║
║  │  📊 menuitems     (Menu items with prices)              │  ║
║  │  📊 orders        (Order tracking & history)             │  ║
║  │                                                           │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                  ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ USER REGISTRATION / LOGIN FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Browser: User enters email/password                          │
│          ↓                                                    │
│ Frontend: Sends POST request to /api/auth/login             │
│          ↓                                                    │
│ Server: Receives request                                    │
│       ├─→ Validates email format                            │
│       ├─→ Finds user in database                            │
│       ├─→ Compares password (bcryptjs)                      │
│       └─→ Generates JWT token                               │
│          ↓                                                    │
│ Response: Sends token to frontend                           │
│          ↓                                                    │
│ Frontend: Stores token in localStorage                      │
│          ├─→ Updates UI with user info                      │
│          └─→ Sets Authorization header for future requests  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│ ORDER PLACEMENT FLOW                                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ 1. User selects restaurant                                  │
│    ↓                                                         │
│ 2. User browses menu items                                  │
│    ↓                                                         │
│ 3. User adds items to cart                                  │
│    ↓                                                         │
│ 4. User proceeds to checkout                                │
│    ├─→ Enters delivery address                              │
│    ├─→ Selects payment method                               │
│    └─→ Reviews order total                                  │
│    ↓                                                         │
│ 5. Frontend sends POST /api/orders                          │
│    ├─→ Authentication: Uses JWT token                       │
│    ├─→ Payload: Restaurant, items, address, payment        │
│    ↓                                                         │
│ 6. Server processes order                                   │
│    ├─→ Validates user (via JWT)                             │
│    ├─→ Validates restaurant & items                         │
│    ├─→ Calculates total (items + tax + fee)                │
│    ├─→ Creates order in database                            │
│    ├─→ Links order to user                                  │
│    └─→ Returns order confirmation                           │
│    ↓                                                         │
│ 7. User sees order confirmation                             │
│    ├─→ Order number displayed                               │
│    ├─→ Estimated delivery time shown                        │
│    └─→ Can track order status                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## API Request/Response Example

### Create Order Request
```json
POST /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "restaurant": "507f1f77bcf86cd799439011",
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "paymentMethod": "card"
}
```

### Create Order Response
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-1705330200000",
    "user": "507f1f77bcf86cd799439010",
    "restaurant": "507f1f77bcf86cd799439011",
    "items": [
      {
        "menuItem": "507f1f77bcf86cd799439012",
        "quantity": 2,
        "price": 12.99,
        "_id": "507f1f77bcf86cd799439014"
      }
    ],
    "totalPrice": 33.48,
    "tax": 2.60,
    "deliveryFee": 5.00,
    "status": "pending",
    "deliveryAddress": "123 Main St, New York, NY 10001",
    "paymentMethod": "card",
    "estimatedDeliveryTime": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Security Features

```
Authentication & Authorization:
├─ JWT Tokens (Signed tokens for stateless auth)
├─ Token Expiration (7 days)
├─ Authorization Header (Bearer token in requests)
└─ Protected Routes (Only authenticated users can access)

Password Security:
├─ Bcryptjs Hashing (One-way encryption)
├─ Salt Rounds (10 iterations for security)
├─ Comparison Function (Secure password matching)
└─ Never Stored in Plain Text

CORS:
├─ Enabled for cross-origin requests
├─ Prevents unauthorized domain access
└─ Configurable for specific origins

Database:
├─ Mongoose Schema Validation
├─ Input Sanitization
└─ MongoDB Atlas Encryption (optional)
```

---

## File Sizes & Complexity

```
Frontend:
  index.html    - 600+ lines (structure & forms)
  style.css     - 650+ lines (responsive design)
  app.js        - 650+ lines (logic & API calls)

Backend:
  server.js          - 8 lines (entry point)
  src/app.js         - 39 lines (Express config)
  
  Models:
    User.js          - 65 lines (schema + methods)
    Restaurant.js    - 45 lines (schema)
    MenuItem.js      - 40 lines (schema)
    Order.js         - 65 lines (complex schema)
  
  Controllers:
    authController.js         - 90 lines (5 functions)
    restaurantController.js   - 100 lines (6 functions)
    orderController.js        - 130 lines (5 functions)
  
  Routes:
    authRoutes.js       - 10 lines
    restaurantRoutes.js - 11 lines
    orderRoutes.js      - 10 lines
  
  Middleware:
    auth.js            - 20 lines (JWT validation)

Total Production Code: ~1,800 lines
Total Project Files: 23 (including docs)
Total Size: ~500KB (excluding node_modules)
```

---

## Technology Versions

```
Node.js:        v14+ (recommended v18 or higher)
Express.js:     v5.2.1
MongoDB:        v4+ (Community or Atlas)
Mongoose:       v9.1.3
JWT:            v9.0.3
Bcryptjs:       v3.0.3
CORS:           v2.8.5
Dotenv:         v17.2.3
```

---

## Performance Considerations

```
Frontend:
├─ Vanilla JavaScript (No framework overhead)
├─ CSS optimizations (Minimal HTTP requests)
├─ Responsive images (Mobile optimization)
└─ LocalStorage for tokens (Reduces server requests)

Backend:
├─ Mongoose indexing on frequently queried fields
├─ CORS preflight caching
├─ Efficient database queries
└─ Error handling & logging

Database:
├─ MongoDB indexes on email (unique), user ID
├─ Connection pooling
├─ Data normalization
└─ Query optimization
```

---

## Deployment Ready Features

```
Environment Configuration:
├─ .env file for sensitive data
├─ Different configs per environment
└─ No hardcoded credentials

Error Handling:
├─ Try-catch blocks
├─ Proper HTTP status codes
└─ Descriptive error messages

Logging:
├─ Console logs for debugging
├─ Error tracking
└─ Request logging (can be added)

Scalability:
├─ Stateless API (JWT based)
├─ Database connection pooling
├─ Ready for containerization
└─ Ready for load balancing
```

---

## Next Level Improvements

```
Immediate (Low effort):
├─ Email notifications
├─ User reviews
├─ Restaurant ratings
└─ Search filtering

Medium (Medium effort):
├─ Payment gateway (Stripe)
├─ Real-time updates (Socket.io)
├─ Email service (Nodemailer)
└─ Admin dashboard

Advanced (High effort):
├─ Microservices architecture
├─ Message queue (Redis)
├─ Docker & Kubernetes
├─ CI/CD pipeline
└─ Analytics system
```

This architecture is:
✅ Scalable
✅ Maintainable
✅ Secure
✅ Production-ready
✅ Easy to extend
