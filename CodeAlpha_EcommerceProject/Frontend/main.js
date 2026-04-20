
lucide.createIcons();


document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        tab.classList.add('active');
        
    
        const grid = document.querySelector('.products-grid');
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
            grid.style.transition = 'all 0.4s ease';
        }, 100);
    });
});


const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .cat-card, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});


document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', () => {
        item.parentElement.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });
});


const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener('click', () => {
        alert('Filter sidebar would open as a drawer on mobile!');
    });
}

