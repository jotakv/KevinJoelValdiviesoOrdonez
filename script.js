// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on user preference
document.documentElement.setAttribute('data-theme', 
    localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light')
);

// Update theme icon
function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
}

updateThemeIcon();

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 64;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Scroll Progress Bar
const progressBar = document.querySelector('.progress-bar');

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// Active Section Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-list a');

const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '-64px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Skill Progress Bars Animation
function initializeProgressBars() {
    const progressLines = document.querySelectorAll('.progress-line');
    progressLines.forEach(line => {
        const percent = line.getAttribute('data-percent');
        line.style.setProperty('--percent', percent + '%');
        line.style.width = '0%';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    line.style.width = percent + '%';
                    observer.unobserve(line);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(line);
    });
}

// Language Progress Circles Animation
function initializeProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    
    circles.forEach(circle => {
        const percent = parseInt(circle.getAttribute('data-percent'));
        const path = circle.querySelector('path');
        const circumference = path.getTotalLength();
        
        path.style.strokeDasharray = `${circumference} ${circumference}`;
        path.style.strokeDashoffset = circumference;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const offset = circumference - (percent / 100 * circumference);
                    path.style.strokeDashoffset = offset;
                    observer.unobserve(circle);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(circle);
    });
}

// Form Validation
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length === 0) {
        // Form is valid, you can submit it here
        alert('Message sent successfully!');
        contactForm.reset();
    } else {
        displayFormErrors(errors);
    }
});

function validateForm(formData) {
    const errors = {};
    
    const email = formData.get('email');
    const name = formData.get('name');
    const message = formData.get('message');
    
    if (!name || name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!email || !isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!message || message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Display new error messages
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.querySelector(`[name="${field}"]`);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProgressBars();
    initializeProgressCircles();
});

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});