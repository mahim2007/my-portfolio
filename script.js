const text1 = "Aspiring Tech Enthusiast";  
const text2 = "Learning Today, Building Tomorrow.";  
let i = 0, j = 0;  
function typing(){  
  if(i < text1.length){  
    document.getElementById("typing").innerHTML += text1.charAt(i);  
    i++;  
    setTimeout(typing, 60);  
  } else if(j < text2.length){  
    document.getElementById("typing2").innerHTML += text2.charAt(j);  
    j++;  
    setTimeout(typing, 40);  
  }  
}  
window.onload = typing;  

// Menu Toggle Function
function toggleMenu(){  
  let menu = document.getElementById("menu");  
  let menuBtn = document.querySelector(".menu-btn");
  let overlay = document.getElementById("menuOverlay");
  
  if (menu.style.left === "0px") {
    menu.style.left = "-280px";
    menuBtn.classList.remove("active-btn");
    document.body.classList.remove("no-scroll");
    overlay.classList.remove("show");
  } else {
    menu.style.left = "0px";
    menuBtn.classList.add("active-btn");
    document.body.classList.add("no-scroll");
    overlay.classList.add("show");
  }
}    

// Close menu when clicking outside of it 
document.addEventListener('click', function(event) {
  let menu = document.getElementById("menu");
  let menuBtn = document.querySelector(".menu-btn");
  let overlay = document.getElementById("menuOverlay");
  
  if (menu.style.left === "0px" && !menu.contains(event.target) && !menuBtn.contains(event.target) && event.target !== overlay) {
    menu.style.left = "-280px";
    menuBtn.classList.remove("active-btn");
    document.body.classList.remove("no-scroll");
    overlay.classList.remove("show");
  }
});

// --- Swipe anywhere to close menu logic ---
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  
  if (touchStartX - touchEndX > 40) { 
    let menu = document.getElementById("menu");
    if (menu.style.left === "0px") {
      toggleMenu(); 
    }
  }
}, {passive: true});

// Highly Optimized Intersection Observer for Reveal & Skill Bars
let revealObserver = null;
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const progressBars = entry.target.querySelectorAll('.progress');
          if (progressBars.length > 0) {
            progressBars.forEach(bar => {
              const width = bar.getAttribute('data-width');
              if (width) bar.style.width = width;
            });
          }
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('active'));
    document.querySelectorAll('.progress').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  }
}

// Lightweight Scroll To Top with requestAnimationFrame throttle
const scrollTopBtn = document.getElementById('scrollTopBtn');
let isScrollTicking = false;

window.addEventListener('scroll', () => {
  if (!isScrollTicking) {
    window.requestAnimationFrame(() => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
      isScrollTicking = false;
    });
    isScrollTicking = true;
  }
}, { passive: true });

function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (scrollTopBtn) scrollTopBtn.blur(); 
}

// --- CLICK TO TOGGLE GALLERY CAPTION LOGIC ---
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation(); 
        const isActive = this.classList.contains('active-caption');
        
        galleryItems.forEach(g => g.classList.remove('active-caption'));
        
        if (!isActive) {
            this.classList.add('active-caption');
        }
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.gallery-item')) {
        galleryItems.forEach(g => g.classList.remove('active-caption'));
    }
});

// --- Page Scroll State Tracker ---
let isWindowScrolling = false;
let windowScrollTimer = null;

window.addEventListener('scroll', () => {
    isWindowScrolling = true;
    clearTimeout(windowScrollTimer);
    windowScrollTimer = setTimeout(() => {
        isWindowScrolling = false;
    }, 150);
}, { passive: true });

