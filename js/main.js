// DC Canopy Duct Fan Clean — Main JS
// Production-ready with error handling and safeguards

'use strict';

// Error logging utility
const ErrorLogger = {
  log: function(error, context = '') {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${context}: ${error.message || error}`;
    console.error(message);
    // Can be extended to send to server in production
  }
};

document.addEventListener('DOMContentLoaded', function () {
  try {
    initializeApp();
  } catch (error) {
    ErrorLogger.log(error, 'App Initialization Failed');
  }
});

function initializeApp() {
  // ===== LAZY LOAD BACKGROUND IMAGES =====
  try {
    const heroBgImg = document.getElementById('hero')?.querySelector('.hero-bg-img');
    if (heroBgImg) {
      const img = new Image();
      img.onload = () => {
        try {
          heroBgImg.classList.add('loaded');
          console.log('Hero background loaded successfully');
        } catch (error) {
          ErrorLogger.log(error, 'Hero Background Loading Error');
        }
      };
      img.onerror = () => {
        console.warn('Failed to load hero background image');
      };
      img.src = 'images/BANNER.png';
    }
  } catch (error) {
    ErrorLogger.log(error, 'Background Image Lazy Load Setup Failed');
  }

  // ===== NAVBAR =====
  try {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
      console.warn('Navbar element not found');
      return;
    }

    function updateNavbar() {
      try {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
          navbar.classList.remove('transparent');
        } else {
          navbar.classList.remove('scrolled');
          navbar.classList.add('transparent');
        }
      } catch (error) {
        ErrorLogger.log(error, 'Navbar Update Error');
      }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
  } catch (error) {
    ErrorLogger.log(error, 'Navbar Initialization Failed');
  }


  // Active nav link based on scroll
  try {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
      try {
        let current = '';
        sections.forEach(section => {
          const top = section?.offsetTop - 120;
          if (window.scrollY >= top) {
            current = section?.getAttribute('id') || '';
          }
        });
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link?.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
      } catch (error) {
        ErrorLogger.log(error, 'Active Link Update Error');
      }
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  } catch (error) {
    ErrorLogger.log(error, 'Nav Links Initialization Failed');
  }


  // ===== HAMBURGER / MOBILE MENU =====
  try {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = mobileMenu?.querySelector('.close-btn');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        try {
          hamburger.classList.toggle('active');
          mobileMenu.classList.toggle('open');
          document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        } catch (error) {
          ErrorLogger.log(error, 'Hamburger Click Error');
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          try {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
          } catch (error) {
            ErrorLogger.log(error, 'Close Menu Error');
          }
        });
      }

      mobileMenu.querySelectorAll('a').forEach(link => {
        link?.addEventListener('click', () => {
          try {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
          } catch (error) {
            ErrorLogger.log(error, 'Menu Link Click Error');
          }
        });
      });
    }
  } catch (error) {
    ErrorLogger.log(error, 'Mobile Menu Initialization Failed');
  }

  // ===== CONTACT FORM =====
  try {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
      console.warn('Contact form element not found');
    } else {
      // Rate limiting for form submissions
      let lastSubmitTime = 0;
      const MIN_SUBMIT_INTERVAL = 3000; // 3 seconds minimum between submissions

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
          // Rate limiting check
          const now = Date.now();
          if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
            console.warn('Form submission throttled - too many requests');
            return;
          }
          lastSubmitTime = now;

          // Validate form
          if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
          }

          // Verify all required fields
          const name = contactForm.querySelector('[name="name"]')?.value?.trim();
          const phone = contactForm.querySelector('[name="phone"]')?.value?.trim();
          const email = contactForm.querySelector('[name="email"]')?.value?.trim();

          if (!name || !phone || !email) {
            console.error('Required fields are empty');
            const errorEl = contactForm.querySelector('#form-error');
            if (errorEl) {
              errorEl.textContent = 'Please fill in all required fields.';
              errorEl.style.display = 'flex';
              setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
            }
            return;
          }

          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            console.error('Invalid email format');
            const errorEl = contactForm.querySelector('#form-error');
            if (errorEl) {
              errorEl.textContent = 'Please enter a valid email address.';
              errorEl.style.display = 'flex';
              setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
            }
            return;
          }

          const success = contactForm.querySelector('#form-success');
          const errorMessage = contactForm.querySelector('#form-error');
          const submitButton = contactForm.querySelector('button[type="submit"]');
          const originalButtonText = submitButton?.innerHTML || 'Send Message';

          // Hide messages before submission
          if (success) success.style.display = 'none';
          if (errorMessage) errorMessage.style.display = 'none';

          // Disable button and show loading
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          }

          // Check for network connectivity
          if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network.');
          }

          // Send form with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Form submission failed with status ${response.status}`);
          }

          // Success
          contactForm.reset();
          if (success) {
            success.style.display = 'flex';
            setTimeout(() => { success.style.display = 'none'; }, 5000);
          }
          console.log('Form submitted successfully');

        } catch (error) {
          ErrorLogger.log(error, 'Form Submission Error');
          
          const errorMessage = contactForm.querySelector('#form-error');
          if (errorMessage) {
            const message = error.name === 'AbortError' 
              ? 'Request timeout. Please try again.' 
              : error.message || 'Failed to send message. Please try again or contact us directly.';
            errorMessage.textContent = message;
            errorMessage.style.display = 'flex';
            setTimeout(() => { errorMessage.style.display = 'none'; }, 7000);
          }

        } finally {
          // Re-enable button
          const submitButton = contactForm.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText || 'Send Message';
          }
        }
      });
    }
  } catch (error) {
    ErrorLogger.log(error, 'Contact Form Initialization Failed');
  }


  // ===== SCROLL ANIMATIONS =====
  try {
    const fadeEls = document.querySelectorAll('.fade-up');
    if (fadeEls.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          try {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          } catch (error) {
            ErrorLogger.log(error, 'Scroll Animation Error');
          }
        });
      }, { threshold: 0.1 });
      
      fadeEls.forEach(el => {
        try {
          observer.observe(el);
        } catch (error) {
          ErrorLogger.log(error, 'Observer Setup Error');
        }
      });
    }
  } catch (error) {
    ErrorLogger.log(error, 'Scroll Animations Initialization Failed');
  }

  // ===== BACK TO TOP =====
  try {
    const backTop = document.getElementById('back-top');
    if (backTop) {
      window.addEventListener('scroll', () => {
        try {
          backTop.classList.toggle('visible', window.scrollY > 400);
        } catch (error) {
          ErrorLogger.log(error, 'Back to Top Scroll Error');
        }
      });

      backTop.addEventListener('click', () => {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          ErrorLogger.log(error, 'Back to Top Click Error');
          // Fallback
          window.scrollY = 0;
        }
      });
    }
  } catch (error) {
    ErrorLogger.log(error, 'Back to Top Initialization Failed');
  }

  // ===== SMOOTH SCROLL =====
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        try {
          const href = this.getAttribute('href');
          if (!href || href === '#') return;
          
          const target = document.querySelector(href);
          if (target && target.scrollIntoView) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (error) {
          ErrorLogger.log(error, 'Smooth Scroll Error');
          // Fallback to default behavior
        }
      });
    });
  } catch (error) {
    ErrorLogger.log(error, 'Smooth Scroll Initialization Failed');
  }

  // ===== COUNTER ANIMATION =====
  try {
    function animateCounter(el) {
      try {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target) || target <= 0) {
          console.warn('Invalid counter target:', target);
          return;
        }

        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        let rafId = null;

        const animate = () => {
          current += step;
          if (current >= target) {
            current = target;
            el.textContent = Math.floor(current) + (el.dataset.suffix || '');
          } else {
            el.textContent = Math.floor(current) + (el.dataset.suffix || '');
            rafId = requestAnimationFrame(animate);
          }
        };

        rafId = requestAnimationFrame(animate);

        // Cleanup on destroy
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
        };
      } catch (error) {
        ErrorLogger.log(error, 'Counter Animation Error');
      }
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        try {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        } catch (error) {
          ErrorLogger.log(error, 'Counter Observer Error');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => {
      try {
        counterObserver.observe(el);
      } catch (error) {
        ErrorLogger.log(error, 'Counter Observer Setup Error');
      }
    });
  } catch (error) {
    ErrorLogger.log(error, 'Counter Animation Initialization Failed');
  }

  // ===== GALLERY MODAL =====
  try {
    const galleryModal = document.getElementById('galleryModal');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const closeGalleryBtn = document.getElementById('closeGalleryBtn');

    function closeGallery() {
      try {
        if (galleryModal) {
          galleryModal.classList.remove('open');
          document.body.style.overflow = '';
        }
      } catch (error) {
        ErrorLogger.log(error, 'Close Gallery Error');
      }
    }

    if (openGalleryBtn) {
      openGalleryBtn.addEventListener('click', () => {
        try {
          if (galleryModal) {
            galleryModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Preload gallery images when opened
            try {
              const galleryImages = galleryModal.querySelectorAll('img[loading="lazy"]');
              galleryImages.forEach(img => {
                if (img.dataset.src && !img.src) {
                  img.src = img.dataset.src;
                }
              });
            } catch (error) {
              console.warn('Gallery image preload warning:', error.message);
            }
          }
        } catch (error) {
          ErrorLogger.log(error, 'Open Gallery Error');
        }
      });
    }

    if (closeGalleryBtn) {
      closeGalleryBtn.addEventListener('click', closeGallery);
    }

    if (galleryModal) {
      galleryModal.addEventListener('click', (e) => {
        try {
          if (e.target === galleryModal) {
            closeGallery();
          }
        } catch (error) {
          ErrorLogger.log(error, 'Gallery Modal Click Error');
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Escape' && galleryModal?.classList.contains('open')) {
          closeGallery();
        }
      } catch (error) {
        ErrorLogger.log(error, 'Gallery Escape Key Error');
      }
    });
  } catch (error) {
    ErrorLogger.log(error, 'Gallery Modal Initialization Failed');
  }

  // ===== NETWORK STATUS MONITORING =====
  try {
    window.addEventListener('online', () => {
      console.log('Network connection restored');
    });

    window.addEventListener('offline', () => {
      console.warn('Network connection lost');
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.title = 'No internet connection';
        }
      }
    });
  } catch (error) {
    ErrorLogger.log(error, 'Network Monitoring Setup Failed');
  }
}

// Performance monitoring
if (window.performance && window.performance.measure) {
  try {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Page load time:', pageLoadTime + 'ms');
    });
  } catch (error) {
    console.warn('Performance monitoring error:', error.message);
  }
}
