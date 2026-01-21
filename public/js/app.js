const API_BASE_URL = 'http://localhost:5000/api';

// State management
let state = {
    currentUser: null,
    restaurants: [],
    cart: [],
    orders: [],
    currentRestaurant: null,
    token: localStorage.getItem('token') || null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (state.token) {
        updateAuthUI();
        setupEventListeners();
        loadRestaurants();
        updateCartCount();
        showHome();
    } else {
        // Force registration first - users must register before seeing food
        setupEventListeners();
        showRegister(); // Show registration page first
    }
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    
    // Checkout form
    document.getElementById('checkoutForm')?.addEventListener('submit', handleCheckout);
}

// ==================== AUTHENTICATION ====================

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            state.token = data.token;
            state.currentUser = data.user;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            showHome();
            showNotification(`Welcome back, ${data.user.name}! You can now browse restaurants and order food.`);
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Error during login: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    const phone = formData.get('phone') || e.target.querySelector('input[type="tel"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });

        const data = await response.json();
        if (response.ok) {
            state.token = data.token;
            state.currentUser = data.user;
            localStorage.setItem('token', data.token);
            updateAuthUI();
            showHome();
            showNotification(`Welcome to FoodEasy, ${data.user.name}! Registration successful. You can now browse restaurants and order delicious food.`);
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('[ERROR] Server error:', error);
        showNotification('Error during registration: ' + error.message, 'error');
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    if (state.token && state.currentUser) {
        authBtn.textContent = `${state.currentUser.name} (Logout)`;
        authBtn.onclick = logout;
        // Show navigation when authenticated
        updateNavVisibility(true);
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = showLogin;
        // Hide navigation when not authenticated
        updateNavVisibility(false);
    }
}

function updateNavVisibility(isAuthenticated) {
    const navLinks = document.querySelectorAll('.nav-link:not(.login-btn)');
    navLinks.forEach(link => {
        if (isAuthenticated) {
            link.style.display = 'block';
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
        } else {
            link.style.display = 'none';
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
        }
    });
}

function logout() {
    state.token = null;
    state.currentUser = null;
    state.cart = [];
    localStorage.removeItem('token');
    localStorage.removeItem('pendingCart'); // Clear any pending cart
    updateAuthUI();
    updateCartCount();
    showRegister(); // Redirect to registration page
    showNotification('Logged out successfully. Please register or login to continue using FoodEasy.');
}

// ==================== RESTAURANTS ====================

async function loadRestaurants() {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants`);
        if (response.ok) {
            state.restaurants = await response.json();
            console.log('Loaded restaurants from API:', state.restaurants);
        } else {
            throw new Error('Failed to fetch restaurants');
        }
        
        // If no restaurants from API, use sample data
        if (state.restaurants.length === 0) {
            state.restaurants = getSampleRestaurants();
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        // Use sample data on error
        state.restaurants = getSampleRestaurants();
    }
}

function getSampleRestaurants() {
    return [
        {
            _id: 'sample1',
            name: 'Pizza Palace',
            cuisine: 'Italian',
            rating: 4.5,
            deliveryTime: 30,
            deliveryFee: 5,
            address: '123 Main St',
            phone: '555-0001',
            image: '�',
            description: 'Authentic Italian pizzas with fresh ingredients'
        },
        {
            _id: 'sample2',
            name: 'Burger Barn',
            cuisine: 'American',
            rating: 4.3,
            deliveryTime: 25,
            deliveryFee: 4,
            address: '456 Oak Ave',
            phone: '555-0002',
            image: '�',
            description: 'Juicy burgers and crispy fries'
        },
        {
            _id: 'sample3',
            name: 'Sushi Supreme',
            cuisine: 'Japanese',
            rating: 4.7,
            deliveryTime: 35,
            deliveryFee: 6,
            address: '789 Elm St',
            phone: '555-0003',
            image: '�',
            description: 'Fresh sushi and sashimi daily'
        }
    ];
}

async function searchRestaurants() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!state.token) {
        showNotification('Please register first to search restaurants and food items', 'warning');
        showRegister();
        return;
    }
    
    // Filter restaurants based on search query
    if (query) {
        const filteredRestaurants = state.restaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(query) ||
            restaurant.cuisine.toLowerCase().includes(query) ||
            (restaurant.description && restaurant.description.toLowerCase().includes(query))
        );
        
        // Temporarily store filtered results
        const originalRestaurants = [...state.restaurants];
        state.restaurants = filteredRestaurants;
        
        showRestaurants();
        
        // Show search results message
        if (filteredRestaurants.length === 0) {
            showNotification(`No restaurants found for "${query}". Showing all restaurants.`, 'info');
            state.restaurants = originalRestaurants;
            displayRestaurants();
        } else {
            showNotification(`Found ${filteredRestaurants.length} restaurant(s) for "${query}"`, 'success');
        }
        
        // Restore original restaurants after 10 seconds or when user clears search
        setTimeout(() => {
            if (document.getElementById('searchInput').value === '') {
                state.restaurants = originalRestaurants;
                displayRestaurants();
            }
        }, 10000);
    } else {
        // Show all restaurants if search is empty
        showRestaurants();
    }
}

// Add function to clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadRestaurants().then(() => {
        displayRestaurants();
        showNotification('Search cleared. Showing all restaurants.', 'info');
    });
}

// Handle Enter key press in search
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchRestaurants();
    }
}

function displayRestaurants() {
    const restaurantsList = document.getElementById('restaurantsList');
    restaurantsList.innerHTML = state.restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="openRestaurantMenu('${restaurant._id}')">
            <div class="restaurant-image">${getRestaurantImage(restaurant)}</div>
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <p class="restaurant-description">${restaurant.description || 'Delicious food awaits!'}</p>
                <div class="restaurant-details">
                    <span class="restaurant-rating">⭐ ${restaurant.rating || 4.0}</span>
                    <span>⏱️ ${restaurant.deliveryTime || 30}min</span>
                    <span>💰 $${restaurant.deliveryFee || 5} fee</span>
                </div>
                <div class="restaurant-meta">
                    <span>📍 ${restaurant.address || 'Address not available'}</span>
                    <span>📞 ${restaurant.phone || 'Phone not available'}</span>
                </div>
                <button class="view-menu-btn">View Menu</button>
            </div>
        </div>
    `).join('');
}

