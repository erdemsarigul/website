/* =========================================================
   Sarıgül Ticaret – Main JS (Sepet ve Sipariş Entegrasyonlu)
   ========================================================= */

(function () {
  'use strict';

  /* ---- Config ------------------------------------------- */
  const PHONE_NUMBER   = '905427447550';  // WhatsApp numarası
  const COOKIE_KEY     = 'sg_cookie_consent';

  /* ---- DOM Hazır ---------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileMenu();
    initCookieBanner();
    initBackToTop();
    initCatalogFilter();
    setActiveNav();
    initWhatsAppLinks();
    initProductSlider();
    
    // Sayfa yüklendiğinde sepet ikonunu hemen güncelle
    window.sepetGuncelle(); 
  });

  /* ---- Tema Değiştirici --------------------------------- */
  var THEME_KEY = 'sg_theme';
  var THEME_GOLD = 'gold';
  var THEME_NAVY = 'navy';

  function initThemeToggle() {
    var btn   = document.getElementById('theme-toggle');
    var label = document.getElementById('theme-toggle-label');
    if (!btn) return;

    var saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === THEME_NAVY ? '' : THEME_GOLD);

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = (current === THEME_GOLD) ? '' : THEME_GOLD;
      applyTheme(next);
      if (next === THEME_GOLD) {
        localStorage.removeItem(THEME_KEY);
      } else {
        localStorage.setItem(THEME_KEY, THEME_NAVY);
      }
    });

    function applyTheme(theme) {
      if (theme === THEME_GOLD) {
        document.documentElement.setAttribute('data-theme', THEME_GOLD);
        if (label) label.textContent = 'Lacivert Tema';
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (label) label.textContent = 'Altın Tema';
      }
    }
  }

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

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

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
    if (localStorage.getItem(COOKIE_KEY)) return;

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
            card.offsetHeight; 
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

  /* ---- SEPET (CART) FONKSİYONLARI ----------------------- */
  // HTML'den erişilebilmesi için "window" objesine bağlıyoruz.
  
  window.sepetGuncelle = function() {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    let toplamAdet = sepet.reduce((toplam, urun) => toplam + urun.adet, 0);
    
    let cartBtn = document.getElementById('floating-cart');
    let cartCount = document.getElementById('cart-count');
    
    if (cartBtn && cartCount) {
      if (toplamAdet > 0) {
        cartBtn.style.display = 'block';
        cartCount.innerText = toplamAdet;
      } else {
        cartBtn.style.display = 'none';
      }
    }
  };

  window.sepeteEkle = function(isim, fiyat, kod, resim) {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    let mevcutUrun = sepet.find(urun => urun.isim === isim); // İsme göre ara
    
    if (mevcutUrun) {
      mevcutUrun.adet += 1; // Zaten varsa sayısını artır
    } else {
      sepet.push({
        isim: isim,
        fiyat: parseFloat(fiyat),
        kod: kod,
        resim: resim,
        adet: 1
      });
    }
    
    localStorage.setItem('sarigul_sepet', JSON.stringify(sepet));
    alert("🛒 " + isim + " sepete eklendi!");
    window.sepetGuncelle(); // Sepet ikonunu anında güncelle
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

    document.addEventListener('keydown', function (e) {
      var rect = slider.getBoundingClientRect();
      var inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

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