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

// Physics-based bubble animation with mouse interaction
class BubblePhysics {
    constructor() {
        this.shapes = document.querySelectorAll('.shape');
        this.hero = document.querySelector('.hero');
        this.bubbles = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.repelRadius = 150; // Distance at which mouse repels bubbles
        this.repelForce = 5; // Strength of repulsion
        this.resetDelay = 2500; // 2.5 seconds
        this.gravity = 0.1; // Light gravity
        this.bounceDamping = 0.7; // Light bounce
        
        this.init();
    }
    
    init() {
        // Initialize bubble data
        this.shapes.forEach((shape, index) => {
            const rect = shape.getBoundingClientRect();
            const heroRect = this.hero.getBoundingClientRect();
            
            // Get computed styles to find initial position
            const computedStyle = window.getComputedStyle(shape);
            const initialX = parseFloat(computedStyle.left) || 0;
            const initialY = parseFloat(computedStyle.top) || 0;
            
            this.bubbles.push({
                element: shape,
                x: initialX,
                y: initialY,
                vx: 0,
                vy: 0,
                originalX: initialX,
                originalY: initialY,
                radius: rect.width / 2,
                lastRepelTime: 0
            });
        });
        
        // Start animation loop
        this.animate();
        
        // Add mouse listener
        this.hero.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.hero.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    
    handleMouseMove(e) {
        const rect = this.hero.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    handleMouseLeave() {
        this.mouseX = -1000;
        this.mouseY = -1000;
    }
    
    updatePhysics() {
        const currentTime = Date.now();
        
        this.bubbles.forEach((bubble, index) => {
            // Calculate distance from mouse
            const dx = this.mouseX - (bubble.x + bubble.radius);
            const dy = this.mouseY - (bubble.y + bubble.radius);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply mouse repulsion if close enough
            if (distance < this.repelRadius && distance > 0) {
                // Calculate repulsion force
                const force = (1 - distance / this.repelRadius) * this.repelForce;
                const angle = Math.atan2(dy, dx);
                
                // Apply force in opposite direction
                bubble.vx -= Math.cos(angle) * force;
                bubble.vy -= Math.sin(angle) * force;
                
                bubble.lastRepelTime = currentTime;
            }
            
            // Apply gravity
            bubble.vy += this.gravity;
            
            // Update position
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;
            
            // Get hero boundaries
            const heroWidth = this.hero.offsetWidth;
            const heroHeight = this.hero.offsetHeight;
            
            // Check boundaries and bounce
            if (bubble.y + bubble.radius * 2 > heroHeight) {
                bubble.y = heroHeight - bubble.radius * 2;
                bubble.vy *= -this.bounceDamping;
            } else if (bubble.y < 0) {
                bubble.y = 0;
                bubble.vy *= -this.bounceDamping;
            }
            
            if (bubble.x + bubble.radius * 2 > heroWidth) {
                bubble.x = heroWidth - bubble.radius * 2;
                bubble.vx *= -this.bounceDamping;
            } else if (bubble.x < 0) {
                bubble.x = 0;
                bubble.vx *= -this.bounceDamping;
            }
            
            // Apply air resistance
            bubble.vx *= 0.98;
            bubble.vy *= 0.98;
            
            // Return to original position after delay
            const timeSinceRepel = currentTime - bubble.lastRepelTime;
            if (timeSinceRepel > this.resetDelay) {
                const resetFactor = Math.min((timeSinceRepel - this.resetDelay) / 1000, 1);
                bubble.x += (bubble.originalX - bubble.x) * resetFactor * 0.05;
                bubble.y += (bubble.originalY - bubble.y) * resetFactor * 0.05;
            }
            
            // Add floating animation
            const time = currentTime * 0.001;
            const floatX = Math.sin(time + index) * 10;
            const floatY = Math.sin(time * 1.3 + index) * 10;
            
            // Apply transform
            const rotation = time * 30 + index * 120;
            bubble.element.style.transform = `translate(${bubble.x + floatX}px, ${bubble.y + floatY}px) rotate(${rotation}deg)`;
        });
    }
    
    animate() {
        this.updatePhysics();
        requestAnimationFrame(() => this.animate());
    }
}

// Star effect for About section
class StarEffect {
    constructor() {
        this.aboutSection = document.querySelector('.about');
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastStarTime = 0;
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.aboutSection.style.position = 'relative';
        this.aboutSection.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.aboutSection.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.aboutSection.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        this.animate();
    }
    
    resize() {
        const rect = this.aboutSection.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    handleMouseMove(e) {
        const rect = this.aboutSection.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        // Create new star at mouse position
        const currentTime = Date.now();
        if (currentTime - this.lastStarTime > 100) { // Create star every 100ms
            this.createStar(this.mouseX, this.mouseY);
            this.lastStarTime = currentTime;
        }
    }
    
    handleMouseLeave() {
        this.mouseX = -1;
        this.mouseY = -1;
    }
    
    createStar(x, y) {
        // Random direction and speed for shooting effect
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1; // 1-3 pixels per frame
        
        const star = {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 2,
            opacity: 1,
            age: 0,
            id: Date.now() + Math.random(),
            trail: [], // Store trail positions
            maxDistance: 50,
            startX: x,
            startY: y
        };
        this.stars.push(star);
    }
    
    drawStar(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#a22c29';
        this.ctx.translate(x, y);
        
        // Draw a 5-pointed star
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    
    updateStars() {
        // Update stars
        this.stars = this.stars.filter(star => {
            star.age += 16; // ~60fps
            
            // Add current position to trail
            star.trail.push({ x: star.x, y: star.y, opacity: star.opacity });
            if (star.trail.length > 10) { // Keep last 10 positions for trail
                star.trail.shift();
            }
            
            // Update position for shooting star effect
            const distance = Math.sqrt(
                Math.pow(star.x - star.startX, 2) + 
                Math.pow(star.y - star.startY, 2)
            );
            
            if (distance < star.maxDistance) {
                star.x += star.vx;
                star.y += star.vy;
                star.vx *= 0.98; // Slow down gradually
                star.vy *= 0.98;
            }
            
            star.opacity = Math.max(0, 1 - star.age / 3000); // Fade out over 3 seconds
            
            
            return star.opacity > 0;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        // Draw stars with trails
        this.stars.forEach(star => {
            // Draw trail
            if (star.trail.length > 1) {
                this.ctx.save();
                this.ctx.strokeStyle = '#a22c29';
                this.ctx.lineCap = 'round';
                
                for (let i = 1; i < star.trail.length; i++) {
                    const prev = star.trail[i - 1];
                    const curr = star.trail[i];
                    
                    this.ctx.globalAlpha = (i / star.trail.length) * curr.opacity * 0.5;
                    this.ctx.lineWidth = (i / star.trail.length) * star.size * 0.8;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(prev.x, prev.y);
                    this.ctx.lineTo(curr.x, curr.y);
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }
            
            // Draw star
            this.drawStar(star.x, star.y, star.size, star.opacity);
        });
    }
    
    animate() {
        this.updateStars();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Lazy load images
function lazyLoadImages() {
    const imageElements = document.querySelectorAll('[data-bg]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-bg');
                if (src) {
                    img.style.backgroundImage = `url('${src}')`;
                    img.removeAttribute('data-bg');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    imageElements.forEach(img => imageObserver.observe(img));
}

// Initialize bubble physics when page loads
window.addEventListener('load', () => {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length > 0) {
        console.log('Initializing bubble physics with', shapes.length, 'shapes');
        new BubblePhysics();
    } else {
        console.log('No shapes found for bubble physics');
    }
    
    // Initialize star effect for about section
    new StarEffect();
    
    // Initialize lazy loading
    lazyLoadImages();
});