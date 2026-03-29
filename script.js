/* ==================== SHOPPING CART FUNCTIONALITY ==================== */

let cart = [];

// Load cart from localStorage on page load
window.addEventListener('load', () => {
    const savedCart = localStorage.getItem('softverseCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
});

function addToCart(productName, price) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    // Save cart to localStorage
    localStorage.setItem('softverseCart', JSON.stringify(cart));

    // Show notification
    showNotification(`${productName} added to cart!`);

    // Update cart display
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    let html = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div style="font-size: 0.9rem; color: #999;">
                        $${item.price.toFixed(2)} × ${item.quantity}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('softverseCart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function openCart() {
    updateCartDisplay();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('softverseCart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Cart cleared');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Calculate total
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Show checkout confirmation
    alert(`Proceeding to checkout...\n\nItems: ${cart.length}\nTotal: $${total.toFixed(2)}\n\nPlease complete payment on the next page.`);

    // Redirect to payment page (in real scenario)
    // window.location.href = 'checkout.html';
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Close modals when clicking outside of them
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const successModal = document.getElementById('successModal');

    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== UTILITY FUNCTIONS ==================== 

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get current date formatted
function getCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Log user activity (for analytics)
function logActivity(action, details) {
    const activity = {
        timestamp: new Date().toISOString(),
        action: action,
        details: details,
        userAgent: navigator.userAgent
    };
    
    // In real implementation, send to server
    console.log('Activity logged:', activity);
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                font-size: 0.85rem;
                z-index: 1000;
                white-space: nowrap;
            `;
            this.appendChild(tooltip);
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize app on load
window.addEventListener('load', () => {
    // Initialize tooltips
    initTooltips();

    // Log page visit
    logActivity('page_visit', { page: document.title });

    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K to open cart
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openCart();
    }

    // Escape to close modals
    if (event.key === 'Escape') {
        closeCart();
        closeSuccessModal?.();
    }
}

// Search functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const lowerQuery = query.toLowerCase();

    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('.product-desc').textContent.toLowerCase();

        if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

// Filter products by price range
function filterProductsByPrice(minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const priceText = product.querySelector('.product-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));

        if (price >= minPrice && price <= maxPrice) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

// Export cart as JSON
function exportCart() {
    const dataStr = JSON.stringify(cart, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'softverse-cart.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Print receipt
function printReceipt() {
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let receiptContent = `
        <html>
        <head>
            <title>SoftVerse Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #667eea; color: white; }
                .total { text-align: right; font-weight: bold; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h1>🚀 SoftVerse Receipt</h1>
            <p>Date: ${getCurrentDate()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptContent += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    receiptContent += `
                </tbody>
            </table>
            <p class="total">Grand Total: $${total.toFixed(2)}</p>
            <p style="text-align: center; color: #999; font-size: 0.9em;">
                Thank you for shopping with SoftVerse!
            </p>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
}

// Performance monitoring
function measurePerformance() {
    if (window.performance && window.performance.timing) {
        const timing = performance.timing;
        const navigation = performance.navigation;
        
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const connectTime = timing.responseEnd - timing.requestStart;
        const renderTime = timing.domComplete - timing.domLoading;

        console.log('Performance Metrics:');
        console.log('Page Load Time:', pageLoadTime + 'ms');
        console.log('Connect Time:', connectTime + 'ms');
        console.log('Render Time:', renderTime + 'ms');
    }
}

// Call performance measurement after page load
window.addEventListener('load', measurePerformance);

// ============================================
// AUTHENTICATION AND API INTEGRATION
// ============================================

// Register Form Handler
function handleRegister(event) {
  event.preventDefault();

  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value
  };

  console.log('📤 Sending registration:', formData);

  fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => {
    console.log('📥 Response status:', res.status);
    if (!res.ok && res.status !== 201) {
      return res.json().then(data => {
        throw new Error(data.error || 'Registration failed');
      });
    }
    return res.json();
  })
  .then(data => {
    console.log('📋 Response data:', data);
    alert('✓ Registration Successful!\n\n' + data.message);
    document.getElementById('registerForm').reset();
    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  })
  .catch(error => {
    console.error('❌ Registration error:', error);
    alert('✗ ' + error.message);
  });
}

// Login Form Handler
function handleLogin(event) {
  event.preventDefault();

  const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userEmail', formData.email);
      
      alert('✓ Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert('✗ Login failed: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    alert('✗ Login error: ' + error.message);
    console.error('Login error:', error);
  });
}

// Forgot Password Handler
function handleForgotPassword(event) {
  if (event) event.preventDefault();

  const email = prompt('Enter your email address:');
  if (!email) return;

  fetch('http://localhost:3000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    alert('✓ ' + data.message);
  })
  .catch(error => {
    alert('✗ Error: ' + error.message);
  });
}

// Get User Profile (Protected)
function getUserProfile() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  fetch('http://localhost:3000/api/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.user) {
      console.log('User profile:', data.user);
      // Display user info on page
      const userInfoEl = document.getElementById('userInfo');
      if (userInfoEl) {
        userInfoEl.innerHTML = `
          <h3>${data.user.firstName} ${data.user.lastName}</h3>
          <p>Email: ${data.user.email}</p>
          <p>Phone: ${data.user.phone}</p>
          <p>Country: ${data.user.country}</p>
        `;
      }
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(error => {
    alert('Failed to fetch profile: ' + error.message);
  });
}

// Logout Handler
function handleLogout() {
  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(data => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    alert('✓ Logged out successfully');
    window.location.href = 'index.html';
  })
  .catch(error => {
    console.error('Logout error:', error);
    window.location.href = 'index.html';
  });
}

// Check if User is Logged In
function checkLogin() {
  const token = localStorage.getItem('token');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameEl = document.getElementById('userName');

  if (token) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userNameEl) {
      const email = localStorage.getItem('userEmail');
      userNameEl.textContent = email || 'User';
    }
  } else {
    // User is not logged in
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkLogin);

// Protected API Request Example
async function makeProtectedRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login first');
    return null;
  }

  const options = {
    method,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch('http://localhost:3000' + endpoint, options);
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 403 && result.error === 'Invalid or expired token') {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      }
      throw new Error(result.error || 'Error occurred');
    }

    return result;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