// --- BULLETPROOF BUG FIX: Infinite Swipe Carousel ---
function setupInfiniteCarousel(carouselId, dotsId) {
    const wrapper = document.getElementById(carouselId);
    if (!wrapper) return;
    const track = wrapper.querySelector('.carousel-track');
    const originalSlides = Array.from(track.children);
    const dotsContainer = document.getElementById(dotsId);
    
    if (originalSlides.length === 0) return;

    let currentIndex = 1; 
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isVerticalScroll = null;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let slideWidth = wrapper.clientWidth; 
    
    originalSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);
    
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);
    
    const allSlides = Array.from(track.children);
    
    function updateDimensions() {
        slideWidth = wrapper.clientWidth;
        allSlides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
            slide.style.maxWidth = `${slideWidth}px`;
        });
        setPositionByIndex(false);
    }
    
    function setPositionByIndex(smooth = true) {
        currentTranslate = currentIndex * -slideWidth;
        prevTranslate = currentTranslate;
        track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function updateDots() {
        let dotIndex = currentIndex - 1;
        if(dotIndex < 0) dotIndex = originalSlides.length - 1;
        if(dotIndex >= originalSlides.length) dotIndex = 0;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
    }

    function fixClonePosition() {
        if (currentIndex === 0) {
            track.style.transition = 'none';
            currentIndex = originalSlides.length;
            setPositionByIndex(false);
        } else if (currentIndex === allSlides.length - 1) {
            track.style.transition = 'none';
            currentIndex = 1;
            setPositionByIndex(false);
        }
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    track.addEventListener('transitionend', () => {
        fixClonePosition();
        updateDots();
    });

    // Window scroll event listener to immediately cancel any slide motion during scroll
    window.addEventListener('scroll', () => {
        if (isDragging) {
            isDragging = false;
            isVerticalScroll = true;
            setPositionByIndex(true);
        }
    }, { passive: true });
    
    function touchStart(event) {
        // স্ক্রোল করার সময় স্লাইড ড্র্যাগ করা বন্ধ থাকবে
        if (isWindowScrolling) return;

        isDragging = true;
        isVerticalScroll = null;
        const isTouch = !event.type.includes('mouse');
        startX = isTouch ? event.touches[0].clientX : event.pageX;
        startY = isTouch ? event.touches[0].clientY : event.pageY;
        
        fixClonePosition();
        
        track.style.transition = 'none';
        prevTranslate = currentIndex * -slideWidth;
        track.style.transform = `translateX(${prevTranslate}px)`;
    }
    
    function touchMove(event) {
        if (!isDragging) return;

        const isTouch = !event.type.includes('mouse');
        const currentX = isTouch ? event.touches[0].clientX : event.pageX;
        const currentY = isTouch ? event.touches[0].clientY : event.pageY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // ডিটেকশন: ইউজার কি পেইজ স্ক্রোল করছেন নাকি স্লাইড সরাচ্ছেন?
        if (isVerticalScroll === null && isTouch) {
            if (Math.abs(diffX) < 7 && Math.abs(diffY) < 7) {
                return; // খুব সামান্য মুভমেন্টে কোনো সিদ্ধান্ত নয়
            }
            if (Math.abs(diffY) >= Math.abs(diffX)) {
                // ইউজার উল্লম্বভাবে পেইজ স্ক্রোল করছেন - স্লাইড বন্ধ থাকবে!
                isVerticalScroll = true;
                isDragging = false;
                setPositionByIndex(true);
                return;
            } else {
                isVerticalScroll = false;
            }
        }

        if (isVerticalScroll === true) {
            return;
        }

        track.style.transform = `translateX(${prevTranslate + diffX}px)`;
        
        if (Math.abs(diffX) > 10 && carouselId === 'gallery-carousel') {
            const items = wrapper.querySelectorAll('.gallery-item');
            items.forEach(item => item.classList.remove('active-caption'));
        }
    }
    
    function touchEnd(event) {
        if (!isDragging) return;
        isDragging = false;

        if (isVerticalScroll === true) {
            setPositionByIndex(true);
            return;
        }

        const isTouch = !event.type.includes('mouse');
        const endX = isTouch ? (event.changedTouches ? event.changedTouches[0].clientX : startX) : event.pageX;
        const diff = endX - startX;
        
        if (diff < -50) currentIndex++; 
        else if (diff > 50) currentIndex--; 
        
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= allSlides.length) currentIndex = allSlides.length - 1;
        
        setPositionByIndex(true);
        updateDots(); 
    }
    
    track.addEventListener('touchstart', touchStart, {passive: true});
    track.addEventListener('touchmove', touchMove, {passive: true});
    track.addEventListener('touchend', touchEnd);
    
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', (e) => { if(isDragging) touchEnd(e); });
}

// --- Auto-generate Skills Carousel ---
function initSkillsCarousel() {
    const rawSkills = document.getElementById('raw-skills');
    const carouselContainer = document.getElementById('skills-carousel-container');
    
    if (!rawSkills || !carouselContainer) return;

    const skills = Array.from(rawSkills.children);
    if (skills.length === 0) return;

    let trackHtml = '<div class="carousel-wrapper" id="skills-carousel" style="padding-bottom: 10px;"><div class="carousel-track">';
    
    for (let i = 0; i < skills.length; i += 5) {
        trackHtml += '<div class="carousel-slide"><div class="skills-page">';
        for (let j = i; j < i + 5 && j < skills.length; j++) {
            trackHtml += skills[j].outerHTML;
        }
        trackHtml += '</div></div>';
    }
    
    trackHtml += '</div></div><div class="carousel-dots" id="skills-dots"></div>';
    carouselContainer.innerHTML = trackHtml;
    
    rawSkills.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    initSkillsCarousel(); 
    setupInfiniteCarousel('skills-carousel', 'skills-dots'); 
    setupInfiniteCarousel('gallery-carousel', 'gallery-dots');
    setupInfiniteCarousel('testimonial-carousel', 'testimonial-dots');
    initScrollReveal();
});

