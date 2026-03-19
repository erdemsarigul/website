/* =========================================================
   Sarıgül Ticaret – Main JS
   ========================================================= */

(function () {
  'use strict';

  /* ---- Config ------------------------------------------- */
  const PHONE_NUMBER   = '905427447550';  // WhatsApp numarası (ülke kodu dahil, + veya boşluk olmadan)
  const EMAIL_ADDRESS  = 'info@sarigulticaret.com';
  const COOKIE_KEY     = 'sg_cookie_consent';

  /* ---- DOM Hazır ---------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initCookieBanner();
    initBackToTop();
    initContactForm();
    initCatalogFilter();
    setActiveNav();
    initWhatsAppLinks();
    initProductSlider();
  });

  /* ---- Mobil Menü --------------------------------------- */
  function initMobileMenu() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Bir linke tıklanınca menüyü kapat
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Dışarı tıklanınca kapat
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Aktif Navigasyon --------------------------------- */
  function setActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      // Exact match, or prefix match on a complete path segment (href must end with '/')
      const isExact = href === currentPath;
      const isSection = href !== '/' && href.endsWith('/') && currentPath.startsWith(href);
      if (isExact || isSection) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Cookie Banner ------------------------------------ */
  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Daha önce karar verilmişse gösterme
    if (localStorage.getItem(COOKIE_KEY)) return;

    // Kısa gecikme ile göster
    setTimeout(function () {
      banner.classList.add('visible');
    }, 1500);

    const acceptBtn  = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        hideCookieBanner(banner);
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem(COOKIE_KEY, 'declined');
        hideCookieBanner(banner);
      });
    }
  }

  function hideCookieBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(function () { banner.style.display = 'none'; }, 600);
  }

  /* ---- Yukarı Çık Butonu -------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- İletişim Formu ----------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const msgEl = document.getElementById('form-message');
      const submitBtn = form.querySelector('[type="submit"]');

      // Basit doğrulama
      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showFormMessage(msgEl, 'Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage(msgEl, 'Geçerli bir e-posta adresi girin.', 'error');
        return;
      }

      // Gönderme simülasyonu (Netlify Forms entegrasyonu ile gerçek gönderim yapılır)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Gönderiliyor…';

      setTimeout(function () {
        showFormMessage(msgEl, '✓ Mesajınız alındı! En kısa sürede size dönüş yapacağız.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Mesaj Gönder';
      }, 1000);
    });
  }

  function showFormMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'form-message ' + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Ürün Katalog Filtresi ---------------------------- */
  function initCatalogFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card[data-category]');

    if (!filterBtns.length || !productCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productCards.forEach(function (card) {
          if (filter === 'tumu' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = 'fadeInUp 0.3s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- WhatsApp Linklerini Dinamik Güncelle ------------- */
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      const msg = encodeURIComponent(el.getAttribute('data-wa') || 'Merhaba, bilgi almak istiyorum.');
      const href = 'https://wa.me/' + PHONE_NUMBER + '?text=' + msg;
      el.setAttribute('href', href);
    });
  }

  /* ---- Ürün Sorgulama (WhatsApp) ------------------------ */
  window.askProduct = function (productName) {
    const msg = encodeURIComponent('Merhaba! "' + productName + '" ürünü hakkında bilgi almak istiyorum.');
    window.open('https://wa.me/' + PHONE_NUMBER + '?text=' + msg, '_blank', 'noopener');
  };

  /* ---- Ürün Detay Slider -------------------------------- */
  function initProductSlider() {
    const slider = document.getElementById('productSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const thumbs = slider.querySelectorAll('.slider-thumb');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let current = 0;

    if (slides.length <= 1) return;

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      if (thumbs[current]) thumbs[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      if (thumbs[current]) thumbs[current].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-index'), 10));
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goTo(parseInt(thumb.getAttribute('data-index'), 10));
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      var rect = slider.getBoundingClientRect();
      var inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });
  }

})();
