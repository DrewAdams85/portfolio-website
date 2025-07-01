// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
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

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.about, .work, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});

// Active Navigation Highlight
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active link styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--accent-color);
    }
`;
document.head.appendChild(style);

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Physics-based bubble animation
class BubblePhysics {
    constructor() {
        this.shapes = document.querySelectorAll('.shape');
        this.hero = document.querySelector('.hero');
        this.heroRect = this.hero.getBoundingClientRect();
        this.bubbles = [];
        this.lastScrollY = window.scrollY;
        this.scrollVelocity = 0;
        this.gravity = 0.5;
        this.bounceDamping = 0.7;
        this.maxVelocity = 20;
        
        this.init();
    }
    
    init() {
        // Initialize bubble data
        this.shapes.forEach((shape, index) => {
            const rect = shape.getBoundingClientRect();
            const heroTop = this.heroRect.top + window.scrollY;
            
            this.bubbles.push({
                element: shape,
                x: rect.left - this.heroRect.left,
                y: rect.top - heroTop,
                vx: 0,
                vy: 0,
                originalY: rect.top - heroTop,
                radius: rect.width / 2
            });
        });
        
        // Start animation loop
        this.animate();
        
        // Add scroll listener
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        this.scrollVelocity = (currentScrollY - this.lastScrollY) * 0.5;
        this.scrollVelocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.scrollVelocity));
        this.lastScrollY = currentScrollY;
    }
    
    updatePhysics() {
        this.bubbles.forEach((bubble, index) => {
            // Apply scroll-based force
            bubble.vy -= this.scrollVelocity * 0.3;
            
            // Apply gravity
            bubble.vy += this.gravity;
            
            // Apply some floating motion
            const time = Date.now() * 0.001;
            const floatY = Math.sin(time + index) * 2;
            
            // Update position
            bubble.y += bubble.vy + floatY;
            
            // Get hero boundaries relative to viewport
            const heroBottom = this.hero.offsetHeight - bubble.radius * 2;
            const heroTop = -bubble.radius;
            
            // Check boundaries and bounce
            if (bubble.y > heroBottom) {
                bubble.y = heroBottom;
                bubble.vy *= -this.bounceDamping;
            } else if (bubble.y < heroTop) {
                bubble.y = heroTop;
                bubble.vy *= -this.bounceDamping;
            }
            
            // Apply air resistance
            bubble.vy *= 0.98;
            
            // Apply position
            bubble.element.style.transform = `translateY(${bubble.y - bubble.originalY}px) rotate(${time * 50 + index * 120}deg)`;
        });
        
        // Gradually reduce scroll velocity
        this.scrollVelocity *= 0.9;
    }
    
    animate() {
        this.updatePhysics();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize bubble physics when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BubblePhysics();
});