// Custom Cursor Logic (Only active on desktop / fine pointer devices)
const cursor = document.getElementById('cursor');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasFinePointer && cursor) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isCursorAnimating = false;

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    if (Math.abs(mouseX - cursorX) > 0.15 || Math.abs(mouseY - cursorY) > 0.15) {
      requestAnimationFrame(renderCursor);
    } else {
      isCursorAnimating = false;
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isCursorAnimating) {
      isCursorAnimating = true;
      requestAnimationFrame(renderCursor);
    }
  }, { passive: true });

  // Event delegation for smooth hover feedback without hundreds of listeners
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .menu-btn, .project-box, .contact-item a, .gallery-item, .dot')) {
      document.body.classList.add('cursor-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .menu-btn, .project-box, .contact-item a, .gallery-item, .dot')) {
      document.body.classList.remove('cursor-hover');
    }
  }, { passive: true });
}

// Modal Logic
function openModal(iconClass, title, desc, link) {
  document.getElementById('modal-icon').className = 'fas modal-icon ' + iconClass;
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-desc').innerHTML = desc;
  
  const linkBtn = document.getElementById('modal-link');
  if (link && link !== "") {
    linkBtn.href = link;
    linkBtn.style.display = 'inline-block';
  } else {
    linkBtn.style.display = 'none';
  }

  document.getElementById('projectModal').classList.add('show');
  document.body.classList.add('no-scroll');
}

function closeModal(event, force = false) {
  if (force || event.target.id === 'projectModal') {
    document.getElementById('projectModal').classList.remove('show');
    document.body.classList.remove('no-scroll');
  }
}

// Form Elements & Logic
const form = document.getElementById("contact-form");
const statusText = document.getElementById("msg-status");
const submitBtn = document.getElementById("submit-btn");
const formInputs = document.getElementById("form-inputs");
const successMsg = document.getElementById("success-message");

let isMessageSent = false;

submitBtn.addEventListener("click", function(e) {
  if (isMessageSent) {
    e.preventDefault();
    form.reset();
    formInputs.style.display = "block";
    successMsg.style.display = "none";
    submitBtn.innerHTML = 'Send Message &nbsp; <i class="fas fa-paper-plane"></i>';
    submitBtn.type = "submit"; 
    statusText.innerText = "";
    isMessageSent = false;
  }
});

form.addEventListener("submit", function(e){
  e.preventDefault();
  if (isMessageSent) return;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.style.opacity = "0.7";
  submitBtn.style.cursor = "not-allowed";
  statusText.innerText = ""; 

  const data = new FormData(form);

  function handleSuccess() {
    formInputs.style.display = "none";
    successMsg.style.display = "block";
    
    submitBtn.innerHTML = 'Send Another &nbsp; <i class="fas fa-sync-alt"></i>';
    submitBtn.type = "button"; 
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
    statusText.innerText = "";
    isMessageSent = true;
  }

  function handleFail() {
    submitBtn.innerHTML = 'Send Message &nbsp; <i class="fas fa-paper-plane"></i>';
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
  }

  fetch(form.action, {
    method: "POST",
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (!res.ok) throw new Error("FormSubmit failed");
    handleSuccess();
  })
  .catch(() => {
    emailjs.send("service_4nxpwkb", "template_na6948j", {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      time: new Date().toLocaleString('en-BD')
    })
    .then(() => { handleSuccess(); })
    .catch(() => {
      handleFail();
      statusText.style.color = "#f43f5e";
      statusText.innerText = "Both systems failed! Please try again later.";
    });
  });
});

// High-Performance Particles.js (Non-blocking, Lightweight, 60+ FPS)
const isSmallDevice = window.innerWidth < 768;
particlesJS("particles-js", {
  "particles": {
    "number": { "value": isSmallDevice ? 24 : 42, "density": { "enable": true, "value_area": 1000 } },
    "color": { "value": "#38bdf8" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.45, "random": false },
    "size": { "value": 2.5, "random": true },
    "line_linked": { "enable": true, "distance": 125, "color": "#38bdf8", "opacity": 0.22, "width": 1 },
    "move": { "enable": true, "speed": 1.2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": { "enable": !isSmallDevice, "mode": "grab" },
      "onclick": { "enable": false },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 120, "line_linked": { "opacity": 0.35 } }
    }
  },
  "retina_detect": false
});