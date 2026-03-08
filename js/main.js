/* =========================================================
   Sarıgül Ticaret – Main JS
   ========================================================= */

(function () {
  'use strict';

  /* ---- Config ------------------------------------------- */
  const PHONE_NUMBER   = '905551234567';  // WhatsApp numarası (ülke kodu dahil, + veya boşluk olmadan)
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
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

})();
