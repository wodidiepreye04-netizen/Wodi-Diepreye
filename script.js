// ========================================
// GOOGLE SHEETS WEB APP URL
// ========================================
// Replace this with your actual Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzUlpKRCgb2zoGDD1AbjnkIJOXHzizCzDcK4Hq4xPD3r4GkQ7q88wlXaXZZZkVnmN6L/exec';

// ========================================
// DOM ELEMENTS
// ========================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitButton = contactForm.querySelector('.submit-button');
const buttonText = submitButton.querySelector('.button-text');
const buttonLoader = submitButton.querySelector('.button-loader');

// ========================================
// FORM SUBMISSION HANDLER
// ========================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        project: document.getElementById('project').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.project) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Send data to Google Sheets via Web App
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors mode
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Since we're using no-cors mode, we can't read the response
        // We'll assume success if no error is thrown
        showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);

    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Something went wrong. Please try again or contact me directly.', 'error');
    } finally {
        setLoadingState(false);
    }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Show form message with type (success or error)
 */
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

/**
 * Hide form message
 */
function hideMessage() {
    formMessage.style.display = 'none';
}

/**
 * Set loading state for submit button
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
    } else {
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

// ========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in effect
document.querySelectorAll('.about, .contact').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

// ========================================
// MOBILE MENU TOGGLE (Future Enhancement)
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}
