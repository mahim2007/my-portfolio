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

// --- Theme Toggle & System Preference Logic ---
function applyTheme(isLight) {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    if (isLight) {
        body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.classList.remove('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

function toggleTheme() {
    const isLight = !document.body.classList.contains('light-mode');
    applyTheme(isLight);
}

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

// Scroll Reveal, Skill Progress & Scroll To Top Button Logic
const scrollTopBtn = document.getElementById('scrollTopBtn');

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  var windowHeight = window.innerHeight;
  var bottomScrollPosition = window.innerHeight + window.scrollY;
  var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

  for (var k = 0; k < reveals.length; k++) {
    var elementTop = reveals[k].getBoundingClientRect().top;
    var elementVisible = 50; 
    if (elementTop < windowHeight - elementVisible) {
      reveals[k].classList.add("active");
    }
  }

  var skillsSection = document.getElementById("skills");
  if(skillsSection) {
      var skillTop = skillsSection.getBoundingClientRect().top;
      if (skillTop < windowHeight - 100) {
          var progressBars = document.querySelectorAll('.progress');
          progressBars.forEach(bar => {
              bar.style.width = bar.getAttribute('data-width');
          });
      }
  }

  if (bottomScrollPosition >= documentHeight - 150) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
}
window.addEventListener("scroll", reveal);
reveal(); 

function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
  document.getElementById('scrollTopBtn').blur(); 
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
    let isDragging = false;
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
    
    function touchStart(event) {
        isDragging = true;
        startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        
        fixClonePosition();
        
        track.style.transition = 'none';
        prevTranslate = currentIndex * -slideWidth;
        track.style.transform = `translateX(${prevTranslate}px)`;
    }
    
    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        const diff = currentPosition - startX;
        track.style.transform = `translateX(${prevTranslate + diff}px)`;
        
        if (Math.abs(diff) > 10 && carouselId === 'gallery-carousel') {
            const items = wrapper.querySelectorAll('.gallery-item');
            items.forEach(item => item.classList.remove('active-caption'));
        }
    }
    
    function touchEnd(event) {
        if (!isDragging) return;
        isDragging = false;
        const endX = event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX;
        const diff = endX - startX;
        
        if (diff < -40) currentIndex++; 
        else if (diff > 40) currentIndex--; 
        
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
    
    setTimeout(reveal, 100);
}

// FIX: DOMContentLoaded এর ভেতরে সিস্টেম থিম চেকার লজিক যুক্ত করা হলো
document.addEventListener("DOMContentLoaded", () => {
    // 1. Detect System Preference
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)');
    applyTheme(systemPrefersLight.matches);
    
    // 2. Listen for System Theme Changes
    systemPrefersLight.addEventListener('change', (e) => {
        applyTheme(e.matches);
    });

    initSkillsCarousel(); 
    setupInfiniteCarousel('skills-carousel', 'skills-dots'); 
    setupInfiniteCarousel('gallery-carousel', 'gallery-dots');
    setupInfiniteCarousel('testimonial-carousel', 'testimonial-dots');
});

// Custom Cursor Logic
const cursor = document.getElementById('cursor');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverItems = document.querySelectorAll('a, button, .menu-btn, .project-box, .contact-item a, .theme-toggle');
hoverItems.forEach(item => {
  item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

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

// Particles.js Initialization 
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 70, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#38bdf8" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.6, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#38bdf8", "opacity": 0.35, "width": 1.2 },
    "move": { "enable": true, "speed": 1.5, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 150, "line_linked": { "opacity": 0.5 } },
      "push": { "particles_nb": 3 }
    }
  },
  "retina_detect": true
});