function getRestaurantImage(restaurant) {
    // If restaurant has an image field and it's an emoji, use it
    if (restaurant.image && restaurant.image.length <= 4) {
        return `<span class="emoji-image">${restaurant.image}</span>`;
    }
    
    // Map cuisine to emoji with fallback
    const cuisineEmojis = {
        'Italian': '🍕',
        'American': '🍔', 
        'Japanese': '🍣',
        'Mexican': '🌮',
        'Chinese': '🥡',
        'Indian': '🍛',
        'Mediterranean': '🥙',
        'Thai': '🍜',
        'BBQ': '🍖',
        'Desserts': '🍰',
        'Pizza': '🍕',
        'Burger': '🍔',
        'Sushi': '🍣',
        'Taco': '🌮'
    };
    
    const emoji = cuisineEmojis[restaurant.cuisine] || '🏪';
    return `<span class="emoji-image">${emoji}</span>`;
}

function getMenuItemImage(item) {
    // If item has an image field, use it
    if (item.image) {
        return `<span class="emoji-image">${item.image}</span>`;
    }
    
    // Map category to emoji
    const categoryEmojis = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Rolls': '🍣',
        'Nigiri': '🍣',
        'Tacos': '🌮',
        'Burritos': '🌯',
        'Chicken': '🍗',
        'Noodles': '🍜',
        'Rice': '🍚',
        'Curry': '🍛',
        'Bread': '🫓',
        'Wraps': '🥙',
        'Kebabs': '🍢',
        'Salads': '🥗',
        'Sides': '🍟',
        'Soups': '🍲',
        'Appetizers': '🥟',
        'Desserts': '🍰'
    };
    
    const emoji = categoryEmojis[item.category] || '🍽️';
    return `<span class="emoji-image">${emoji}</span>`;
}

