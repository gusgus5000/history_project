// ========================================
// Revolutionary War History Website
// Interactive JavaScript
// ========================================

'use strict';

// ========================================
// COPY-PASTE PREVENTION
// ========================================

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
});

// Disable text selection
document.addEventListener('selectstart', function(event) {
    event.preventDefault();
    return false;
});

// Disable copy, cut, and paste
document.addEventListener('copy', function(event) {
    event.preventDefault();
    return false;
});

document.addEventListener('cut', function(event) {
    event.preventDefault();
    return false;
});

document.addEventListener('paste', function(event) {
    event.preventDefault();
    return false;
});

// Disable keyboard shortcuts for copying (educational copy protection)
document.addEventListener('keydown', function(event) {
    // Disable Ctrl+C, Ctrl+X, Ctrl+A (Windows/Linux)
    if (event.ctrlKey && (event.key === 'c' || event.key === 'x' || event.key === 'a')) {
        event.preventDefault();
        return false;
    }

    // Disable Cmd+C, Cmd+X, Cmd+A (Mac)
    if (event.metaKey && (event.key === 'c' || event.key === 'x' || event.key === 'a')) {
        event.preventDefault();
        return false;
    }
});

// Disable drag selection
document.addEventListener('mousedown', function(event) {
    if (event.detail > 1) {
        event.preventDefault();
        return false;
    }
});

// Make all text unselectable via CSS (additional layer)
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';
document.body.style.msUserSelect = 'none';
document.body.style.mozUserSelect = 'none';

// ========================================
// TIMELINE CARD INTERACTIONS
// ========================================

class TimelineCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.timeline-card');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            this.setupCardInteraction(card);
            this.setupIntersectionObserver(card);
        });
    }

    setupCardInteraction(card) {
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        const collapseHint = card.querySelector('.collapse-hint');

        // Click handler for expanding card
        if (cardFront) {
            cardFront.addEventListener('click', () => {
                this.toggleCard(card, true);
            });

            // Keyboard accessibility
            cardFront.setAttribute('tabindex', '0');
            cardFront.setAttribute('role', 'button');
            cardFront.setAttribute('aria-expanded', 'false');

            cardFront.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.toggleCard(card, true);
                }
            });
        }

        // Click handler for collapsing card
        if (collapseHint) {
            collapseHint.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleCard(card, false);
            });

            // Keyboard accessibility
            collapseHint.setAttribute('tabindex', '0');
            collapseHint.setAttribute('role', 'button');

            collapseHint.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.toggleCard(card, false);
                }
            });
        }
    }

    toggleCard(card, expand) {
        const cardFront = card.querySelector('.card-front');

        if (expand) {
            // Close all other cards first (optional - creates accordion effect)
            this.cards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    this.toggleCard(otherCard, false);
                }
            });

            // Expand this card
            card.classList.add('expanded');
            if (cardFront) {
                cardFront.setAttribute('aria-expanded', 'true');
            }

            // Smooth scroll to card
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);

            // Add expand animation class
            const cardBack = card.querySelector('.card-back');
            if (cardBack) {
                cardBack.style.animation = 'expandCard 0.6s ease forwards';
            }
        } else {
            // Collapse card
            card.classList.remove('expanded');
            if (cardFront) {
                cardFront.setAttribute('aria-expanded', 'false');
            }
        }
    }

    setupIntersectionObserver(card) {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        observer.observe(card);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        // Parallax effect for timeline line
        window.addEventListener('scroll', () => {
            this.updateTimelineProgress();
        });

        // Initial check
        this.updateTimelineProgress();
    }

    updateTimelineProgress() {
        const timelineLine = document.querySelector('.timeline-line');
        if (!timelineLine) return;

        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        // Add glow effect based on scroll
        const glowIntensity = Math.min(scrollPercentage / 100, 1);
        timelineLine.style.boxShadow = `0 0 ${10 + glowIntensity * 20}px rgba(139, 46, 46, ${0.3 + glowIntensity * 0.4})`;
    }
}

// ========================================
// SMOOTH SCROLL TO TOP
// ========================================

class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Enable smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// ACCESSIBILITY FEATURES
// ========================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Add skip to main content link
        this.addSkipLink();

        // Enhance keyboard navigation
        this.enhanceKeyboardNav();

        // Add ARIA labels dynamically
        this.addAriaLabels();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--burgundy);
            color: var(--parchment-light);
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNav() {
        // Add visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 3px solid var(--burgundy);
                outline-offset: 3px;
            }

            .skip-link:focus {
                outline: 3px solid var(--parchment-light);
            }
        `;
        document.head.appendChild(style);
    }

    addAriaLabels() {
        const header = document.querySelector('.main-header');
        if (header) {
            header.setAttribute('role', 'banner');
        }

        const footer = document.querySelector('.main-footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }

        const timeline = document.querySelector('.timeline-container');
        if (timeline) {
            timeline.setAttribute('role', 'main');
            timeline.id = 'main-content';
            timeline.setAttribute('aria-label', 'Timeline of events leading to the American Revolution');
        }
    }
}

// ========================================
// LOADING ANIMATION
// ========================================

class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Add fade-in effect on page load
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        });
    }
}

// ========================================
// EASTER EGG - Console Message
// ========================================

function displayConsoleMessage() {
    const styles = [
        'color: #8b2e2e',
        'font-size: 16px',
        'font-weight: bold',
        'font-family: Cinzel, serif'
    ].join(';');

    console.log('%c🎓 Welcome, History Student!', styles);
    console.log('%cThis website is protected against copying to encourage learning and original work.', 'color: #4a3728; font-size: 12px;');
    console.log('%cIf you want to learn more about the American Revolution, read the content and take notes!', 'color: #6b5344; font-size: 12px;');
}

// ========================================
// INITIALIZE ALL FEATURES
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const cardManager = new TimelineCardManager();
    const scrollManager = new ScrollAnimationManager();
    const smoothScrollManager = new SmoothScrollManager();
    const accessibilityManager = new AccessibilityManager();
    const loadingManager = new LoadingManager();

    // Display console message
    displayConsoleMessage();

    // Add additional CSS animations
    addDynamicStyles();

    console.log('%c✅ Revolutionary War Timeline Loaded Successfully', 'color: green; font-weight: bold;');
});

// ========================================
// DYNAMIC STYLES
// ========================================

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes expandCard {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .timeline-card.visible {
            animation: fadeInUp 0.8s ease forwards;
        }

        /* Additional hover effects */
        .card-marker:hover {
            transform: translateX(-50%) scale(1.1);
            transition: transform 0.3s ease;
        }

        /* Loading state */
        .timeline-card:not(.visible) {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// EDUCATIONAL COPY PROTECTION NOTE
// ========================================

// This website uses copy protection to encourage students to:
// - Read and understand the content
// - Take their own notes
// - Engage with the material actively
// - Develop critical thinking skills
//
// The protection is designed to promote learning, not to hide information.
// Teachers and students can always view the source code for educational purposes.

// ========================================
// PERFORMANCE MONITORING
// ========================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%c📊 Page Load Time: ${pageLoadTime}ms`, 'color: #c9a961; font-weight: bold;');
        }, 0);
    });
}
