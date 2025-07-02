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

// 3D Starfield with center-based orbital system
class Starfield3D {
    constructor() {
        this.canvas = document.getElementById('starfield3d');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 300; // Doubled from 150
        this.cameraDistance = 400; // Distance for perspective calculation
        this.baseStarSize = 1.5; // Halved from 3
        
        // Mouse interaction for 3D rotation
        this.globalPitch = 0; // X-axis rotation (up/down)
        this.globalYaw = 0;   // Y-axis rotation (left/right)
        
        // Canvas center point - all stars orbit around this
        this.centerX = 0;
        this.centerY = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.initStars();
        this.setupMouseInteraction();
        this.animate();
    }
    
    resize() {
        const hero = document.querySelector('.hero');
        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    /**
     * Initialize stars with random orbital parameters
     * Each star orbits around the center point on its own tilted plane
     */
    initStars() {
        for (let i = 0; i < this.numStars; i++) {
            // Random orbital radius (distance from center) - doubled range
            const orbitalRadius = 100 + Math.random() * 500; // Was 50-300, now 100-600
            
            // Random starting angle on the orbit
            const angle = Math.random() * Math.PI * 2;
            
            // Random orbital plane tilt (gives each star unique 3D orbit)
            const tiltX = (Math.random() - 0.5) * Math.PI; // Tilt around X-axis
            const tiltY = (Math.random() - 0.5) * Math.PI; // Tilt around Y-axis
            
            // Random orbital speed
            const speed = (Math.random() - 0.5) * 0.02; // -0.01 to 0.01 radians/frame
            
            // Calculate initial 3D position
            const x = orbitalRadius * Math.cos(angle);
            const y = 0;
            const z = orbitalRadius * Math.sin(angle);
            
            this.stars.push({
                // Orbital parameters
                orbitalRadius: orbitalRadius,
                currentAngle: angle,
                orbitalSpeed: speed,
                tiltX: tiltX,
                tiltY: tiltY,
                
                // Current 3D position (will be calculated each frame)
                x: x,
                y: y,
                z: z,
                
                // Visual properties
                brightness: 0.3 + Math.random() * 0.7,
                baseSize: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    /**
     * Set up mouse movement for 3D view rotation
     */
    setupMouseInteraction() {
        let lastMouseX = 0;
        let lastMouseY = 0;
        let isFirstMove = true;
        
        document.addEventListener('mousemove', (e) => {
            if (isFirstMove) {
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                isFirstMove = false;
                return;
            }
            
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;
            
            // Convert mouse movement to rotation
            this.globalYaw += deltaX * 0.003;
            this.globalPitch += deltaY * 0.003;
            
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
    }
    
    /**
     * Calculate star's 3D position based on its orbital parameters
     */
    calculateStarPosition(star) {
        // Update orbital angle
        star.currentAngle += star.orbitalSpeed;
        
        // Calculate position on flat orbit
        let x = star.orbitalRadius * Math.cos(star.currentAngle);
        let y = 0;
        let z = star.orbitalRadius * Math.sin(star.currentAngle);
        
        // Apply orbital plane tilts
        // Tilt around X-axis
        const cosX = Math.cos(star.tiltX);
        const sinX = Math.sin(star.tiltX);
        let newY = y * cosX - z * sinX;
        let newZ = y * sinX + z * cosX;
        y = newY;
        z = newZ;
        
        // Tilt around Y-axis
        const cosY = Math.cos(star.tiltY);
        const sinY = Math.sin(star.tiltY);
        let newX = x * cosY + z * sinY;
        newZ = -x * sinY + z * cosY;
        x = newX;
        z = newZ;
        
        // Update star's 3D position
        star.x = x;
        star.y = y;
        star.z = z;
    }
    
    /**
     * Apply global rotation based on mouse (view rotation)
     */
    applyViewRotation(star) {
        let { x, y, z } = star;
        
        // Rotate around X-axis (pitch)
        const cosP = Math.cos(this.globalPitch);
        const sinP = Math.sin(this.globalPitch);
        let newY = y * cosP - z * sinP;
        let newZ = y * sinP + z * cosP;
        y = newY;
        z = newZ;
        
        // Rotate around Y-axis (yaw)
        const cosY = Math.cos(this.globalYaw);
        const sinY = Math.sin(this.globalYaw);
        let newX = x * cosY + z * sinY;
        newZ = -x * sinY + z * cosY;
        x = newX;
        z = newZ;
        
        return { x, y, z };
    }
    
    /**
     * Project 3D position to 2D screen with perspective
     * Stars get smaller as they move away (positive Z)
     */
    projectTo2D(position3D) {
        // Perspective division
        const perspective = this.cameraDistance / (this.cameraDistance + position3D.z);
        
        return {
            x: this.centerX + position3D.x * perspective,
            y: this.centerY + position3D.y * perspective,
            scale: perspective
        };
    }
    
    /**
     * Draw a star with size based on distance
     */
    drawStar(x, y, scale, star) {
        // Calculate size based on perspective and star's base size
        const size = this.baseStarSize * scale * star.baseSize;
        
        // Calculate opacity based on distance (fade when far)
        const opacity = star.brightness * scale;
        
        this.ctx.save();
        
        // Draw glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw core
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Update and render all stars
     */
    update() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate all star positions and prepare for sorting
        const starsToRender = this.stars.map(star => {
            // Update star's orbital position
            this.calculateStarPosition(star);
            
            // Apply view rotation
            const rotated = this.applyViewRotation(star);
            
            // Project to 2D
            const projected = this.projectTo2D(rotated);
            
            return {
                star: star,
                rotated: rotated,
                projected: projected
            };
        });
        
        // Sort by Z-depth (back to front)
        starsToRender.sort((a, b) => b.rotated.z - a.rotated.z);
        
        // Draw stars
        starsToRender.forEach(({ star, projected }) => {
            if (projected.scale > 0) { // Only draw if in front of camera
                this.drawStar(projected.x, projected.y, projected.scale, star);
            }
        });
        
        // Apply damping to rotation for smooth stop
        this.globalPitch *= 0.95;
        this.globalYaw *= 0.95;
    }
    
    /**
     * Animation loop
     */
    animate() {
        this.update();
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
        this.canvas.style.zIndex = '0';
        this.aboutSection.style.position = 'relative';
        
        // Insert canvas as first child so it's behind all content
        this.aboutSection.insertBefore(this.canvas, this.aboutSection.firstChild);
        
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

// Initialize effects when page loads
window.addEventListener('load', () => {
    // Initialize 3D starfield for hero section
    new Starfield3D();
    
    // Initialize star effect for about section
    new StarEffect();
    
    // Initialize lazy loading
    lazyLoadImages();
});