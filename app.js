/* ==========================================================================
   SHREYA GHODMARE — PORTFOLIO ENGINE & INTERACTION CONTROLLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. Dedicated Full-Screen Entrance Landing Page Controller ---
  const landingPage = document.getElementById('landing-entrance-page');
  let landingDismissed = false;

  window.dismissLandingPage = function() {
    if (landingDismissed || !landingPage) return;
    landingDismissed = true;
    landingPage.classList.add('dismissed');
    setTimeout(() => {
      landingPage.style.display = 'none';
    }, 1150);
  };

  if (landingPage) {
    // Auto-transition into main portfolio after 2.65 seconds
    setTimeout(() => {
      window.dismissLandingPage();
    }, 2650);
  }

  // --- 2. Continuous Parallax Side Watermark System ---
  const leftWatermarkCol = document.querySelector('.watermark-side-left');
  const rightWatermarkCol = document.querySelector('.watermark-side-right');
  
  if (leftWatermarkCol || rightWatermarkCol) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (leftWatermarkCol) {
        leftWatermarkCol.style.transform = `translate3d(0, ${scrollY * -0.05}px, 0)`;
      }
      if (rightWatermarkCol) {
        rightWatermarkCol.style.transform = `translate3d(0, ${scrollY * 0.035}px, 0)`;
      }
    }, { passive: true });
  }

  // --- 3. Active Nav Link Scroll Observer ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 130;
      const sectionHeight = sec.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Initialize Cursor-Triggered Project Screenshot Slideshows ---
  initProjectSlideshows();

  // --- 5. Initialize Cursor-Triggered Achievement Multi-Photo Slideshows ---
  initAchievementSlideshows();
});

/* ==========================================================================
   PROJECT SCREENSHOT SLIDESHOW (HOVER CURSOR TRIGGERS PLAYBACK)
   ========================================================================== */
function initProjectSlideshows() {
  const viewports = document.querySelectorAll('.slideshow-viewport');

  viewports.forEach(vp => {
    const stage = vp.querySelector('.slideshow-stage');
    const items = vp.querySelectorAll('.slideshow-item');
    const counter = vp.querySelector('.slideshow-counter');
    const prevBtn = vp.querySelector('.prev-btn');
    const nextBtn = vp.querySelector('.next-btn');

    if (!stage || items.length <= 1) return;

    let currentIndex = 0;
    const total = items.length;
    let autoTimer = null;

    function updateSlide() {
      stage.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${total}`;
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % total;
      updateSlide();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + total) % total;
      updateSlide();
    }

    function startSlideshow() {
      if (!autoTimer) {
        autoTimer = setInterval(nextSlide, 2800);
      }
    }

    function stopSlideshow() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Cursor hover triggers playback
    vp.addEventListener('mouseenter', startSlideshow);
    vp.addEventListener('mouseleave', stopSlideshow);

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }

    let touchStartX = 0;
    vp.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    vp.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  });
}

/* ==========================================================================
   ACHIEVEMENT MULTI-PHOTO SLIDESHOW (HOVER CURSOR TRIGGERS PLAYBACK)
   ========================================================================== */
function initAchievementSlideshows() {
  const achSlideshows = document.querySelectorAll('.achievement-photo-slideshow');

  achSlideshows.forEach(ss => {
    const track = ss.querySelector('.achievement-photo-track');
    const slides = ss.querySelectorAll('.achievement-photo-slide');
    const counter = ss.querySelector('.achievement-photo-counter');

    if (!track || slides.length <= 1) return;

    let currentIndex = 0;
    const total = slides.length;
    let autoTimer = null;

    function updateAchievementSlide() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${total}`;
      }
    }

    function nextAchievementSlide() {
      currentIndex = (currentIndex + 1) % total;
      updateAchievementSlide();
    }

    function startAchSlideshow() {
      if (!autoTimer) {
        autoTimer = setInterval(nextAchievementSlide, 2800);
      }
    }

    function stopAchSlideshow() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    ss.addEventListener('mouseenter', startAchSlideshow);
    ss.addEventListener('mouseleave', stopAchSlideshow);
  });
}

/* ==========================================================================
   CONTACT DETAILS MODAL CONTROLLER
   ========================================================================== */
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/* ==========================================================================
   DEMO CREDENTIALS MODAL & UTILITY FUNCTIONS
   ========================================================================== */
function openDemoModal(projectName, email, password) {
  const modal = document.getElementById('demo-modal');
  const titleEl = document.getElementById('modal-project-name');
  const emailEl = document.getElementById('modal-email-val');
  const passEl = document.getElementById('modal-pass-val');
  const toggleBtn = document.getElementById('toggle-pass-btn');

  if (modal && titleEl && emailEl && passEl) {
    titleEl.textContent = projectName;
    emailEl.value = email;
    passEl.value = password;
    passEl.type = 'password';
    if (toggleBtn) toggleBtn.textContent = 'Reveal';
    modal.classList.add('active');
  }
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function togglePasswordMask() {
  const passEl = document.getElementById('modal-pass-val');
  const toggleBtn = document.getElementById('toggle-pass-btn');
  if (passEl && toggleBtn) {
    if (passEl.type === 'password') {
      passEl.type = 'text';
      toggleBtn.textContent = 'Hide';
    } else {
      passEl.type = 'password';
      toggleBtn.textContent = 'Reveal';
    }
  }
}

function copyValue(inputId, btnElement) {
  const input = document.getElementById(inputId);
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      const originalText = btnElement.textContent;
      btnElement.textContent = 'Copied!';
      btnElement.style.backgroundColor = '#242124';
      setTimeout(() => {
        btnElement.textContent = originalText;
        btnElement.style.backgroundColor = '#800020';
      }, 1800);
    });
  }
}

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeDemoModal();
    closeLightbox();
  }
});
