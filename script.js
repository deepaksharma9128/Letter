// Main JavaScript for interactive functionality

// State management
let noClickCount = 0;
let isEscaping = false;

// DOM elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainQuestion = document.getElementById('mainQuestion');
const flashOverlay = document.getElementById('flashOverlay');
const buttonsContainer = document.getElementById('buttonsContainer');

// Initialize floating hearts background
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    if (!heartsContainer) return;
    
    const heartEmojis = ['💖', '💗', '💓', '💞', '💘', '💝', '💕', '🌹'];
    
    // Create 20 floating hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random position
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            heart.style.animationDelay = Math.random() * 8 + 's';
            heart.style.animationDuration = (8 + Math.random() * 4) + 's';
            
            heartsContainer.appendChild(heart);
        }, i * 200);
    }
}

// Flash effect for "No" button
function triggerFlashEffect() {
    flashOverlay.classList.add('active');
    setTimeout(() => {
        flashOverlay.classList.remove('active');
    }, 600);
}

// Get random position within safe bounds
function getRandomPosition() {
    const container = buttonsContainer;
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Safe zone boundaries (avoiding edges)
    const padding = 20;
    const maxX = containerRect.width - btnRect.width - padding;
    const maxY = containerRect.height - btnRect.height - padding;
    
    const x = Math.max(padding, Math.random() * maxX);
    const y = Math.max(padding, Math.random() * maxY);
    
    return { x, y };
}

// Make "No" button escape
function makeNoButtonEscape() {
    if (!isEscaping) {
        isEscaping = true;
        noBtn.classList.add('escaping');
        
        // Expand container height if needed
        buttonsContainer.style.minHeight = '150px';
        buttonsContainer.style.position = 'relative';
    }
    
    const pos = getRandomPosition();
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';
}

// Handle "Yes" button click
function handleYesClick() {
    // Try to open congratulations page in new tab
    const newWindow = window.open('congratulations.html', '_blank');
    
    // Fallback if popup is blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('🎉 Popup blocked! Redirecting to congratulations page...');
        window.location.href = 'congratulations.html';
    }
}

// Handle "No" button click
function handleNoClick(event) {
    event.preventDefault();
    noClickCount++;
    
    if (noClickCount === 1) {
        // First click: Change question and flash
        mainQuestion.innerHTML = '😢 please ek bar soch lo — mar jayega bechara tumhare bina...';
        triggerFlashEffect();
    } else if (noClickCount === 2) {
        // Second click: Behave like Yes button
        handleYesClick();
    } else {
        // Third click and beyond: Make button escape
        makeNoButtonEscape();
    }
}

// Handle "No" button hover/touch for escape behavior
function handleNoButtonHoverTouch() {
    if (noClickCount >= 3) {
        makeNoButtonEscape();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating hearts
    createFloatingHearts();
    
    // Yes button event listener
    yesBtn.addEventListener('click', handleYesClick);
    
    // No button event listeners
    noBtn.addEventListener('click', handleNoClick);
    
    // Escape behavior for desktop (hover) and mobile (touchstart)
    noBtn.addEventListener('mouseenter', handleNoButtonHoverTouch);
    noBtn.addEventListener('touchstart', function(e) {
        if (noClickCount >= 3) {
            e.preventDefault();
            handleNoButtonHoverTouch();
        }
    }, { passive: false });
    
    // Prevent context menu on long press for mobile
    noBtn.addEventListener('contextmenu', function(e) {
        if (noClickCount >= 3) {
            e.preventDefault();
        }
    });
});

// Responsive adjustments
window.addEventListener('resize', function() {
    // Reset escaping button position on resize
    if (isEscaping) {
        makeNoButtonEscape();
    }
});

// Accessibility: Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement === yesBtn) {
            e.preventDefault();
            handleYesClick();
        } else if (focusedElement === noBtn) {
            e.preventDefault();
            handleNoClick(e);
        }
    }
});

// Smooth scrolling for better mobile experience
document.documentElement.style.scrollBehavior = 'smooth';