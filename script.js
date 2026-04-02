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
    const sections = document.querySelectorAll('.work, .contact');
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
        this.time = 0;

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
                brightness: 0.5 + Math.random() * 0.5,
                // Twinkle properties
                twinkleSpeed: 0.034 + Math.random() * 0.134, // cycles per second (varied per star)
                twinklePhase: Math.random() * Math.PI * 2, // random starting phase
                twinkleAmount: 0.2 + Math.random() * 0.4, // how much brightness varies (20-60%)
                // Star color temperature (weighted toward white)
                color: (() => {
                    const colors = [
                        { r: 255, g: 255, b: 255 }, // white
                        { r: 255, g: 255, b: 255 }, // white (extra weight)
                        { r: 200, g: 220, b: 255 }, // pale blue (hot)
                        { r: 255, g: 240, b: 200 }, // soft gold (warm)
                        { r: 255, g: 210, b: 200 }, // faint red (cool)
                        { r: 220, g: 230, b: 255 }, // light blue-white
                    ];
                    return colors[Math.floor(Math.random() * colors.length)];
                })()
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
        // Apply twinkle: sine wave oscillates brightness around its base value
        const twinkle = 1 - star.twinkleAmount * (0.5 + 0.5 * Math.sin(this.time * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase));
        const opacity = star.brightness * depthFade * twinkle;
        
        this.ctx.save();

        const radius = projected.size * star.size;
        const glowRadius = radius * 3;

        // Draw soft glow halo
        const glow = this.ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, glowRadius
        );
        const { r, g, b } = star.color;
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.2})`);
        glow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity * 0.05})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw bright core
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * Main animation loop
     */
    animate() {
        // Track time for twinkle animation
        this.time += 1 / 60; // approximate seconds at 60fps

        // Full clear each frame for crisp rendering
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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

// Code Grab Modal
class CodeGrabModal {
    constructor() {
        this.modal = document.getElementById('codeModal');
        this.openBtn = document.getElementById('codeGrabBtn');
        this.closeBtn = document.getElementById('codeModalClose');
        this.copyBtn = document.getElementById('codeCopyBtn');
        this.downloadBtn = document.getElementById('codeDownloadBtn');
        this.codeContent = document.getElementById('codeContent');
        this.tabs = document.querySelectorAll('.code-tab');
        this.activeTab = 'standalone';

        if (!this.modal) return;
        this.init();
    }

    init() {
        this.openBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        this.copyBtn.addEventListener('click', () => this.copy());
        this.downloadBtn.addEventListener('click', () => this.download());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open() {
        this.modal.classList.add('active');
        this.showCode(this.activeTab);
    }

    close() {
        this.modal.classList.remove('active');
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        this.showCode(tab);
    }

    getStandaloneCode() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>3D Starfield Effect</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #000; overflow: hidden; }
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
</head>
<body>
<canvas id="starfield3d"></canvas>
<script>
${this.getJSCode()}
<\\/script>
</body>
</html>`;
    }

    getJSCode() {
        return `class Starfield3D {
  constructor(canvasId = 'starfield3d') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.config = {
      numStars: 150,
      sphereRadius: 600,
      cameraDistance: 800,
      baseStarSize: 2,
      rotationSpeed: 0.0003,
      mouseInfluence: 0.003,
      mouseDamping: 0.95
    };
    this.stars = [];
    this.globalRotation = { pitch: 0, yaw: 0 };
    this.targetRotation = { pitch: 0, yaw: 0 };
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.isMouseOver = false;
    this.time = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.initStars();
    this.animate();
  }

  initStars() {
    const colors = [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 200, g: 220, b: 255 },
      { r: 255, g: 240, b: 200 },
      { r: 255, g: 210, b: 200 },
      { r: 220, g: 230, b: 255 },
    ];
    for (let i = 0; i < this.config.numStars; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const r = this.config.sphereRadius * (0.7 + Math.random() * 0.6);
      const axisTheta = Math.random() * Math.PI * 2;
      const axisPhi = Math.acos(1 - 2 * Math.random());
      this.stars.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        axis: {
          x: Math.sin(axisPhi) * Math.cos(axisTheta),
          y: Math.sin(axisPhi) * Math.sin(axisTheta),
          z: Math.cos(axisPhi)
        },
        rotationSpeed: this.config.rotationSpeed * (0.5 + Math.random()),
        size: 0.5 + Math.random() * 1.5,
        brightness: 0.5 + Math.random() * 0.5,
        twinkleSpeed: 0.034 + Math.random() * 0.134,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleAmount: 0.2 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
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
    const x = (((e.clientX - rect.left) / this.canvas.width) - 0.5) * 2;
    const y = (((e.clientY - rect.top) / this.canvas.height) - 0.5) * 2;
    this.targetRotation.yaw = x * 0.5;
    this.targetRotation.pitch = y * 0.3;
    this.isMouseOver = true;
  }

  handleMouseLeave() {
    this.isMouseOver = false;
    this.targetRotation.pitch = 0;
    this.targetRotation.yaw = 0;
  }

  rotateStar(p, axis, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const dot = axis.x*p.x + axis.y*p.y + axis.z*p.z;
    const cx = axis.y*p.z - axis.z*p.y;
    const cy = axis.z*p.x - axis.x*p.z;
    const cz = axis.x*p.y - axis.y*p.x;
    return {
      x: p.x*cos + cx*sin + axis.x*dot*(1-cos),
      y: p.y*cos + cy*sin + axis.y*dot*(1-cos),
      z: p.z*cos + cz*sin + axis.z*dot*(1-cos)
    };
  }

  applyGlobalRotation(p) {
    const cy = Math.cos(this.globalRotation.yaw), sy = Math.sin(this.globalRotation.yaw);
    const x1 = p.x*cy - p.z*sy, z1 = p.x*sy + p.z*cy;
    const cp = Math.cos(this.globalRotation.pitch), sp = Math.sin(this.globalRotation.pitch);
    return { x: x1, y: p.y*cp - z1*sp, z: p.y*sp + z1*cp };
  }

  animate() {
    this.time += 1/60;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.globalRotation.pitch += (this.targetRotation.pitch - this.globalRotation.pitch) * 0.1;
    this.globalRotation.yaw += (this.targetRotation.yaw - this.globalRotation.yaw) * 0.1;
    const d = this.config.cameraDistance;
    this.stars.forEach(star => {
      const rot = this.rotateStar(star, star.axis, star.rotationSpeed);
      star.x = rot.x; star.y = rot.y; star.z = rot.z;
      const gr = this.applyGlobalRotation(rot);
      const scale = 1 / (gr.z / d + 1);
      const sx = this.centerX + gr.x * scale;
      const sy = this.centerY + gr.y * scale;
      const sz = this.config.baseStarSize * scale;
      if (sx < 0 || sx > this.canvas.width || sy < 0 || sy > this.canvas.height) return;
      const depthFade = Math.max(0, Math.min(1, (600 + star.z) / 1200));
      const twinkle = 1 - star.twinkleAmount * (0.5 + 0.5 * Math.sin(this.time * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase));
      const opacity = star.brightness * depthFade * twinkle;
      const { r, g, b } = star.color;
      const radius = sz * star.size;
      const glowR = radius * 3;
      this.ctx.save();
      const glow = this.ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      glow.addColorStop(0, \`rgba(\${r},\${g},\${b},\${opacity*0.2})\`);
      glow.addColorStop(0.3, \`rgba(\${r},\${g},\${b},\${opacity*0.05})\`);
      glow.addColorStop(1, \`rgba(\${r},\${g},\${b},0)\`);
      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, glowR, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, radius, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.restore();
    });
    requestAnimationFrame(() => this.animate());
  }
}

new Starfield3D();`;
    }

    getCSSCode() {
        return `/* 3D Starfield — add a <canvas id="starfield3d"> to your HTML */
.starfield-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  overflow: hidden;
}

.starfield-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Place your content inside with z-index: 2 to sit above the stars */
.starfield-content {
  position: relative;
  z-index: 2;
}`;
    }

    showCode(tab) {
        let code = '';
        if (tab === 'standalone') code = this.getStandaloneCode();
        else if (tab === 'js') code = this.getJSCode();
        else if (tab === 'css') code = this.getCSSCode();
        this.codeContent.textContent = code;
    }

    copy() {
        navigator.clipboard.writeText(this.codeContent.textContent).then(() => {
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => { this.copyBtn.textContent = 'Copy Code'; }, 2000);
        });
    }

    download() {
        const code = this.codeContent.textContent;
        let filename, type;
        if (this.activeTab === 'standalone') {
            filename = 'starfield-effect.html';
            type = 'text/html';
        } else if (this.activeTab === 'js') {
            filename = 'starfield-effect.js';
            type = 'text/javascript';
        } else {
            filename = 'starfield-effect.css';
            type = 'text/css';
        }
        const blob = new Blob([code], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize effects when page loads
window.addEventListener('load', () => {
    // Initialize 3D starfield
    new Starfield3D();

    // Initialize code grab modal
    new CodeGrabModal();
});