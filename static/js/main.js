/* =========================================================
   Sarıgül Ticaret – Main JS (Sepet ve Sipariş Entegrasyonlu)
   ========================================================= */

(function () {
  'use strict';

  /* ---- Config ------------------------------------------- */
  const PHONE_NUMBER   = '905427447550';  // WhatsApp numarası
  const COOKIE_KEY     = 'sg_cookie_consent';
  const SIPARIS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyaSt4YR6TRaxrR6m-QKHKJWiLSHzGQR3W-QMMxLiD4O6LcodU1-PFVpuP8UWXVEI_x/exec';
  const SIPARIS_GIZLI_ANAHTAR = 'sarigul-2026-siparis-x7k9';

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
    
    // Eski/alternatif sepet ikonu (varsa)
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

    // Header'daki sepet ikonu rozeti
    let badge = document.getElementById('cart-count-badge');
    if (badge) {
      if (toplamAdet > 0) {
        badge.style.display = 'flex';
        badge.innerText = toplamAdet;
      } else {
        badge.style.display = 'none';
      }
    }

    // Sepet paneli açıksa içeriğini de tazele
    renderCartPanel();
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

  /* ---- Sepet Panelini Aç/Kapat --------------------------- */
  window.sepetiAcKapat = function () {
    var panel = document.getElementById('cart-panel');
    var overlay = document.getElementById('cart-overlay');
    if (!panel || !overlay) return;

    var isOpen = panel.style.display === 'flex';

    if (isOpen) {
      panel.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    } else {
      panel.style.display = 'flex';
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      renderCartPanel();
    }
  };

  /* ---- Sepetten Ürün Çıkar / Adet Güncelle --------------- */
  window.sepettenCikar = function (isim) {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    sepet = sepet.filter(function (urun) { return urun.isim !== isim; });
    localStorage.setItem('sarigul_sepet', JSON.stringify(sepet));
    window.sepetGuncelle();
  };

  window.sepetAdetDegistir = function (isim, delta) {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    let urun = sepet.find(function (u) { return u.isim === isim; });
    if (!urun) return;
    urun.adet += delta;
    if (urun.adet <= 0) {
      sepet = sepet.filter(function (u) { return u.isim !== isim; });
    }
    localStorage.setItem('sarigul_sepet', JSON.stringify(sepet));
    window.sepetGuncelle();
  };

  /* ---- Sepet Panelinin İçeriğini Çiz --------------------- */
  function renderCartPanel() {
    var container = document.getElementById('cart-items-container');
    var totalEl = document.getElementById('cart-total-price');
    if (!container || !totalEl) return; // Bu sayfada sepet paneli yoksa çık

    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];

    if (sepet.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin-top:2rem;">Sepetiniz boş.</p>';
      totalEl.innerText = '0 TL';
      return;
    }

    var toplam = 0;
    var html = '';

    sepet.forEach(function (urun) {
      var satirToplam = urun.fiyat * urun.adet;
      toplam += satirToplam;

      html += '' +
        '<div style="display:flex;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.06);align-items:center;">' +
          '<img src="' + urun.resim + '" alt="' + urun.isim + '" style="width:56px;height:56px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.04);flex-shrink:0;">' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="color:var(--white);font-size:0.9rem;font-weight:600;margin-bottom:4px;">' + urun.isim + '</div>' +
            '<div style="color:var(--primary);font-weight:bold;font-size:0.9rem;">' + urun.fiyat + ' TL</div>' +
            '<div style="display:flex;align-items:center;gap:8px;margin-top:6px;">' +
              '<button onclick="sepetAdetDegistir(\'' + urun.isim.replace(/'/g, "\\'") + '\', -1)" style="width:24px;height:24px;border-radius:4px;border:none;background:rgba(255,255,255,0.1);color:#fff;cursor:pointer;">−</button>' +
              '<span style="color:#fff;font-size:0.85rem;min-width:18px;text-align:center;">' + urun.adet + '</span>' +
              '<button onclick="sepetAdetDegistir(\'' + urun.isim.replace(/'/g, "\\'") + '\', 1)" style="width:24px;height:24px;border-radius:4px;border:none;background:rgba(255,255,255,0.1);color:#fff;cursor:pointer;">+</button>' +
            '</div>' +
          '</div>' +
          '<button onclick="sepettenCikar(\'' + urun.isim.replace(/'/g, "\\'") + '\')" aria-label="Ürünü kaldır" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;flex-shrink:0;">&times;</button>' +
        '</div>';
    });

    container.innerHTML = html;
    totalEl.innerText = toplam.toLocaleString('tr-TR') + ' TL';
  }

  /* ---- Siparişi Tamamla: Önce Teslimat/Fatura Bilgileri --- */
  window.siparisiTamamla = function () {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    if (sepet.length === 0) {
      alert('Sepetiniz boş. Lütfen önce ürün ekleyin.');
      return;
    }

    // Sepet panelini kapatıp teslimat formunu aç
    var cartPanel = document.getElementById('cart-panel');
    var cartOverlay = document.getElementById('cart-overlay');
    if (cartPanel) cartPanel.style.display = 'none';
    if (cartOverlay) cartOverlay.style.display = 'none';

    // Önceden kaydedilmiş bilgi varsa formu onunla doldur
    var kayitli = JSON.parse(localStorage.getItem('sarigul_teslimat_bilgi') || 'null');
    if (kayitli) {
      var f = function (id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
      f('tb-adsoyad', kayitli.adsoyad);
      f('tb-telefon', kayitli.telefon);
      f('tb-adres', kayitli.adres);
      f('tb-tckimlik', kayitli.tckimlik);
      f('tb-firma-unvan', kayitli.firmaUnvan);
      f('tb-vergi-dairesi', kayitli.vergiDairesi);
      f('tb-vergi-no', kayitli.vergiNo);
      var radios = document.querySelectorAll('input[name="tb-fatura-tipi"]');
      radios.forEach(function (r) { r.checked = (r.value === kayitli.faturaTipi); });
    }
    faturaTipiDegisti();

    var uyari = document.getElementById('tb-uyari');
    if (uyari) uyari.style.display = 'none';

    var modal = document.getElementById('teslimat-bilgi-modal');
    if (modal) modal.style.display = 'flex';
  };

  /* ---- Fatura Tipi Değişti: Bireysel/Kurumsal Alanları ---- */
  window.faturaTipiDegisti = function () {
    var secili = document.querySelector('input[name="tb-fatura-tipi"]:checked');
    var tip = secili ? secili.value : 'bireysel';
    var bireysel = document.getElementById('tb-bireysel-alan');
    var kurumsal = document.getElementById('tb-kurumsal-alan');
    if (bireysel) bireysel.style.display = (tip === 'bireysel') ? 'block' : 'none';
    if (kurumsal) kurumsal.style.display = (tip === 'kurumsal') ? 'block' : 'none';
  };

  /* ---- Teslimat/Fatura Bilgisini Kaydet, Ödeme Modalını Aç -- */
  window.teslimatBilgisiKaydet = function () {
    var adsoyad = document.getElementById('tb-adsoyad').value.trim();
    var telefon = document.getElementById('tb-telefon').value.trim();
    var adres = document.getElementById('tb-adres').value.trim();
    var secili = document.querySelector('input[name="tb-fatura-tipi"]:checked');
    var faturaTipi = secili ? secili.value : 'bireysel';

    var tckimlik = document.getElementById('tb-tckimlik').value.trim();
    var firmaUnvan = document.getElementById('tb-firma-unvan').value.trim();
    var vergiDairesi = document.getElementById('tb-vergi-dairesi').value.trim();
    var vergiNo = document.getElementById('tb-vergi-no').value.trim();

    var uyari = document.getElementById('tb-uyari');
    var gecerli = adsoyad && telefon && adres;
    if (faturaTipi === 'kurumsal') {
      gecerli = gecerli && firmaUnvan && vergiDairesi && vergiNo;
    }

    if (!gecerli) {
      if (uyari) uyari.style.display = 'block';
      return;
    }
    if (uyari) uyari.style.display = 'none';

    var bilgi = {
      adsoyad: adsoyad,
      telefon: telefon,
      adres: adres,
      faturaTipi: faturaTipi,
      tckimlik: tckimlik,
      firmaUnvan: firmaUnvan,
      vergiDairesi: vergiDairesi,
      vergiNo: vergiNo
    };
    localStorage.setItem('sarigul_teslimat_bilgi', JSON.stringify(bilgi));

    // Google Sheets'e gönder (arka planda, sessizce - hata olsa da akışı durdurmaz)
    fetch(SIPARIS_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(Object.assign({}, bilgi, { anahtar: SIPARIS_GIZLI_ANAHTAR }))
    }).catch(function (err) {
      console.warn('Sipariş bilgisi Google Sheets\'e gönderilemedi:', err);
    });

    var teslimatModal = document.getElementById('teslimat-bilgi-modal');
    if (teslimatModal) teslimatModal.style.display = 'none';

    // Mevcut ödeme yöntemi modalını aç (sözleşme onayı dahil, değişmedi)
    var odemeModal = document.getElementById('payment-method-modal');
    if (odemeModal) {
      odemeModal.style.display = 'flex';
      var checkbox = document.getElementById('sozlesme-onay-checkbox');
      if (checkbox) checkbox.checked = false;
      var sozlesmeUyari = document.getElementById('sozlesme-uyari');
      if (sozlesmeUyari) sozlesmeUyari.style.display = 'none';
      sozlesmeOnayDegisti();
    }
  };

  /* ---- Sözleşme Onay Checkbox'ı Değişti ------------------- */
  window.sozlesmeOnayDegisti = function () {
    var checkbox = document.getElementById('sozlesme-onay-checkbox');
    var havaleBtn = document.getElementById('odeme-havale-btn');
    var kartBtn = document.getElementById('odeme-kart-btn');
    if (!checkbox || !havaleBtn || !kartBtn) return;

    var onaylandi = checkbox.checked;

    [havaleBtn, kartBtn].forEach(function (btn) {
      btn.disabled = !onaylandi;
      btn.style.opacity = onaylandi ? '1' : '0.45';
      btn.style.cursor = onaylandi ? 'pointer' : 'not-allowed';
    });
  };

  /* ---- Ödeme Yöntemi: Kredi Kartı (yakında) -------------- */
  window.odemeKrediKarti = function () {
    var checkbox = document.getElementById('sozlesme-onay-checkbox');
    if (checkbox && !checkbox.checked) {
      var uyari = document.getElementById('sozlesme-uyari');
      if (uyari) uyari.style.display = 'block';
      return;
    }
    alert('💳 Kredi kartı ile online ödeme sistemimiz şu anda hazırlık aşamasında.\n\nÇok yakında aktif olacak! Şimdilik EFT/Havale veya WhatsApp üzerinden siparişinizi tamamlayabilirsiniz.');
  };

  /* ---- Ödeme Yöntemi: EFT/Havale -------------------------- */
  window.odemeHavale = function () {
    var checkbox = document.getElementById('sozlesme-onay-checkbox');
    if (checkbox && !checkbox.checked) {
      var uyari = document.getElementById('sozlesme-uyari');
      if (uyari) uyari.style.display = 'block';
      return;
    }
    var modal = document.getElementById('payment-method-modal');
    if (modal) modal.style.display = 'none';
    var ibanModal = document.getElementById('iban-modal');
    if (ibanModal) ibanModal.style.display = 'flex';
  };

  window.ibanKopyala = function () {
    var ibanText = 'TR81 0020 5000 0918 8856 6000 01';
    navigator.clipboard.writeText(ibanText.replace(/\s/g, '')).then(function () {
      var btn = document.getElementById('iban-copy-btn');
      if (btn) {
        var oldText = btn.innerText;
        btn.innerText = '✓ Kopyalandı';
        setTimeout(function () { btn.innerText = oldText; }, 1800);
      }
    });
  };

  window.havaleWhatsappaGec = function () {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    var toplam = sepet.reduce(function (t, u) { return t + (u.fiyat * u.adet); }, 0);

    var urunSatirlari = sepet.map(function (u) {
      return '- ' + u.isim + ' x' + u.adet + ' = ' + (u.fiyat * u.adet).toLocaleString('tr-TR') + ' TL';
    }).join('\n');

    var mesaj = 'Merhaba, EFT/Havale ile siparişimi tamamlamak istiyorum.\n\n' +
      urunSatirlari + '\n\n' +
      'Toplam: ' + toplam.toLocaleString('tr-TR') + ' TL\n\n' +
      'Kuveyt Türk IBAN: TR81 0020 5000 0918 8856 6000 01\n' +
      'Ödemeyi yaptım, dekontu iletiyorum.';

    window.open('https://wa.me/' + PHONE_NUMBER + '?text=' + encodeURIComponent(mesaj), '_blank', 'noopener');

    var ibanModal = document.getElementById('iban-modal');
    if (ibanModal) ibanModal.style.display = 'none';
  };

  window.odemeModalKapat = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
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