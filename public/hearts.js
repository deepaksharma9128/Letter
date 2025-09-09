// Hearts animation for congratulations page using Canvas for performance

class FallingHeartsAnimation {
    constructor() {
        this.canvas = document.getElementById('heartsCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        this.heartEmojis = ['💖', '💗', '💓', '💞', '💘', '💝', '💕', '🌹'];
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.start();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createHeart() {
        return {
            x: Math.random() * this.canvas.width,
            y: -50,
            size: 20 + Math.random() * 20, // 20-40px
            speed: 3 + Math.random() * 4, // 3-7px per frame
            emoji: this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.7 + Math.random() * 0.3, // 0.7-1.0
            swayAmount: 1 + Math.random() * 2, // Horizontal sway
            swaySpeed: 0.02 + Math.random() * 0.03
        };
    }
    
    updateHeart(heart) {
        // Update position
        heart.y += heart.speed;
        heart.x += Math.sin(heart.y * heart.swaySpeed) * heart.swayAmount;
        
        // Update rotation
        heart.rotation += heart.rotationSpeed;
        
        // Remove hearts that are off screen
        return heart.y < this.canvas.height + 50;
    }
    
    drawHeart(heart) {
        this.ctx.save();
        
        // Set opacity
        this.ctx.globalAlpha = heart.opacity;
        
        // Move to heart position and rotate
        this.ctx.translate(heart.x, heart.y);
        this.ctx.rotate(heart.rotation);
        
        // Set font size and draw emoji
        this.ctx.font = `${heart.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add subtle shadow for better visibility
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        
        this.ctx.fillText(heart.emoji, 0, 0);
        
        this.ctx.restore();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create new hearts (high density: 80-300 at once)
        if (this.hearts.length < 200 && Math.random() < 0.8) {
            // Create 1-3 hearts per frame for high density
            const heartsToCreate = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < heartsToCreate; i++) {
                this.hearts.push(this.createHeart());
            }
        }
        
        // Update and draw hearts
        this.hearts = this.hearts.filter(heart => {
            const isVisible = this.updateHeart(heart);
            if (isVisible) {
                this.drawHeart(heart);
            }
            return isVisible;
        });
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
}

// Initialize animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only start animation if we're on the congratulations page
    if (document.querySelector('.congratulations-page')) {
        const animation = new FallingHeartsAnimation();
        
        // Optional: Stop animation when page is hidden (for performance)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                animation.stop();
            } else {
                animation.start();
            }
        });
    }
});

// Alternative text-based hearts fallback for very old browsers
function createTextBasedHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    
    document.body.appendChild(heartsContainer);
    
    const heartEmojis = ['💖', '💗', '💓', '💞', '💘', '💝', '💕', '🌹'];
    
    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 20}px;
            left: ${Math.random() * 100}%;
            top: -50px;
            opacity: ${0.7 + Math.random() * 0.3};
            animation: fallDown ${3 + Math.random() * 4}s linear forwards;
            pointer-events: none;
        `;
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 7000);
    }
    
    // Create hearts continuously
    const heartInterval = setInterval(createFallingHeart, 200);
    
    // Add CSS animation for falling
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fallDown {
            to {
                transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    return heartInterval;
}

// Fallback for browsers that don't support Canvas
if (!document.getElementById('heartsCanvas') || 
    !document.getElementById('heartsCanvas').getContext) {
    
    document.addEventListener('DOMContentLoaded', function() {
        if (document.querySelector('.congratulations-page')) {
            createTextBasedHearts();
        }
    });
}

