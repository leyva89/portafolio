// ===================================
// DOM Elements
// ===================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');
const skillsCarousel = document.getElementById('skillsCarousel');
const skillsPrev = document.getElementById('skillsPrev');
const skillsNext = document.getElementById('skillsNext');
const projectsCarousel = document.getElementById('projectsCarousel');
const projectsPrev = document.getElementById('projectsPrev');
const projectsNext = document.getElementById('projectsNext');
const projectDots = document.querySelectorAll('.project-dot');

// ===================================
// Mobile Menu Toggle
// ===================================
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ===================================
// Navbar Scroll Effect
// ===================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background on scroll
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Skills Carousel Logic
// ===================================
let skillsCurrentIndex = 0;
let skillsAutoScrollInterval;

// Calculate how many cards are visible
function getVisibleSkillsCards() {
    const containerWidth = document.querySelector('.skills-carousel-container').offsetWidth;
    const cardWidth = 256 + 32; // card width + gap
    return Math.floor(containerWidth / cardWidth);
}

// Get total number of skill cards
function getTotalSkillsCards() {
    return document.querySelectorAll('.skill-card').length;
}

// Update skills carousel position
function updateSkillsCarousel() {
    const cardWidth = 256 + 32; // card width + gap
    const offset = -skillsCurrentIndex * cardWidth;
    skillsCarousel.style.transform = `translateX(${offset}px)`;
}

// Skills Next Button
skillsNext.addEventListener('click', () => {
    const visibleCards = getVisibleSkillsCards();
    const totalCards = getTotalSkillsCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    
    if (skillsCurrentIndex < maxIndex) {
        skillsCurrentIndex++;
        updateSkillsCarousel();
    } else {
        // Loop back to start
        skillsCurrentIndex = 0;
        updateSkillsCarousel();
    }
    resetSkillsAutoScroll();
});

// Skills Previous Button
skillsPrev.addEventListener('click', () => {
    if (skillsCurrentIndex > 0) {
        skillsCurrentIndex--;
        updateSkillsCarousel();
    } else {
        // Loop to end
        const visibleCards = getVisibleSkillsCards();
        const totalCards = getTotalSkillsCards();
        skillsCurrentIndex = Math.max(0, totalCards - visibleCards);
        updateSkillsCarousel();
    }
    resetSkillsAutoScroll();
});

// Auto-scroll for skills carousel
function startSkillsAutoScroll() {
    skillsAutoScrollInterval = setInterval(() => {
        const visibleCards = getVisibleSkillsCards();
        const totalCards = getTotalSkillsCards();
        const maxIndex = Math.max(0, totalCards - visibleCards);
        
        if (skillsCurrentIndex < maxIndex) {
            skillsCurrentIndex++;
        } else {
            skillsCurrentIndex = 0;
        }
        updateSkillsCarousel();
    }, 3000); // Auto-scroll every 3 seconds
}

function resetSkillsAutoScroll() {
    clearInterval(skillsAutoScrollInterval);
    startSkillsAutoScroll();
}

// Start auto-scroll on page load
startSkillsAutoScroll();

// Pause auto-scroll on hover
document.querySelector('.skills-carousel-container').addEventListener('mouseenter', () => {
    clearInterval(skillsAutoScrollInterval);
});

document.querySelector('.skills-carousel-container').addEventListener('mouseleave', () => {
    startSkillsAutoScroll();
});

// ===================================
// Projects Carousel Logic
// ===================================
let projectsCurrentIndex = 0;

// Update projects carousel position
function updateProjectsCarousel(animate = true) {
    const offset = -projectsCurrentIndex * 100;
    if (animate) {
        projectsCarousel.style.transition = 'transform 0.5s ease-in-out';
    } else {
        projectsCarousel.style.transition = 'none';
    }
    projectsCarousel.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    projectDots.forEach((dot, index) => {
        if (index === projectsCurrentIndex) {
            dot.classList.add('active');
            dot.classList.remove('bg-gray-600');
            dot.classList.add('bg-amber-500');
        } else {
            dot.classList.remove('active');
            dot.classList.remove('bg-amber-500');
            dot.classList.add('bg-gray-600');
        }
    });
}

// Projects Next Button
projectsNext.addEventListener('click', () => {
    const totalProjects = document.querySelectorAll('.project-card').length;
    if (projectsCurrentIndex < totalProjects - 1) {
        projectsCurrentIndex++;
    } else {
        projectsCurrentIndex = 0;
    }
    updateProjectsCarousel();
});

// Projects Previous Button
projectsPrev.addEventListener('click', () => {
    const totalProjects = document.querySelectorAll('.project-card').length;
    if (projectsCurrentIndex > 0) {
        projectsCurrentIndex--;
    } else {
        projectsCurrentIndex = totalProjects - 1;
    }
    updateProjectsCarousel();
});

// Dot Navigation
projectDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        projectsCurrentIndex = index;
        updateProjectsCarousel();
    });
});

// Touch/Swipe Support for Projects Carousel
let touchStartX = 0;
let touchEndX = 0;

projectsCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

projectsCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next project
            projectsNext.click();
        } else {
            // Swipe right - previous project
            projectsPrev.click();
        }
    }
}

// Keyboard Navigation for Projects
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        projectsPrev.click();
    } else if (e.key === 'ArrowRight') {
        projectsNext.click();
    }
});

// ===================================
// Intersection Observer for Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal', 'active');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe cards
document.querySelectorAll('.card-hover').forEach(card => {
    observer.observe(card);
});

// ===================================
// Parallax Effect for Hero Section
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('#home');
    
    if (heroSection && scrolled < window.innerHeight) {
        const parallaxElements = heroSection.querySelectorAll('.animate-fade-in');
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// ===================================
// Dynamic Year for Footer
// ===================================
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('footer p');
if (yearElement) {
    yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
}

// ===================================
// Add Active State to Navigation Links
// ===================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-amber-500');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('text-amber-500');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// Preloader (Optional)
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('#home .animate-fade-in');
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            heroContent.style.opacity = '1';
        }, 100);
    }
});

// ===================================
// Performance: Debounce Resize Events
// ===================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateSkillsCarousel();
        updateProjectsCarousel(false);
    }, 250);
});

// ===================================
// easter egg: Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'gradientShift 2s ease infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===================================
// Console Message
// ===================================
console.log('%c¡Hola Desarrollador! 🦁', 'color: #f59e0b; font-size: 24px; font-weight: bold;');
console.log('%cGracias por visitar mi portafolio. Si te gusta lo que ves, ¡contáctame!', 'color: #fbbf24; font-size: 14px;');
console.log('%c🐾 Hecho con pasión y código elegante', 'color: #94a3b8; font-size: 12px; font-style: italic;');

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial carousel positions
    updateSkillsCarousel();
    updateProjectsCarousel(false);
    
    // Add initial fade-in to sections
    setTimeout(() => {
        document.querySelectorAll('section').forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }, 100);
});
