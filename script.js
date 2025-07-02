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

// 3D Starfield with individual star rotations and mouse interaction
class Starfield3D {
    constructor() {
        this.canvas = document.getElementById('starfield3d');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration
        this.config = {
            numStars: 150,        // Number of stars
            sphereRadius: 600,    // Radius of the sphere stars are placed on (doubled)
            cameraDistance: 800,  // Camera distance for perspective projection
            baseStarSize: 2,      // Base size of stars
            rotationSpeed: 0.0003, // Individual star rotation speed (reduced for subtlety)
            mouseInfluence: 0.003, // Mouse movement influence (increased for responsiveness)
            mouseDamping: 0.95    // Damping factor for smooth deceleration
        };
        
        // State
        this.stars = [];
        this.globalRotation = { pitch: 0, yaw: 0 }; // Current rotation
        this.targetRotation = { pitch: 0, yaw: 0 }; // Target rotation from mouse
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.isMouseOver = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Mouse event listeners
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // Initialize stars
        this.initStars();
        
        // Start animation
        this.animate();
    }
    
    /**
     * Initialize N stars with random positions on/near a sphere
     * Each star gets its own rotation axis through the center
     */
    initStars() {
        for (let i = 0; i < this.config.numStars; i++) {
            // Random position on sphere (spherical coordinates)
            const theta = Math.random() * Math.PI * 2; // Azimuth angle
            const phi = Math.acos(1 - 2 * Math.random()); // Polar angle (uniform distribution)
            
            // Add some variation to radius (70% to 130% of sphere radius)
            const radiusVariation = 0.7 + Math.random() * 0.6;
            const r = this.config.sphereRadius * radiusVariation;
            
            // Convert to Cartesian coordinates
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            // Random rotation axis (unit vector through origin)
            const axisTheta = Math.random() * Math.PI * 2;
            const axisPhi = Math.acos(1 - 2 * Math.random());
            const axis = {
                x: Math.sin(axisPhi) * Math.cos(axisTheta),
                y: Math.sin(axisPhi) * Math.sin(axisTheta),
                z: Math.cos(axisPhi)
            };
            
            this.stars.push({
                // Current position
                x, y, z,
                // Personal rotation axis
                axis,
                // Individual properties
                rotationSpeed: this.config.rotationSpeed * (0.5 + Math.random()),
                size: 0.5 + Math.random() * 1.5,
                brightness: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
        this.isMouseOver = true;
        
        // Calculate normalized mouse position (-1 to 1)
        const normalizedX = (this.mousePos.x / this.canvas.width - 0.5) * 2;
        const normalizedY = (this.mousePos.y / this.canvas.height - 0.5) * 2;
        
        // Set target rotation based on mouse position
        // This creates a more intuitive "look at" effect
        this.targetRotation.yaw = normalizedX * 0.5;   // Max 0.5 radians rotation
        this.targetRotation.pitch = normalizedY * 0.3; // Max 0.3 radians rotation
        
        this.lastMousePos.x = this.mousePos.x;
        this.lastMousePos.y = this.mousePos.y;
    }
    
    handleMouseLeave() {
        this.isMouseOver = false;
        // Smoothly return to neutral position
        this.targetRotation.pitch = 0;
        this.targetRotation.yaw = 0;
    }
    
    /**
     * Rotate a point around an arbitrary axis using Rodrigues' rotation formula
     * @param {Object} point - {x, y, z} point to rotate
     * @param {Object} axis - {x, y, z} unit vector axis
     * @param {number} angle - Rotation angle in radians
     * @returns {Object} Rotated point {x, y, z}
     */
    rotateStar(point, axis, angle) {
        // Rodrigues' rotation formula:
        // v_rot = v*cos(θ) + (k×v)*sin(θ) + k*(k·v)*(1-cos(θ))
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const oneMinusCos = 1 - cos;
        
        // Dot product k·v
        const dot = axis.x * point.x + axis.y * point.y + axis.z * point.z;
        
        // Cross product k×v
        const crossX = axis.y * point.z - axis.z * point.y;
        const crossY = axis.z * point.x - axis.x * point.z;
        const crossZ = axis.x * point.y - axis.y * point.x;
        
        return {
            x: point.x * cos + crossX * sin + axis.x * dot * oneMinusCos,
            y: point.y * cos + crossY * sin + axis.y * dot * oneMinusCos,
            z: point.z * cos + crossZ * sin + axis.z * dot * oneMinusCos
        };
    }
    
    /**
     * Apply global rotation for mouse interaction (pitch and yaw)
     * @param {Object} point - {x, y, z} point to rotate
     * @returns {Object} Rotated point {x, y, z}
     */
    applyGlobalRotation(point) {
        // Apply yaw (rotation around Y axis)
        const cosYaw = Math.cos(this.globalRotation.yaw);
        const sinYaw = Math.sin(this.globalRotation.yaw);
        const x1 = point.x * cosYaw - point.z * sinYaw;
        const z1 = point.x * sinYaw + point.z * cosYaw;
        
        // Apply pitch (rotation around X axis)
        const cosPitch = Math.cos(this.globalRotation.pitch);
        const sinPitch = Math.sin(this.globalRotation.pitch);
        const y2 = point.y * cosPitch - z1 * sinPitch;
        const z2 = point.y * sinPitch + z1 * cosPitch;
        
        return { x: x1, y: y2, z: z2 };
    }
    
    /**
     * Project 3D point to 2D screen coordinates with perspective
     * @param {Object} point3D - {x, y, z} point in 3D space
     * @returns {Object} {x, y, size} in screen coordinates
     */
    projectStar(point3D) {
        const d = this.config.cameraDistance;
        
        // Perspective projection formulas
        const scale = 1 / (point3D.z / d + 1);
        const screenX = this.centerX + (point3D.x * scale);
        const screenY = this.centerY + (point3D.y * scale);
        const size = this.config.baseStarSize * scale;
        
        return { x: screenX, y: screenY, size };
    }
    
    /**
     * Draw a single star as a filled circle
     * @param {Object} star - Star object with projected coordinates and properties
     */
    drawStar(star, projected) {
        // Calculate opacity based on z-depth (fade distant stars)
        const depthFade = Math.max(0, Math.min(1, (600 + star.z) / 1200));
        const opacity = star.brightness * depthFade;
        
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#ffffff';
        
        // Draw star as filled circle
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, projected.size * star.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Main animation loop
     */
    animate() {
        // Clear canvas with slight trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Smoothly interpolate rotation towards target
        this.globalRotation.pitch += (this.targetRotation.pitch - this.globalRotation.pitch) * 0.1;
        this.globalRotation.yaw += (this.targetRotation.yaw - this.globalRotation.yaw) * 0.1;
        
        // Process each star
        this.stars.forEach(star => {
            // 1. Rotate star around its personal axis
            const rotatedPosition = this.rotateStar(
                { x: star.x, y: star.y, z: star.z },
                star.axis,
                star.rotationSpeed
            );
            
            // Update star position
            star.x = rotatedPosition.x;
            star.y = rotatedPosition.y;
            star.z = rotatedPosition.z;
            
            // 2. Apply global mouse-controlled rotation
            const globalRotated = this.applyGlobalRotation(rotatedPosition);
            
            // 3. Project to 2D and get screen size
            const projected = this.projectStar(globalRotated);
            
            // 4. Draw the star
            if (projected.x > 0 && projected.x < this.canvas.width &&
                projected.y > 0 && projected.y < this.canvas.height) {
                this.drawStar(star, projected);
            }
        });
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize effects when page loads
window.addEventListener('load', () => {
    // Initialize 3D starfield
    new Starfield3D();
    
    // Initialize star effect for about section
    new StarEffect();
    
    // Initialize lazy loading
    lazyLoadImages();
});