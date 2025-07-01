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
        this.gravity = 0.2; // Reduced for slower movement
        this.bounceDamping = 0.6; // Slightly less bouncy
        this.maxVelocity = 12; // Reduced max speed
        this.lastScrollTime = Date.now();
        this.resetDelay = 3000; // 3 seconds
        this.isResetting = false;
        
        this.init();
    }
    
    init() {
        // Initialize bubble data
        this.shapes.forEach((shape, index) => {
            const rect = shape.getBoundingClientRect();
            const heroRect = this.hero.getBoundingClientRect();
            
            this.bubbles.push({
                element: shape,
                x: 0,
                y: rect.top - heroRect.top,
                vx: 0,
                vy: 0,
                originalX: 0,
                originalY: rect.top - heroRect.top,
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
        this.scrollVelocity = (currentScrollY - this.lastScrollY) * 0.3; // Reduced for smoother movement
        this.scrollVelocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.scrollVelocity));
        this.lastScrollY = currentScrollY;
        this.lastScrollTime = Date.now();
        this.isResetting = false;
    }
    
    updatePhysics() {
        const currentTime = Date.now();
        const timeSinceScroll = currentTime - this.lastScrollTime;
        
        // Check if we should start resetting
        if (timeSinceScroll > this.resetDelay && !this.isResetting) {
            this.isResetting = true;
        }
        
        this.bubbles.forEach((bubble, index) => {
            // Calculate reset factor (0 to 1)
            const resetFactor = this.isResetting ? Math.min((timeSinceScroll - this.resetDelay) / 2000, 1) : 0;
            
            // Apply scroll-based force (reduced when resetting)
            bubble.vy -= this.scrollVelocity * 0.2 * (1 - resetFactor);
            
            // Apply gravity (reduced when resetting)
            bubble.vy += this.gravity * (1 - resetFactor);
            
            // Apply some floating motion
            const time = currentTime * 0.0005; // Slower rotation
            const floatX = Math.sin(time + index) * 20 * resetFactor;
            const floatY = Math.sin(time * 1.3 + index) * 15 * resetFactor;
            
            // Update position
            bubble.y += bubble.vy;
            
            // Get hero boundaries relative to viewport
            const heroBottom = this.hero.offsetHeight - bubble.radius * 2;
            const heroTop = -bubble.radius;
            
            // Check boundaries and bounce
            if (bubble.y > heroBottom) {
                bubble.y = heroBottom;
                bubble.vy *= -this.bounceDamping * 0.3; // Very light bounce
                // Move towards bottom left when bouncing
                if (!this.isResetting) {
                    bubble.vx = -2; // Move left
                }
            } else if (bubble.y < heroTop) {
                bubble.y = heroTop;
                bubble.vy *= -this.bounceDamping;
            }
            
            // Apply horizontal movement
            bubble.x += bubble.vx || 0;
            bubble.vx *= 0.95; // Horizontal air resistance
            
            // Apply air resistance (stronger when resetting)
            bubble.vy *= this.isResetting ? 0.92 : 0.96;
            
            // Smoothly return to original position when resetting
            if (this.isResetting) {
                bubble.y += (bubble.originalY - bubble.y) * resetFactor * 0.05;
                bubble.x += (bubble.originalX - bubble.x) * resetFactor * 0.05;
            }
            
            // Apply position with smooth floating
            const translateY = bubble.y - bubble.originalY + floatY;
            const translateX = bubble.x + floatX;
            const rotation = time * 30 + index * 120; // Slower rotation
            
            bubble.element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
        });
        
        // Gradually reduce scroll velocity
        this.scrollVelocity *= 0.95;
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
        this.connections = [];
        
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
        const star = {
            x: x,
            y: y,
            size: Math.random() * 3 + 2,
            opacity: 1,
            age: 0,
            connectionTimer: 0,
            hasConnected: false,
            id: Date.now() + Math.random()
        };
        this.stars.push(star);
    }
    
    drawStar(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#ee6c4d';
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
        // Update stars and check for connections
        this.stars = this.stars.filter(star => {
            star.age += 16; // ~60fps
            star.connectionTimer += 16;
            star.opacity = Math.max(0, 1 - star.age / 3000); // Fade out over 3 seconds
            
            // Check for mouse connection every 700ms with 30% chance
            if (star.connectionTimer >= 700 && !star.hasConnected && this.mouseX > 0) {
                star.connectionTimer = 0;
                if (Math.random() < 0.3) {
                    // Create connection to mouse
                    this.connections.push({
                        x1: star.x,
                        y1: star.y,
                        x2: this.mouseX,
                        y2: this.mouseY,
                        opacity: 1,
                        age: 0
                    });
                    star.hasConnected = true;
                    
                    // 15% chance to connect to another star
                    if (Math.random() < 0.15) {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 20;
                        const newX = star.x + Math.cos(angle) * distance;
                        const newY = star.y + Math.sin(angle) * distance;
                        
                        const newStar = {
                            x: newX,
                            y: newY,
                            size: Math.random() * 3 + 2,
                            opacity: 1,
                            age: 0,
                            connectionTimer: 0,
                            hasConnected: true,
                            id: Date.now() + Math.random()
                        };
                        this.stars.push(newStar);
                        
                        // Create connection between stars
                        this.connections.push({
                            x1: star.x,
                            y1: star.y,
                            x2: newX,
                            y2: newY,
                            opacity: 1,
                            age: 0
                        });
                    }
                }
            }
            
            return star.opacity > 0;
        });
        
        // Update connections
        this.connections = this.connections.filter(conn => {
            conn.age += 16;
            conn.opacity = Math.max(0, 1 - conn.age / 1000); // Fade out over 1 second
            return conn.opacity > 0;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            this.ctx.save();
            this.ctx.globalAlpha = conn.opacity * 0.5;
            this.ctx.strokeStyle = '#98c1d9';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(conn.x1, conn.y1);
            this.ctx.lineTo(conn.x2, conn.y2);
            this.ctx.stroke();
            this.ctx.restore();
        });
        
        // Draw stars
        this.stars.forEach(star => {
            this.drawStar(star.x, star.y, star.size, star.opacity);
        });
    }
    
    animate() {
        this.updateStars();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
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
});