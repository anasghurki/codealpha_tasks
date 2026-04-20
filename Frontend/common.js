
const API_BASE_URL = 'http://localhost:5000/api';
const UPLOADS_URL = 'http://localhost:5000/uploads';

async function fetchAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchProductsByCategory(categoryName) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        if (!categoryName || categoryName === 'All') return products;
        return products.filter(p => p.category_name && p.category_name.toLowerCase().includes(categoryName.toLowerCase()));
    } catch (error) {
        console.error(`Error fetching products for ${categoryName}:`, error);
        return [];
    }
}


function createProductCard(product) {
    const isOnSale = product.old_price && parseFloat(product.old_price) > parseFloat(product.price);

    return `
        <div class="product-card">
            <div class="product-img-wrapper" onclick="window.location.href='product_details.html?id=${product.id}'" style="cursor:pointer;">
                ${isOnSale ? '<span class="sale-badge">SALE</span>' : ''}
                <img src="${UPLOADS_URL}/${product.image1}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                <div class="product-overlay">
                    <button onclick="event.stopPropagation(); addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image1}')" class="btn btn-black btn-sm">Add to Cart</button>
                    <a href="product_details.html?id=${product.id}" class="btn btn-outline btn-sm" style="background: white;">View Details</a>
                </div>
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <div class="product-price-container">
                    <span class="price">$${product.price}</span>
                    ${isOnSale ? `<span class="old-price">$${product.old_price}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}


function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    alert(`Added ${name} to cart!`);
}

function updateCartIcon() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countSpan = document.querySelector('.cart-count');
    if (countSpan) {
        countSpan.textContent = count;
        countSpan.style.display = count > 0 ? 'flex' : 'none';
    }
}


function renderNavbar() {
    const nav = document.querySelector('nav') || document.querySelector('.navbar');
    if (!nav) return;

    const user = JSON.parse(localStorage.getItem('user'));

    nav.innerHTML = `
        <div class="menu-toggle" onclick="toggleMenu()">
            <i data-lucide="menu"></i>
        </div>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="Shop.html">Shop</a>
            <div class="dropdown">
                <a href="#" class="dropbtn">Collections</a>
                <div class="dropdown-content">
                    <a href="Headphones.html">Headphones</a>
                    <a href="Airpods.html">Airpods</a>
                    <a href="Watches.html">Watches</a>
                    
                    <a href="Laptops.html">Laptops</a>
                    <a href="MobilePhones.html">Mobile Phones</a>
                </div>
            </div>
            <a href="#">About Us</a>
        </div>
        <div class="logo" onclick="window.location.href='index.html'" style="cursor:pointer;">
            <img src="Technify-removebg-preview.png" alt="TECNIFY Logo">
        </div>
        <div class="nav-icons">
            <i data-lucide="search"></i>
            <div class="user-profile" style="display: flex; align-items: center; gap: 15px;">
                <div onclick="${user ? 'toggleLogoutMenu()' : "window.location.href='login.html'"}" style="cursor:pointer; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="user" style="${user ? 'color: #00ff00;' : ''}"></i>
                    ${user ? `<span style="font-size: 13px; font-weight: 600;">${user.name.split(' ')[0]}</span>` : ''}
                </div>
                ${user ? `<button onclick="handleLogout()" style="background:none; border:none; color:red; font-size:12px; cursor:pointer; font-weight:600;">Logout</button>` : ''}
            </div>
            <div class="cart-icon" onclick="window.location.href='cart.html'" style="cursor:pointer;">
                <i data-lucide="shopping-bag" style="color: #ff0000;"></i>
                <span class="cart-count">0</span>
            </div>
        </div>
    `;
    updateCartIcon();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}


function renderFooter() {
    const footer = document.querySelector('footer') || document.querySelector('.footer');
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-grid">
            <div>
                <div class="footer-logo">Tecnify</div>
                <p style="opacity: 0.6; line-height: 1.6;">Your destination for high-end gadgets. We focus on quality, performance, and aesthetic design.</p>
            </div>
            <div>
                <h4 style="margin-bottom: 20px;">Support</h4>
                <p>Contact Us</p>
                <p>Shipping</p>
                <p>Returns</p>
            </div>
            <div>
                <h4 style="margin-bottom: 20px;">Company</h4>
                <p>About Us</p>
                <p>Careers</p>
                <p>Blog</p>
            </div>
            <div>
                <h4 style="margin-bottom: 20px;">Social</h4>
                <p>Instagram</p>
                <p>Twitter</p>
                <p>LinkedIn</p>
            </div>
        </div>
        <div style="border-top: 1px solid #333; padding-top: 30px; text-align: center; opacity: 0.4; font-size: 14px;">
            &copy; 2024 Tecnify Gadgets. All rights reserved.
        </div>
    `;
}

//  everything
window.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
