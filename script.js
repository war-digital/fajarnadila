/* 
   =========================================
   SCRIPT LOGIC FOR FAJAR & NADILA WEDDING
   =========================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. UPDATE ANDROID STATUS BAR TIME ---
  function updateStatusTime() {
    const timeEl = document.getElementById('statusTime');
    if (timeEl) {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      timeEl.textContent = `${hours}:${minutes}`;
    }
  }
  updateStatusTime();
  setInterval(updateStatusTime, 60000);


  // --- 2. GET GUEST NAME FROM URL PARAMS ---
  function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    const guestEl = document.getElementById('guestName');
    
    if (guestEl) {
      if (guestParam) {
        // Clean name, replace + or %20 with space
        guestEl.textContent = decodeURIComponent(guestParam);
      } else {
        guestEl.textContent = "Tamu Undangan";
      }
    }
  }
  getGuestName();


  // --- 3. VIDEO OPENING LOGIC ---
  const videoOverlay = document.getElementById('videoOverlay');
  const openingVideo = document.getElementById('openingVideo');
  const skipVideoBtn = document.getElementById('skipVideoBtn');
  const coverScreen = document.getElementById('coverScreen');

  function endVideoOverlay() {
    if (videoOverlay && !videoOverlay.classList.contains('fade-out')) {
      videoOverlay.classList.add('fade-out');
      if (openingVideo) {
        openingVideo.pause();
      }
      
      // Animate cover content entries on fade-in
      setTimeout(() => {
        const textFadeElements = document.querySelectorAll('.text-fade');
        textFadeElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, index * 200);
        });
      }, 500);
    }
  }

  if (openingVideo) {
    // Autoplay handling, attempt play
    openingVideo.play().catch(e => {
      console.log("Video autoplay blocked or failed, waiting for user click.", e);
    });
    
    // Auto transition when video ends
    openingVideo.addEventListener('ended', endVideoOverlay);
  }

  if (skipVideoBtn) {
    skipVideoBtn.addEventListener('click', endVideoOverlay);
  }

  // Backup auto-skip video after 15 seconds if it gets stuck
  setTimeout(endVideoOverlay, 15000);


  // --- 4. SLIDESHOW LOGIC ---
  
  // Cover Background Slideshow (BG1, BG2, BG3)
  const bgImages = document.querySelectorAll('.bg-slideshow img');
  let currentBgIndex = 0;
  
  if (bgImages.length > 0) {
    setInterval(() => {
      bgImages[currentBgIndex].classList.remove('active');
      currentBgIndex = (currentBgIndex + 1) % bgImages.length;
      bgImages[currentBgIndex].classList.add('active');
    }, 5000);
  }

  // Groom Photo Slideshow (Groom1, Groom2)
  const groomImages = document.querySelectorAll('.groom-photo');
  let currentGroomIndex = 0;
  if (groomImages.length > 0) {
    setInterval(() => {
      groomImages[currentGroomIndex].classList.remove('active');
      currentGroomIndex = (currentGroomIndex + 1) % groomImages.length;
      groomImages[currentGroomIndex].classList.add('active');
    }, 4000);
  }

  // Bride Photo Slideshow (Bride1, Bride2)
  const brideImages = document.querySelectorAll('.bride-photo');
  let currentBrideIndex = 0;
  if (brideImages.length > 0) {
    setInterval(() => {
      brideImages[currentBrideIndex].classList.remove('active');
      currentBrideIndex = (currentBrideIndex + 1) % brideImages.length;
      brideImages[currentBrideIndex].classList.add('active');
    }, 4000);
  }

  // Card Background Slideshow (G1, G2, G4) - Horizontal Slide
  const cardTrack = document.getElementById('cardSlideshowTrack');
  let currentCardIndex = 0;
  const totalCardImages = 3;
  if (cardTrack) {
    setInterval(() => {
      currentCardIndex = (currentCardIndex + 1) % totalCardImages;
      const offset = currentCardIndex * 33.333;
      cardTrack.style.transform = `translate3d(${-offset}%, 0, 0)`;
    }, 4500);
  }


  // --- 5. BUKA UNDANGAN, MUSIC CONTROL, & SCROLL ANIMATIONS ---
  const openInvBtn = document.getElementById('openInvitationBtn');
  const mainContent = document.getElementById('mainContent');
  const bottomNav = document.getElementById('bottomNav');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggleBtn = document.getElementById('musicToggleBtn');

  // Text Splitting Utility for characters and words
  function initTextSplitting() {
    const charElements = document.querySelectorAll('.split-chars');
    charElements.forEach(el => {
      const text = el.textContent.trim();
      el.innerHTML = '';
      
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.classList.add('char-item');
        span.style.setProperty('--char-index', index);
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        el.appendChild(span);
      });
    });

    const wordElements = document.querySelectorAll('.split-words');
    wordElements.forEach(el => {
      const text = el.textContent.trim();
      const words = text.split(/\s+/);
      el.innerHTML = '';
      
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.classList.add('word-item');
        span.style.setProperty('--word-index', index);
        span.innerHTML = word;
        el.appendChild(span);
        
        if (index < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  // Initialize text splits immediately on load
  initTextSplitting();

  function initAnimations() {
    const animateObserverOptions = {
      root: document.getElementById('mainContent'),
      threshold: 0.30 // Trigger animation when 30% of the section is visible
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const animItems = section.querySelectorAll('.animate-item');
          animItems.forEach((item, index) => {
            let delay = index * 250; // Snappier stagger for cards and inner content
            // Group gallery items with a quick stagger after heading/subheading reveal
            if (item.classList.contains('gallery-item')) {
              delay = 400 + (index - 2) * 60;
            }
            item.style.transitionDelay = `${delay}ms`;
            item.classList.add('show');
          });
          observer.unobserve(section);
        }
      });
    }, animateObserverOptions);

    document.querySelectorAll('.section').forEach(section => {
      animateObserver.observe(section);
    });
  }

  if (openInvBtn) {
    openInvBtn.addEventListener('click', () => {
      // 1. Hide cover screen (slide up)
      coverScreen.classList.add('slide-up');
      
      // 2. Show main content & bottom navigation bar
      mainContent.classList.add('active');
      bottomNav.classList.add('active');
      
      // 3. Play background music
      if (bgMusic) {
        bgMusic.play().then(() => {
          musicToggleBtn.classList.remove('paused');
        }).catch(err => {
          console.log("Audio play blocked by browser, user needs to click music btn.", err);
          musicToggleBtn.classList.add('paused');
        });
      }
      
      // Change status bar text to dark mode color since page is light
      const statusBar = document.querySelector('.status-bar');
      if (statusBar) {
        statusBar.style.color = '#1b4332';
        statusBar.style.textShadow = 'none';
      }

      // Initialize scroll animations
      initAnimations();
    });
  }

  // Music Toggle Action
  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggleBtn.classList.remove('paused');
      } else {
        bgMusic.pause();
        musicToggleBtn.classList.add('paused');
      }
    });
  }


  // --- 6. WEDDING COUNTDOWN TIMER ---
  // Target date: 04 July 2026, 11:00 WITA (GMT+8)
  const targetDate = new Date('2026-07-04T11:00:00+08:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Event started
      const elements = ['days', 'hours', 'minutes', 'seconds', 'd-days', 'd-hours', 'd-minutes', 'd-seconds'];
      elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (num) => num.toString().padStart(2, '0');

    // Update main card countdown
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    // Update desktop banner countdown
    const dDaysEl = document.getElementById('d-days');
    const dHoursEl = document.getElementById('d-hours');
    const dMinutesEl = document.getElementById('d-minutes');
    const dSecondsEl = document.getElementById('d-seconds');

    if (dDaysEl) dDaysEl.textContent = pad(days);
    if (dHoursEl) dHoursEl.textContent = pad(hours);
    if (dMinutesEl) dMinutesEl.textContent = pad(minutes);
    if (dSecondsEl) dSecondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // --- 7. BOTTOM NAVIGATION SCROLLSPY ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  // Handle click on nav items
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection && mainContent) {
        // Scroll inside the scrollable mainContent container
        mainContent.scrollTo({
          top: targetSection.offsetTop - 38, // Subtract status bar offset
          behavior: 'smooth'
        });
      }
    });
  });

  // Scrollspy & Parallax logic: update background and active nav item based on viewport scroll inside mainContent
  const globalBg = document.querySelector('.global-bg');

  if (mainContent) {
    mainContent.addEventListener('scroll', () => {
      // 1. Parallax background scroll effect
      if (globalBg) {
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        if (scrollHeight > 0) {
          const scrollFraction = scrollTop / scrollHeight;
          const yOffset = scrollFraction * 60; // Max offset of 60px matching CSS
          globalBg.style.transform = `translate3d(0, ${-yOffset}px, 0)`;
        }
      }

      // 2. Scrollspy logic
      let currentSectionId = '';
      const scrollPosition = mainContent.scrollTop;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 50; // offset tolerancy
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
          currentSectionId = section.getAttribute('id');
        }
      });
      
      if (currentSectionId) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-section') === currentSectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }


  // --- 8. WISHES / GUESTBOOK SYSTEM (localStorage) ---
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');
  const wishesCountEl = document.getElementById('wishesCount');

  // Pre-populated wishes if localstorage is empty
  const defaultWishes = [
    {
      name: "Budi & Sarah",
      message: "Selamat ya Fajar & Nadila! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia terus sampai kakek nenek!",
      attendance: "Hadir",
      timestamp: new Date('2026-06-12T14:30:00').toISOString()
    },
    {
      name: "dr. Andi Wijaya",
      message: "Lancar-lancar sampai hari H. Selamat menempuh hidup baru untuk kedua mempelai!",
      attendance: "Hadir",
      timestamp: new Date('2026-06-12T15:45:00').toISOString()
    },
    {
      name: "Citra Lestari",
      message: "Happy wedding Fajar & Nadila! Sangat bahagia melihat kalian akhirnya bersatu di pelaminan. Maaf belum bisa hadir langsung, tapi doa terbaik selalu menyertai langkah baru kalian.",
      attendance: "Tidak Hadir",
      timestamp: new Date('2026-06-12T18:10:00').toISOString()
    }
  ];

  function getWishes() {
    let wishes = localStorage.getItem('wedding_wishes');
    if (!wishes) {
      wishes = JSON.stringify(defaultWishes);
      localStorage.setItem('wedding_wishes', wishes);
    }
    return JSON.parse(wishes);
  }

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    
    const wishes = getWishes();
    wishesCountEl.textContent = wishes.length;

    // Display wishes sorted by date desc
    const sortedWishes = [...wishes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedWishes.forEach(wish => {
      const item = document.createElement('div');
      item.className = 'guestbook-item';
      
      let statusClass = 'status-hadir';
      if (wish.attendance === 'Tidak Hadir') statusClass = 'status-tidak';
      if (wish.attendance === 'Ragu-ragu') statusClass = 'status-ragu';

      item.innerHTML = `
        <div class="guestbook-header">
          <span class="guest-name-tag">${escapeHTML(wish.name)}</span>
          <span class="guest-status-tag ${statusClass}">${wish.attendance}</span>
        </div>
        <p class="guest-message-text">${escapeHTML(wish.message)}</p>
      `;
      wishesList.appendChild(item);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('rsvpName');
      const messageInput = document.getElementById('rsvpMessage');
      const attendanceInput = document.querySelector('input[name="attendance"]:checked');

      if (nameInput && messageInput && attendanceInput) {
        const newWish = {
          name: nameInput.value.trim(),
          message: messageInput.value.trim(),
          attendance: attendanceInput.value,
          timestamp: new Date().toISOString()
        };

        const wishes = getWishes();
        wishes.push(newWish);
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
        
        // Reset form inputs
        nameInput.value = '';
        messageInput.value = '';
        
        // Re-render and show success toast
        renderWishes();
        showToast("Ucapan berhasil dikirim!");
      }
    });
  }

  // Initial render of wishes
  renderWishes();


  // --- 9. GALLERY LIGHTBOX SYSTEM ---
  const galleryGrid = document.getElementById('galleryGrid');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let galleryImagesList = [];
  let activeImageIndex = 0;

  if (galleryGrid) {
    const items = galleryGrid.querySelectorAll('.gallery-item img');
    items.forEach((img, index) => {
      galleryImagesList.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt')
      });

      img.parentElement.addEventListener('click', () => {
        activeImageIndex = index;
        openLightbox();
      });
    });
  }

  function openLightbox() {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = galleryImagesList[activeImageIndex].src;
      if (lightboxCaption) {
        lightboxCaption.textContent = galleryImagesList[activeImageIndex].alt;
      }
      lightboxModal.style.display = 'flex';
      // Disable body/container scroll while lightbox is active
      if (mainContent) mainContent.style.overflowY = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.style.display = 'none';
      if (mainContent) mainContent.style.overflowY = 'auto';
    }
  }

  function showNextImage() {
    activeImageIndex = (activeImageIndex + 1) % galleryImagesList.length;
    if (lightboxImg && lightboxCaption) {
      lightboxImg.src = galleryImagesList[activeImageIndex].src;
      lightboxCaption.textContent = galleryImagesList[activeImageIndex].alt;
    }
  }

  function showPrevImage() {
    activeImageIndex = (activeImageIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
    if (lightboxImg && lightboxCaption) {
      lightboxImg.src = galleryImagesList[activeImageIndex].src;
      lightboxCaption.textContent = galleryImagesList[activeImageIndex].alt;
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close lightbox on clicking outside image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.style.display === 'flex') {
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'Escape') closeLightbox();
    }
  });

  // Swipe support for mobile inside Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
  }

  function handleSwipe() {
    const swipeThreshold = 50; // pixels
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe Left -> Next
      showNextImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe Right -> Prev
      showPrevImage();
    }
  }

});

// --- 10. COPY TEXT UTILITY ---
function copyText(elementId, buttonElement) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const textToCopy = element.innerText || element.textContent;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Show toast
    showToast("Berhasil disalin!");
    
    // Change button state temporarily
    const originalHTML = buttonElement.innerHTML;
    buttonElement.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
    buttonElement.style.background = '#1b4332';
    buttonElement.style.color = '#ffffff';
    buttonElement.style.borderColor = '#1b4332';
    
    setTimeout(() => {
      buttonElement.innerHTML = originalHTML;
      buttonElement.style.background = '';
      buttonElement.style.color = '';
      buttonElement.style.borderColor = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    showToast("Gagal menyalin teks.");
  });
}

// --- 11. TOAST NOTIFICATION UTILITY ---
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
