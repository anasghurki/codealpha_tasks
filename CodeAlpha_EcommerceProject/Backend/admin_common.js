function renderAdminSidebar() {
    const sidebar = document.querySelector('aside.sidebar');
    if (!sidebar) return;

    const path = window.location.pathname;
    const page = path.split("/").pop();

    sidebar.innerHTML = `
        <div class="sidebar-logo" style="padding: 30px; font-size: 24px; font-weight: 800; letter-spacing: -1px;">Tecnify.</div>
        <ul class="sidebar-nav" style="list-style: none; padding: 0 20px;">
            <li class="nav-item" style="margin-bottom: 10px;">
                <a href="dashboard.html" class="nav-link ${page === 'dashboard.html' ? 'active' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; text-decoration: none; color: inherit; font-size: 14px; font-weight: 500;">
                    <i data-lucide="layout-dashboard" style="width: 18px;"></i> Dashboard
                </a>
            </li>
            <li class="nav-item" style="margin-bottom: 10px;">
                <a href="products.html" class="nav-link ${page === 'products.html' ? 'active' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; text-decoration: none; color: inherit; font-size: 14px; font-weight: 500;">
                    <i data-lucide="package" style="width: 18px;"></i> Products
                </a>
            </li>
            <li class="nav-item" style="margin-bottom: 10px;">
                <a href="categories.html" class="nav-link ${page === 'categories.html' ? 'active' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; text-decoration: none; color: inherit; font-size: 14px; font-weight: 500;">
                    <i data-lucide="layers" style="width: 18px;"></i> Categories
                </a>
            </li>
            <li class="nav-item" style="margin-bottom: 10px;">
                <a href="orders.html" class="nav-link ${page === 'orders.html' ? 'active' : ''}" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; text-decoration: none; color: inherit; font-size: 14px; font-weight: 500;">
                    <i data-lucide="shopping-cart" style="width: 18px;"></i> Orders
                </a>
            </li>
            <li class="nav-item" style="margin-top: 50px;">
                <a href="#" onclick="handleAdminLogout()" class="nav-link" style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; text-decoration: none; color: #ff4d4d; font-size: 14px; font-weight: 600;">
                    <i data-lucide="log-out" style="width: 18px;"></i> Logout
                </a>
            </li>
        </ul>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleAdminLogout() {
    if (confirm("Logout from admin panel?")) {
        localStorage.removeItem('adminToken');
        window.location.href = '../login.html'; 
    }
}


document.addEventListener('DOMContentLoaded', renderAdminSidebar);
