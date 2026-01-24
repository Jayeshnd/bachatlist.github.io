// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Newsletter Form Handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing! We\'ll keep you updated with the latest reviews.');
            newsletterForm.reset();
        });
    }

    // Contact Form Handler
    const contactForm = document.querySelector('form');
    if (contactForm && window.location.pathname.includes('contact')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
        
        lastScroll = currentScroll;
    });
});

// Telegram Bot Content Update System
// This connects to your Telegram bot for content management
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
            console.log('Using default content');
        }
    }

    updatePageContent(data) {
        // Update images
        if (data.images) {
            Object.keys(data.images).forEach(id => {
                const img = document.getElementById(id);
                if (img) {
                    img.src = data.images[id];
                }
            });
        }

        // Update titles
        if (data.titles) {
            Object.keys(data.titles).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = data.titles[id];
                }
            });
        }

        // Update descriptions
        if (data.descriptions) {
            Object.keys(data.descriptions).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = data.descriptions[id];
                }
            });
        }

        // Update review content
        if (data.reviewContent) {
            Object.keys(data.reviewContent).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data.reviewContent[id];
                }
            });
        }
    }
}

// Initialize content manager
const contentManager = new ContentManager();

// Animation on Scroll
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

document.querySelectorAll('.featured-card, .category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});
