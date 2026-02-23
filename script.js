/* ═══════════════════════════════════════════════════════════
   RG DENTAL & AESTHETICS — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Landing background slideshow ─── */
  const landingSlides = document.querySelectorAll('.landing-bg');
  if (landingSlides.length > 0) {
    let landingCurrent = 0;
    setInterval(() => {
      landingSlides[landingCurrent].classList.remove('active');
      landingCurrent = (landingCurrent + 1) % landingSlides.length;
      landingSlides[landingCurrent].classList.add('active');
    }, 3500);
  }

  /* ─── Header scroll effect ─── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ─── Mobile nav toggle ─── */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });
  // Close menu on link click
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════════════════════
     GENERIC CAROUSEL
     ═══════════════════════════════════════════════════════ */
  function initCarousel(trackId, dotsId, autoplayMs) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById(dotsId);
    const parent = track.closest('.carousel') || track.parentElement;
    const prevBtn = parent.querySelector('.carousel-prev');
    const nextBtn = parent.querySelector('.carousel-next');
    let current = 0;
    const total = slides.length;

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Autoplay
    let interval;
    function startAutoplay() {
      if (autoplayMs) {
        interval = setInterval(() => goTo(current + 1), autoplayMs);
      }
    }
    function stopAutoplay() { clearInterval(interval); }

    startAutoplay();
    parent.addEventListener('mouseenter', stopAutoplay);
    parent.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    let touchStart = 0;
    parent.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    parent.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
      startAutoplay();
    }, { passive: true });

    return { goTo };
  }

  // Achievements carousel — 3s autoplay
  initCarousel('achievementsTrack', 'achievementsDots', 3000);

  // Clinic carousel — 2.5s autoplay
  initCarousel('clinicTrack', 'clinicDots', 2500);

  /* ═══════════════════════════════════════════════════════
     SERVICES CARDS (from blog posts JSON)
     ═══════════════════════════════════════════════════════ */
  const servicesData = [
    { category: "Preventive Dentistry", title: "Dental Sealants", summary: "Preventive coating applied to molars to reduce cavities and enamel damage.", keywords: ["Dental Sealants Delhi NCR", "Preventive Dentistry", "Cavity Prevention"] },
    { category: "Pediatric Dentistry", title: "Pediatric Oral Hygiene", summary: "Early dental care guidance for children to prevent cavities and gum issues.", keywords: ["Pediatric Dentist Delhi NCR", "Child Oral Care", "Kids Dental Health"] },
    { category: "Periodontics", title: "Reconstructive Periodontal Surgery", summary: "Surgical treatment to restore gum health and prevent bone loss.", keywords: ["Periodontal Surgery Delhi NCR", "Gum Treatment", "Gum Reconstruction"] },
    { category: "Periodontics", title: "Peri-implantitis Management", summary: "Professional management of inflammation and bone loss around dental implants.", keywords: ["Peri-implantitis Treatment", "Implant Care", "Gum Health"] },
    { category: "Restorative Dentistry", title: "Tooth Coloured Fillings", summary: "Natural-looking fillings that restore structure and prevent further decay.", keywords: ["Tooth Coloured Fillings", "Composite Fillings Delhi NCR"] },
    { category: "Orthodontics", title: "Clear Aligners", summary: "Discreet and removable aligners to correct misaligned teeth.", keywords: ["Clear Aligners Delhi NCR", "Invisible Braces"] },
    { category: "Orthodontics", title: "Self-Ligating Braces", summary: "Advanced braces system reducing friction and treatment time.", keywords: ["Self Ligating Braces", "Modern Braces Delhi NCR"] },
    { category: "Orthodontics", title: "Metal Braces", summary: "Reliable stainless steel braces for effective bite correction.", keywords: ["Metal Braces Delhi NCR", "Orthodontic Treatment"] },
    { category: "Prosthodontics", title: "Dental Implants", summary: "Permanent solution for missing teeth restoring function and aesthetics.", keywords: ["Dental Implants Delhi NCR", "Tooth Replacement"] },
    { category: "Prosthodontics", title: "Complete and Partial Dentures", summary: "Custom dentures designed for comfort, stability, and natural appearance.", keywords: ["Dentures Delhi NCR", "Partial Dentures"] },
    { category: "Restorative Dentistry", title: "Restoration of Worn Teeth", summary: "Advanced techniques to restore tooth structure and bite alignment.", keywords: ["Worn Teeth Treatment", "Tooth Restoration Delhi NCR"] },
    { category: "General Dentistry", title: "Scaling and Polishing", summary: "Professional cleaning to remove plaque and tartar for healthier gums.", keywords: ["Scaling Delhi NCR", "Teeth Cleaning"] },
    { category: "General Dentistry", title: "Tooth Extraction", summary: "Safe and comfortable extraction procedures using modern techniques.", keywords: ["Tooth Extraction Delhi NCR", "Dental Surgery"] },
    { category: "Restorative Dentistry", title: "Broken Teeth Treatment", summary: "Restoration solutions including crowns, veneers, and implants.", keywords: ["Broken Tooth Treatment", "Tooth Repair Delhi NCR"] }
  ];

  const servicesContainer = document.getElementById('servicesCarousel');
  if (servicesContainer) {
    servicesData.forEach(service => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <span class="service-category">${service.category}</span>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-summary">${service.summary}</p>
        <div class="service-tags">
          ${service.keywords.map(k => `<span class="service-tag">${k}</span>`).join('')}
        </div>
        <a href="https://wa.me/919310217576?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}." target="_blank" class="btn btn-gold">Book Now</a>
      `;
      servicesContainer.appendChild(card);
    });

    // Auto-scroll services
    const prevBtn = document.querySelector('.services-prev');
    const nextBtn = document.querySelector('.services-next');
    const scrollAmt = 310;

    if (prevBtn) prevBtn.addEventListener('click', () => {
      servicesContainer.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      servicesContainer.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    });

    // Slow auto-scroll
    let servAutoScroll = setInterval(() => {
      if (servicesContainer.scrollLeft + servicesContainer.clientWidth >= servicesContainer.scrollWidth - 10) {
        servicesContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        servicesContainer.scrollBy({ left: 2, behavior: 'auto' });
      }
    }, 30);

    servicesContainer.addEventListener('mouseenter', () => clearInterval(servAutoScroll));
    servicesContainer.addEventListener('mouseleave', () => {
      servAutoScroll = setInterval(() => {
        if (servicesContainer.scrollLeft + servicesContainer.clientWidth >= servicesContainer.scrollWidth - 10) {
          servicesContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          servicesContainer.scrollBy({ left: 2, behavior: 'auto' });
        }
      }, 30);
    });
  }

  /* ═══════════════════════════════════════════════════════
     REVIEWS CAROUSEL
     ═══════════════════════════════════════════════════════ */
  const reviewsData = [
    { name: "Anonymous", rating: 5, age: "4 years ago", review: "Dr. Ruhi Ahuja is an excellent dentist. She explained every procedure thoroughly. I visited for braces and she was supportive and professional throughout the process." },
    { name: "Monika Arora", rating: 5, age: "6 years ago", review: "Very good experience. Dr. Ruhi is kind and sweet. She carried out the treatment smoothly and patiently. Completely painless and highly recommended." },
    { name: "Nisha Kapoor", rating: 5, age: "6 years ago", review: "Dr. Ruhi Ahuja is very cooperative and listens patiently. Very positive attitude. Clinic is well equipped with modern surgical tools." },
    { name: "Umrav Singh", rating: 5, age: "6 years ago", review: "Dr. Ruhi is really a good doctor. She gave me excellent treatment and treats patients politely." },
    { name: "Sumit Sharma", rating: 5, age: "6 years ago", review: "Very good experience. Diagnosis was done positively and treatment cost was economical compared to others." },
    { name: "Swati Paul", rating: 5, age: "6 years ago", review: "Highly qualified dentist. I had my root canal done and I am very satisfied with the service and pricing.", treatment: "Root Canal Treatment" },
    { name: "Iqbal", rating: 5, age: "6 years ago", review: "Dr. Ruhi is humble and polite. Treats patients like family. Excellent and well-equipped clinic." },
    { name: "Richa Garg", rating: 5, age: "6 years ago", review: "Dr. Ruhi handles kids very patiently. I am very satisfied with the treatment given to my daughter." },
    { name: "Abhishek Paul", rating: 5, age: "6 years ago", review: "Had my root canal done at RG Dental Clinic. Very satisfied with the services. Must recommend.", treatment: "Root Canal Treatment" },
    { name: "Lalit Joshi", rating: 5, age: "6 years ago", review: "Very experienced, economical and reliable doctor. Treats patients like family." },
    { name: "Abhishek Sehra", rating: 5, age: "6 years ago", review: "Had cavity filling done. Very affordable and qualified dentist. Happy with the clinic.", treatment: "Cavity Filling" },
    { name: "Babita Sharma", rating: 5, age: "6 months ago", review: "Very good experience. No pain." },
    { name: "Vikram Singh", rating: 5, age: "4 years ago", review: "Best dentist. Well-equipped and hygienic clinic in Faridabad." }
  ];

  const reviewsContainer = document.getElementById('reviewsCarousel');
  const reviewsDots = document.getElementById('reviewsDots');

  if (reviewsContainer) {
    reviewsData.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-quote-mark">"</div>
        <p class="review-text">"${r.review}"</p>
        <div class="review-stars">★★★★★</div>
        <p class="review-name">${r.name}</p>
        <p class="review-meta">${r.age}</p>
        ${r.treatment ? `<span class="review-treatment">${r.treatment}</span>` : ''}
      `;
      reviewsContainer.appendChild(card);

      // Dot
      if (reviewsDots) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToReview(i));
        reviewsDots.appendChild(dot);
      }
    });

    let currentReview = 0;
    const totalReviews = reviewsData.length;

    function goToReview(index) {
      currentReview = ((index % totalReviews) + totalReviews) % totalReviews;
      reviewsContainer.style.transform = `translateX(-${currentReview * 100}%)`;
      if (reviewsDots) {
        reviewsDots.querySelectorAll('.dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentReview);
        });
      }
    }

    // Autoplay reviews — 4s
    let reviewInterval = setInterval(() => goToReview(currentReview + 1), 4000);
    const reviewSection = reviewsContainer.closest('.reviews-section');
    if (reviewSection) {
      reviewSection.addEventListener('mouseenter', () => clearInterval(reviewInterval));
      reviewSection.addEventListener('mouseleave', () => {
        reviewInterval = setInterval(() => goToReview(currentReview + 1), 4000);
      });
    }

    // Touch swipe for reviews
    let revTouchStart = 0;
    reviewsContainer.addEventListener('touchstart', e => {
      revTouchStart = e.touches[0].clientX;
      clearInterval(reviewInterval);
    }, { passive: true });
    reviewsContainer.addEventListener('touchend', e => {
      const diff = revTouchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToReview(currentReview + (diff > 0 ? 1 : -1));
      reviewInterval = setInterval(() => goToReview(currentReview + 1), 4000);
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════
     SCROLL REVEAL ANIMATIONS
     ═══════════════════════════════════════════════════════ */
  const animateElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => observer.observe(el));

  /* ═══════════════════════════════════════════════════════
     SMOOTH SCROLL for anchor links
     ═══════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
