// HERITECH Real Estate Website - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Property Filtering (for properties page)
    if (document.getElementById('propertiesGrid')) {
        initPropertyFilters();
    }
    
    // Contact Form Handling
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // Smooth Scrolling for Anchor Links
    initSmoothScrolling();
    
    // Animation on Scroll
    initScrollAnimations();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Property Filtering Functionality
function initPropertyFilters() {
    const priceFilter = document.getElementById('priceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const propertyCards = document.querySelectorAll('.property-card');
    const propertyCount = document.getElementById('propertyCount');
    
    function filterProperties() {
        const selectedPrice = priceFilter.value;
        const selectedType = typeFilter.value;
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
            const cardPrice = parseInt(card.dataset.price);
            const cardType = card.dataset.type;
            let showCard = true;
            
            // Price filtering
            if (selectedPrice !== 'all') {
                if (selectedPrice === '1000000+') {
                    showCard = cardPrice >= 1000000;
                } else {
                    const [min, max] = selectedPrice.split('-').map(Number);
                    showCard = cardPrice >= min && cardPrice <= max;
                }
            }
            
            // Type filtering
            if (selectedType !== 'all' && showCard) {
                showCard = cardType === selectedType;
            }
            
            // Show/hide card
            if (showCard) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update property count
        if (propertyCount) {
            propertyCount.textContent = visibleCount;
        }
    }
    
    // Add event listeners
    if (priceFilter) priceFilter.addEventListener('change', filterProperties);
    if (typeFilter) typeFilter.addEventListener('change', filterProperties);
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.property-card, .bg-white');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    .property-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .property-card.animate-fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .property-card:hover {
        transform: translateY(-5px);
    }
    
    /* Loading animation for buttons */
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* Smooth transitions for all interactive elements */
    a, button, input, select, textarea {
        transition: all 0.3s ease;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #1e40af;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #1e3a8a;
    }
`;

document.head.appendChild(style);

