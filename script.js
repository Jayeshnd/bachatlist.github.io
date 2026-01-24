// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Search Overlay Toggle
function toggleSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    searchOverlay.classList.toggle('active');
    
    if (searchOverlay.classList.contains('active')) {
        document.querySelector('.search-input').focus();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close search on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay && searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
    }
});

// Wishlist Toggle
function toggleWishlist(button) {
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    button.textContent = isActive ? '❤' : '♡';
    
    // Show notification
    showNotification(isActive ? 'Added to wishlist!' : 'Removed from wishlist');
    
    // Save to localStorage
    const dealCard = button.closest('.deal-card');
    const dealId = dealCard.id;
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isActive) {
        if (!wishlist.includes(dealId)) {
            wishlist.push(dealId);
        }
    } else {
        wishlist = wishlist.filter(id => id !== dealId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Load wishlist state on page load
document.addEventListener('DOMContentLoaded', function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist.forEach(dealId => {
        const dealCard = document.getElementById(dealId);
        if (dealCard) {
            const button = dealCard.querySelector('.btn-wishlist');
            if (button) {
                button.classList.add('active');
                button.textContent = '❤';
            }
        }
    });
});

// Show Notification
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
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

// Back to Top Button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/Hide Back to Top Button
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }
    }
});

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('✓ Successfully subscribed! Check your email.');
                this.reset();
                
                // Save to localStorage
                let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('subscribers', JSON.stringify(subscribers));
                }
            }
        });
    }
});

// Search Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-container');
    if (searchForm) {
        const searchInput = searchForm.querySelector('.search-input');
        const searchButton = searchForm.querySelector('.search-submit');
        
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                // You can implement actual search functionality here
                showNotification(`Searching for: ${query}`);
                toggleSearch();
                searchInput.value = '';
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Telegram Bot Content Management System
class ContentManager {
    constructor() {
        this.dataFile = 'content-data.json';
        this.loadContent();
    }

    async loadContent() {
        try {
            const response = await fetch(this.dataFile);
            if (response.ok) {
                const data = await response.json();
                this.updatePageContent(data);
            }
        } catch (error) {
            console.log('Using default content - content-data.json not found');
        }
    }

    updatePageContent(data) {
        // Update deal images
        if (data.dealImages) {
            Object.keys(data.dealImages).forEach(id => {
                const img = document.getElementById(id);
                if (img) {
                    img.src = data.dealImages[id];
                }
            });
        }

        // Update deal titles
        if (data.dealTitles) {
            Object.keys(data.dealTitles).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = data.dealTitles[id];
                }
            });
        }

        // Update deal descriptions
        if (data.dealDescriptions) {
            Object.keys(data.dealDescriptions).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = data.dealDescriptions[id];
                }
            });
        }

        // Update prices
        if (data.prices) {
            Object.keys(data.prices).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = data.prices[id];
                }
            });
        }

        // Update any custom content
        if (data.customContent) {
            Object.keys(data.customContent).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data.customContent[id];
                }
            });
        }
    }
}

// Initialize content manager
const contentManager = new ContentManager();

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.deal-card, .category-card, .review-card, .feature-card');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
});

// Price Comparison Tracker (for future implementation)
class PriceTracker {
    constructor() {
        this.prices = JSON.parse(localStorage.getItem('priceHistory') || '{}');
    }

    trackPrice(productId, price) {
        if (!this.prices[productId]) {
            this.prices[productId] = [];
        }
        
        this.prices[productId].push({
            price: price,
            date: new Date().toISOString()
        });
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        this.prices[productId] = this.prices[productId].filter(entry => {
            return new Date(entry.date) > thirtyDaysAgo;
        });
        
        localStorage.setItem('priceHistory', JSON.stringify(this.prices));
    }

    getLowestPrice(productId) {
        if (!this.prices[productId] || this.prices[productId].length === 0) {
            return null;
        }
        
        return Math.min(...this.prices[productId].map(entry => entry.price));
    }
}

const priceTracker = new PriceTracker();

// Copy Deal Link
function copyDealLink(button, dealUrl) {
    navigator.clipboard.writeText(dealUrl).then(() => {
        showNotification('✓ Link copied to clipboard!');
    }).catch(() => {
        showNotification('✗ Failed to copy link');
    });
}

// Deal Countdown Timer (for lightning deals)
function startCountdown(elementId, endTime) {
    const element = document.getElementById(elementId);
    if (!element) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            element.textContent = 'EXPIRED';
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        element.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Track user interactions for analytics
function trackEvent(eventName, data) {
    console.log('Event:', eventName, data);
    
    // You can send this to your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    
    // Store in localStorage for now
    let events = JSON.parse(localStorage.getItem('userEvents') || '[]');
    events.push({
        event: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
        events = events.slice(-100);
    }
    
    localStorage.setItem('userEvents', JSON.stringify(events));
}

// Track deal clicks
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-deal').forEach(button => {
        button.addEventListener('click', function(e) {
            const dealCard = this.closest('.deal-card');
            const dealTitle = dealCard.querySelector('h3').textContent;
            trackEvent('deal_click', { title: dealTitle });
        });
    });
});

// Dark mode toggle (optional feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
});

// Console welcome message
console.log('%c💰 Welcome to BachatList!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cFind the best deals and save more on every purchase!', 'font-size: 14px; color: #4a5568;');
console.log('%c🚀 Site powered by BachatList Technology', 'font-size: 12px; color: #718096;');