async function openRestaurantMenu(restaurantId) {
    if (!state.token) {
        showNotification('Please register first to view restaurant menus and food items', 'warning');
        showRegister();
        return;
    }
    
    state.currentRestaurant = state.restaurants.find(r => r._id === restaurantId);
    
    try {
        // Try to get restaurant details from API
        const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`);
        if (response.ok) {
            const restaurant = await response.json();
            state.currentRestaurant = restaurant;
            console.log('Loaded restaurant from API:', restaurant);
        } else {
            console.log('Restaurant not found in API, using local data');
        }
    } catch (error) {
        console.error('Error loading restaurant:', error);
    }
    
    // If no menu from API, use sample menu based on restaurant
    if (!state.currentRestaurant.menu || state.currentRestaurant.menu.length === 0) {
        state.currentRestaurant.menu = getSampleMenuForRestaurant(restaurantId);
    }
    
    displayMenu();
    showMenu();
}

function getSampleMenuForRestaurant(restaurantId) {
    // Create restaurant-specific menus for sample data
    const sampleMenus = {
        'sample1': [ // Pizza Palace
            { _id: 'item1', name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, and tomato sauce', price: 12.99, category: 'Pizza', image: '�' },
            { _id: 'item2', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 14.99, category: 'Pizza', image: '�' },
            { _id: 'item3', name: 'Supreme Pizza', description: 'Pepperoni, sausage, peppers, onions, mushrooms', price: 17.99, category: 'Pizza', image: '�' },
            { _id: 'item4', name: 'Caesar Salad', description: 'Crispy romaine lettuce with parmesan', price: 8.99, category: 'Salads', image: '🥗' }
        ],
        'sample2': [ // Burger Barn
            { _id: 'item5', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, onion, pickles', price: 11.99, category: 'Burgers', image: '🍔' },
            { _id: 'item6', name: 'Cheeseburger', description: 'Classic burger with melted cheese', price: 12.99, category: 'Burgers', image: '�' },
            { _id: 'item7', name: 'BBQ Bacon Burger', description: 'BBQ sauce, bacon, onion rings', price: 15.99, category: 'Burgers', image: '�' },
            { _id: 'item8', name: 'Crispy Fries', description: 'Golden crispy french fries', price: 4.99, category: 'Sides', image: '�' }
        ],
        'sample3': [ // Sushi Supreme
            { _id: 'item9', name: 'California Roll', description: 'Crab, avocado, cucumber', price: 8.99, category: 'Rolls', image: '🍣' },
            { _id: 'item10', name: 'Salmon Nigiri', description: 'Fresh salmon over seasoned rice', price: 6.99, category: 'Nigiri', image: '�' },
            { _id: 'item11', name: 'Dragon Roll', description: 'Eel, cucumber, avocado on top', price: 14.99, category: 'Rolls', image: '🍣' },
            { _id: 'item12', name: 'Miso Soup', description: 'Traditional soybean soup', price: 3.99, category: 'Soup', image: '�' }
        ]
    };
    
    return sampleMenus[restaurantId] || [
        { _id: 'default1', name: 'Special Dish', description: 'Chef\'s special of the day', price: 12.99, category: 'Specials', image: '�️' }
    ];
}

function displayMenu() {
    const restaurantDetail = document.getElementById('restaurantDetail');
    restaurantDetail.innerHTML = `
        <div>
            <h2>${state.currentRestaurant.name}</h2>
            <p>${state.currentRestaurant.address}</p>
            <p>Phone: ${state.currentRestaurant.phone}</p>
            <p>Rating: ⭐ ${state.currentRestaurant.rating || 4.0} | Delivery: ${state.currentRestaurant.deliveryTime}min | Fee: $${state.currentRestaurant.deliveryFee}</p>
        </div>
    `;

    const menuItemsList = document.getElementById('menuItemsList');
    menuItemsList.innerHTML = (state.currentRestaurant.menu || []).map(item => `
        <div class="menu-item">
            <div class="menu-item-image">${getMenuItemImage(item)}</div>
            <h3>${item.name}</h3>
            <p class="menu-item-description">${item.description || 'Delicious item'}</p>
            <p class="menu-item-category">${item.category || 'Food'}</p>
            <p class="menu-item-price">$${item.price.toFixed(2)}</p>
            <div class="item-quantity">
                <button class="qty-btn" onclick="decreaseQty('${item._id}')">-</button>
                <input type="number" class="qty-input" id="qty-${item._id}" value="1" min="1">
                <button class="qty-btn" onclick="increaseQty('${item._id}')">+</button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${item._id}', '${item.name}', ${item.price})">Add to Cart</button>
        </div>
    `).join('');
}

// ==================== CART ====================

function addToCart(itemId, itemName, itemPrice) {
    if (!state.token) {
        showNotification('Please register first to add items to your cart', 'warning');
        showRegister();
        return;
    }

    const quantity = parseInt(document.getElementById(`qty-${itemId}`).value) || 1;
    
    const existingItem = state.cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            restaurant: state.currentRestaurant._id
        });
    }

    updateCartCount();
    showNotification(`${itemName} added to cart!`);
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCartCount();
    displayCart();
}

function increaseQty(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function updateCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px;">Your cart is empty</p>';
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }

    document.querySelector('.cart-summary').style.display = 'block';

    cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const deliveryFee = state.cart.length > 0 ? 5 : 0;
    const total = subtotal + tax + deliveryFee;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if (state.cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    if (!state.token) {
        showNotification('Please register first to checkout', 'warning');
        showRegister();
        return;
    }

    // Display checkout summary
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const deliveryFee = 5;
    const total = subtotal + tax + deliveryFee;

    document.getElementById('checkoutSummary').innerHTML = `
        ${state.cart.map(item => `
            <div class="order-summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div style="border-top: 1px solid #ddd; margin: 15px 0; padding-top: 15px;">
            <div class="order-summary-item">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="order-summary-item">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="order-summary-item">
                <span>Delivery Fee:</span>
                <span>$${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="order-summary-item" style="font-weight: bold; font-size: 16px;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;

    showCheckout();
}

async function handleCheckout(e) {
    e.preventDefault();
    
    if (!state.token) {
        showNotification('Please login', 'warning');
        return;
    }

    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    try {
        // Check if we're using real restaurant data or sample data
        const isRealRestaurant = state.currentRestaurant && !state.currentRestaurant._id.startsWith('sample');
        
        if (isRealRestaurant) {
            // Use real API for real restaurants
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: JSON.stringify({
                    restaurant: state.currentRestaurant._id,
                    items: state.cart.map(item => ({
                        menuItem: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    deliveryAddress,
                    paymentMethod
                })
            });

            const data = await response.json();
            if (response.ok) {
                state.cart = [];
                updateCartCount();
                showNotification('Order placed successfully!');
                loadOrders();
                showOrders();
            } else {
                showNotification(data.message || 'Failed to place order', 'error');
            }
        } else {
            // Simulate order for sample restaurants
            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const deliveryFee = 5;
            const total = subtotal + tax + deliveryFee;
            
            const mockOrder = {
                _id: 'mock_' + Date.now(),
                orderNumber: `ORD-${Date.now()}`,
                restaurant: { name: state.currentRestaurant?.name || 'Sample Restaurant' },
                items: state.cart.map(item => ({
                    menuItem: { name: item.name },
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice: total,
                tax: tax,
                deliveryFee: deliveryFee,
                deliveryAddress: deliveryAddress,
                paymentMethod: paymentMethod,
                status: 'pending',
                estimatedDeliveryTime: 30,
                createdAt: new Date()
            };
            
            // Add to local orders
            state.orders.unshift(mockOrder);
            state.cart = [];
            updateCartCount();
            showNotification('Order placed successfully! (Demo mode)');
            showOrders();
        }
    } catch (error) {
        console.error('[ERROR] Server error:', error);
        showNotification('Error placing order: ' + error.message, 'error');
    }
}

// ==================== ORDERS ====================

async function loadOrders() {
    if (!state.token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            state.orders = await response.json();
        } else {
            state.orders = [];
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        state.orders = [];
    }
}

function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (state.orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; padding: 40px;">No orders yet</p>';
        return;
    }

    ordersList.innerHTML = state.orders.map(order => {
        const statusClass = `status-${order.status.replace(/ /g, '_')}`;
        return `
            <div class="order-card" onclick="viewOrderDetails('${order._id}')">
                <div class="order-header">
                    <span class="order-number">${order.orderNumber}</span>
                    <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-info">
                    <div class="order-info-item">
                        <p>Restaurant</p>
                        <strong>${order.restaurant?.name || 'Unknown'}</strong>
                    </div>
                    <div class="order-info-item">
                        <p>Total Amount</p>
                        <strong>$${order.totalPrice.toFixed(2)}</strong>
                    </div>
                    <div class="order-info-item">
                        <p>Delivery Address</p>
                        <strong>${order.deliveryAddress}</strong>
                    </div>
                    <div class="order-info-item">
                        <p>Estimated Time</p>
                        <strong>${order.estimatedDeliveryTime}min</strong>
                    </div>
                </div>
                <button class="view-details-btn">View Details</button>
            </div>
        `;
    }).join('');
}

function viewOrderDetails(orderId) {
    const order = state.orders.find(o => o._id === orderId);
    if (!order) return;

    const statusClass = `status-${order.status.replace(/ /g, '_')}`;
    const itemsHtml = (order.items || []).map(item => `
        <div class="order-summary-item">
            <span>${item.menuItem?.name || 'Item'} x${item.quantity}</span>
            <span>$${item.price.toFixed(2)}</span>
        </div>
    `).join('');

    document.getElementById('orderDetails').innerHTML = `
        <h3>${order.orderNumber}</h3>
        <p><strong>Status:</strong> <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span></p>
        <p><strong>Restaurant:</strong> ${order.restaurant?.name || 'Unknown'}</p>
        <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Estimated Delivery Time:</strong> ${order.estimatedDeliveryTime} minutes</p>
        <div style="margin-top: 20px;">
            <h4>Order Items</h4>
            ${itemsHtml}
        </div>
        <div style="border-top: 1px solid #ddd; margin: 15px 0; padding-top: 15px;">
            <div class="order-summary-item">
                <span>Subtotal:</span>
                <span>$${(order.totalPrice - order.tax - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div class="order-summary-item">
                <span>Tax:</span>
                <span>$${order.tax.toFixed(2)}</span>
            </div>
            <div class="order-summary-item">
                <span>Delivery Fee:</span>
                <span>$${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div class="order-summary-item" style="font-weight: bold;">
                <span>Total:</span>
                <span>$${order.totalPrice.toFixed(2)}</span>
            </div>
        </div>
    `;

    document.getElementById('orderModal').style.display = 'block';
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// ==================== NAVIGATION ====================

function showHome() {
    if (!state.token) {
        showNotification('Please register first to access FoodEasy and browse restaurants', 'warning');
        showRegister();
        return;
    }
    hideAllSections();
    document.getElementById('homeSection').style.display = 'block';
    updateActiveNav('home');
}

function showRestaurants() {
    if (!state.token) {
        showNotification('Please register first to browse restaurants and food items', 'warning');
        showRegister();
        return;
    }
    hideAllSections();
    loadRestaurants();
    displayRestaurants();
    document.getElementById('restaurantsSection').style.display = 'block';
    updateActiveNav('restaurants');
}

function showMenu() {
    hideAllSections();
    document.getElementById('menuSection').style.display = 'block';
}

function showCart() {
    if (!state.token) {
        showNotification('Please register first to view your cart', 'warning');
        showRegister();
        return;
    }
    hideAllSections();
    displayCart();
    document.getElementById('cartSection').style.display = 'block';
    updateActiveNav('cart');
}

function showOrders() {
    if (!state.token) {
        showNotification('Please login to view orders', 'warning');
        showLogin();
        return;
    }
    hideAllSections();
    loadOrders();
    displayOrders();
    document.getElementById('ordersSection').style.display = 'block';
    updateActiveNav('orders');
}

function showRegister() {
    hideAllSections();
    document.getElementById('registerForm').reset();
    document.getElementById('registerSection').style.display = 'block';
    // Hide navigation for non-authenticated users
    updateNavVisibility(false);
}

function showLogin() {
    hideAllSections();
    document.getElementById('loginForm').reset();
    document.getElementById('loginSection').style.display = 'block';
    // Hide navigation for non-authenticated users
    updateNavVisibility(false);
}

function showCheckout() {
    hideAllSections();
    document.getElementById('checkoutForm').reset();
    document.getElementById('checkoutSection').style.display = 'block';
}

function hideAllSections() {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
}

function updateActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    // Add active class to the appropriate nav item
}

// ==================== UTILITIES ====================

function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with better UI
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Optional: Add visual notification using alert
    if (type === 'error') {
        alert(message);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function getMenuItemImage(item) {
    // If item has an image field and it's an emoji, use it
    if (item.image && item.image.length <= 4) {
        return item.image;
    }
    
    // Map category to emoji if no specific image
    const categoryEmojis = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Rolls': '🍣',
        'Nigiri': '🍣',
        'Sashimi': '🍣',
        'Tacos': '🌮',
        'Burritos': '🌯',
        'Bowls': '🍲',
        'Quesadillas': '🫓',
        'Chicken': '🍗',
        'Noodles': '🍜',
        'Rice': '🍚',
        'Curry': '🍛',
        'Bread': '🫓',
        'Wraps': '🥙',
        'Kebabs': '🍢',
        'Salads': '🥗',
        'Soups': '🍜',
        'Sandwiches': '🥪',
        'Platters': '🍽️',
        'Ribs': '🍖',
        'Sides': '🍟',
        'Appetizers': '🥟',
        'Desserts': '🍰',
        'Cakes': '🍰',
        'Pies': '🥧',
        'Ice Cream': '🍦',
        'Cookies': '🍪',
        'Pastries': '🥐',
        'Drinks': '🥤'
    };
    
    return categoryEmojis[item.category] || '🍽️';
}