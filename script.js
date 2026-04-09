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
document.querySelectorAll('.work, .about, .contact').forEach(section => {
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

// ========================================
// LEAD MAGNET POPUP (PDF Download)
// ========================================
(function () {
    const modal = document.getElementById('leadMagnetModal');
    const closeBtn = document.getElementById('closeModal');
    const leadForm = document.getElementById('leadMagnetForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const popupSubmitBtn = document.getElementById('popupSubmitBtn');

    if (!modal) return;

    const STORAGE_KEY = 'leadPopupDismissed';
    const DISMISS_DAYS = 7; // Show again after 7 days

    // Check if popup was already dismissed recently
    function wasRecentlyDismissed() {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) return false;
        const dismissDate = new Date(parseInt(dismissed));
        const now = new Date();
        const diffDays = (now - dismissDate) / (1000 * 60 * 60 * 24);
        return diffDays < DISMISS_DAYS;
    }

    function markDismissed() {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }

    // Show the popup
    function showPopup() {
        if (wasRecentlyDismissed()) return;
        modal.style.display = 'flex';
        // Trigger reflow for animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    // Close the popup
    function closePopup() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
        markDismissed();
    }

    // Close button click
    closeBtn.addEventListener('click', closePopup);

    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePopup();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePopup();
        }
    });

    // ---- COUNTRY SELECTOR LOGIC ----
    const countrySelector = document.getElementById('countrySelector');
    const countryFlag = document.getElementById('countryFlag');
    const countryCode = document.getElementById('countryCode');
    const countryDropdown = document.getElementById('countryDropdown');
    const countrySearch = document.getElementById('countrySearch');
    const countryList = document.getElementById('countryList');

    const countries = [
        { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
        { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
        { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
        { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
        { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
        { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
        { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
        { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
        { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
        { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
        { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
        { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
        // Add more popular ones or a full list if needed
    ].sort((a, b) => a.name.localeCompare(b.name));

    function populateCountryList(filter = '') {
        countryList.innerHTML = '';
        const filtered = countries.filter(c => 
            c.name.toLowerCase().includes(filter.toLowerCase()) || 
            c.dial.includes(filter)
        );

        filtered.forEach(country => {
            const li = document.createElement('li');
            li.className = 'country-option';
            li.innerHTML = `
                <span class="flag">${country.flag}</span>
                <span class="name">${country.name}</span>
                <span class="dial-code">${country.dial}</span>
            `;
            li.addEventListener('click', () => {
                countryFlag.textContent = country.flag;
                countryCode.textContent = country.dial;
                countryDropdown.classList.remove('active');
            });
            countryList.appendChild(li);
        });
    }

    countrySelector?.addEventListener('click', (e) => {
        e.stopPropagation();
        countryDropdown.classList.toggle('active');
        if (countryDropdown.classList.contains('active')) {
            countrySearch.focus();
            populateCountryList();
        }
    });

    countrySearch?.addEventListener('input', (e) => {
        populateCountryList(e.target.value);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!countrySelector.contains(e.target) && !countryDropdown.contains(e.target)) {
            countryDropdown.classList.remove('active');
        }
    });

    // Trigger PDF download
    function triggerPdfDownload() {
        const link = document.createElement('a');
        link.href = '4-step message framework.pdf';
        link.download = '4-Step Message Framework - Wodi Diepreye.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Form submission handler
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('popupEmail').value.trim();
        const fname = document.getElementById('popupFname').value.trim();
        const phoneRaw = document.getElementById('popupPhone').value.trim();
        const dialCode = countryCode.textContent;
        
        if (!email) return;

        // Combine dial code and phone number
        const fullPhone = phoneRaw ? `${dialCode}${phoneRaw.replace(/\s+/g, '')}` : '';

        // Show loading state
        const btnText = popupSubmitBtn.querySelector('.popup-btn-text');
        const btnLoader = popupSubmitBtn.querySelector('.popup-btn-loader');
        popupSubmitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        // 1. Submit to Mailchimp audience list (via JSONP to bypass CORS)
        try {
            // Updated URL with extra fields
            let mailchimpUrl = `https://gmail.us18.list-manage.com/subscribe/post-json?u=f0c61ca82eaa7e55cd03bf1f1&id=97327f05b0&f_id=00bdb7e6f0&EMAIL=${encodeURIComponent(email)}&FNAME=${encodeURIComponent(fname)}&PHONE=${encodeURIComponent(fullPhone)}&c=mailchimpCallback`;
            
            // Create a global callback for JSONP
            window.mailchimpCallback = function(response) {
                if (response.result === 'success') {
                    console.log('Mailchimp subscription successful');
                } else {
                    console.log('Mailchimp response:', response.msg);
                }
                delete window.mailchimpCallback;
            };
            
            const script = document.createElement('script');
            script.src = mailchimpUrl;
            document.body.appendChild(script);
            script.onload = () => document.body.removeChild(script);
            script.onerror = () => document.body.removeChild(script);
        } catch (err) {
            console.error('Mailchimp subscription error:', err);
        }

        // 2. Also save to Google Sheets as backup
        try {
            await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fname || 'Subscriber',
                    email: email,
                    project: `[Lead Magnet] Downloaded PDF. Phone: ${fullPhone}`,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (err) {
            console.error('Google Sheets tracking error:', err);
        }

        // Show success state
        leadForm.style.display = 'none';
        const modalContainer = document.querySelector('#leadMagnetModal .modal-container');
        modalContainer.querySelector('.modal-title').style.display = 'none';
        modalContainer.querySelector('.modal-text').style.display = 'none';
        modalContainer.querySelector('.modal-icon').style.display = 'none';
        modalSuccess.style.display = 'block';

        // Trigger the PDF download
        triggerPdfDownload();

        // Mark as dismissed
        markDismissed();
    });

    // ---- POPUP TRIGGERS ----

    // 1. Timed trigger: show after 1 second
    let popupShown = false;
    setTimeout(() => {
        if (!popupShown && !wasRecentlyDismissed()) {
            showPopup();
            popupShown = true;
        }
    }, 1000);

    // 2. Exit intent trigger (mouse leaves viewport at top)
    document.addEventListener('mouseout', (e) => {
        if (!popupShown && !wasRecentlyDismissed() && e.clientY <= 0) {
            showPopup();
            popupShown = true;
        }
    });

})();
