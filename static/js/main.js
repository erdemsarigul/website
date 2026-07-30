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
    initSearch();

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

    let badge = document.getElementById('cart-count-badge');
    if (badge) {
      if (toplamAdet > 0) {
        badge.style.display = 'flex';
        badge.innerText = toplamAdet;
      } else {
        badge.style.display = 'none';
      }
    }

    renderCartPanel();
  };

  window.sepeteEkle = function(isim, fiyat, kod, resim) {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    let mevcutUrun = sepet.find(urun => urun.isim === isim);

    if (mevcutUrun) {
      mevcutUrun.adet += 1;
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
    window.sepetGuncelle();
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
    if (!container || !totalEl) return;

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
          '<a href="/urunler/' + urun.kod.toLowerCase() + '/" style="text-decoration:none; cursor:pointer; flex-shrink:0;">' +
            '<img src="' + urun.resim + '" alt="' + urun.isim + '" style="width:56px;height:56px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.04);">' +
          '</a>' +
          '<div style="flex:1;min-width:0;">' +
            '<a href="/urunler/' + urun.kod.toLowerCase() + '/" style="text-decoration:none; color:inherit; cursor:pointer;">' +
              '<div style="color:var(--white);font-size:0.9rem;font-weight:600;margin-bottom:4px;">' + urun.isim + '</div>' +
            '</a>' +
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

    var cartPanel = document.getElementById('cart-panel');
    var cartOverlay = document.getElementById('cart-overlay');
    if (cartPanel) cartPanel.style.display = 'none';
    if (cartOverlay) cartOverlay.style.display = 'none';

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
    // Not: sepet burada KASITLI olarak temizlenmiyor.
    // Sepet, ancak sipariş fiilen WhatsApp'a gönderildiğinde (havaleWhatsappaGec) temizlenir.
    // Aksi halde kullanıcı "Kredi Kartı" seçer veya vazgeçerse sepeti boş bulur.
    localStorage.setItem('sarigul_teslimat_bilgi', JSON.stringify(bilgi));

    // Google Sheets'e gönder (JSON formatında - Apps Script doPost JSON.parse bekliyor)
    fetch(SIPARIS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(Object.assign({}, bilgi, { anahtar: SIPARIS_GIZLI_ANAHTAR }))
    }).catch(function (err) {
      console.warn('Sipariş bilgisi Google Sheets\'e gönderilemedi:', err);
    });

    // Veznedar backend'ine de gönder (hesap sistemi + sipariş takibi için)
    var sepetVeznedar = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    var toplamVeznedar = sepetVeznedar.reduce(function (t, u) { return t + (u.fiyat * u.adet); }, 0);
    var veznedarHeaders = { 'Content-Type': 'application/json' };
    var tokenVarsa = (typeof veznedarTokenAl === 'function') ? veznedarTokenAl() : null;
    if (tokenVarsa) veznedarHeaders['Authorization'] = 'Bearer ' + tokenVarsa;

    fetch(VEZNEDAR_API_URL + '/api/siparisler', {
      method: 'POST',
      headers: veznedarHeaders,
      body: JSON.stringify({
        adSoyad: bilgi.adsoyad,
        telefon: bilgi.telefon,
        adres: bilgi.adres,
        faturaTipi: bilgi.faturaTipi,
        tckimlik: bilgi.tckimlik,
        firmaUnvan: bilgi.firmaUnvan,
        vergiDairesi: bilgi.vergiDairesi,
        vergiNo: bilgi.vergiNo,
        urunler: sepetVeznedar,
        toplamTutar: toplamVeznedar,
        odemeYontemi: 'Belirlenmedi'
      })
    }).catch(function (err) {
      console.warn('Sipariş bilgisi Veznedar\'a gönderilemedi:', err);
    });

    var teslimatModal = document.getElementById('teslimat-bilgi-modal');
    if (teslimatModal) teslimatModal.style.display = 'none';

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

  /* ---- EFT/Havale: WhatsApp'a Geç ve Siparişi Tamamla ----- */
  window.havaleWhatsappaGec = function () {
    let sepet = JSON.parse(localStorage.getItem('sarigul_sepet')) || [];
    var toplam = sepet.reduce(function (t, u) { return t + (u.fiyat * u.adet); }, 0);

    var urunSatirlari = sepet.map(function (u) {
      var satir = '- ' + u.isim + ' x' + u.adet + ' = ' + (u.fiyat * u.adet).toLocaleString('tr-TR') + ' TL';
      if (u.resim) {
        satir += '\n  Görsel: ' + u.resim;
      }
      return satir;
    }).join('\n\n');

    var mesaj = 'Merhaba, EFT/Havale ile siparişimi tamamlamak istiyorum.\n\n' +
      urunSatirlari + '\n\n' +
      'Toplam: ' + toplam.toLocaleString('tr-TR') + ' TL\n\n' +
      'Kuveyt Türk IBAN: TR81 0020 5000 0918 8856 6000 01\n' +
      'Ödemeyi yaptım, dekontu iletiyorum.';

    window.open('https://wa.me/' + PHONE_NUMBER + '?text=' + encodeURIComponent(mesaj), '_blank', 'noopener');

    // Sipariş fiilen WhatsApp'a iletildi - şimdi sepeti temizle
    localStorage.removeItem('sarigul_sepet');
    window.sepetGuncelle();
    alert('✓ Siparişiniz alındı, teşekkürler! WhatsApp üzerinden dekontunuzu iletebilirsiniz.');

    var ibanModal = document.getElementById('iban-modal');
    if (ibanModal) ibanModal.style.display = 'none';
  };

  window.odemeModalKapat = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  };

  /* ---- Ürün Arama ---------------------------------------- */
  var searchIndexCache = null;
  var searchIndexLoading = false;

  function initSearch() {
    var iconBtn = document.getElementById('search-icon-btn');
    var overlay = document.getElementById('search-overlay');
    var closeBtn = document.getElementById('search-close-btn');
    var input = document.getElementById('search-input');
    var resultsBox = document.getElementById('search-results');

    if (!iconBtn || !overlay || !input || !resultsBox) return;

    iconBtn.addEventListener('click', function () {
      overlay.style.display = 'flex';
      input.value = '';
      resultsBox.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin:1.5rem 0;font-size:0.9rem;">Aramaya başlamak için yazın.</p>';
      setTimeout(function () { input.focus(); }, 50);
      loadSearchIndex();
    });

    function kapat() {
      overlay.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', kapat);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) kapat();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') kapat();
    });

    var debounceTimer = null;
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var query = input.value.trim();
      debounceTimer = setTimeout(function () {
        renderSearchResults(query, resultsBox);
      }, 150);
    });
  }

  function loadSearchIndex() {
    if (searchIndexCache || searchIndexLoading) return;
    searchIndexLoading = true;
    fetch('/search-index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchIndexCache = data;
        searchIndexLoading = false;
      })
      .catch(function (err) {
        console.warn('Arama indeksi yüklenemedi:', err);
        searchIndexLoading = false;
      });
  }

  function renderSearchResults(query, resultsBox) {
    if (!query) {
      resultsBox.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin:1.5rem 0;font-size:0.9rem;">Aramaya başlamak için yazın.</p>';
      return;
    }
    if (!searchIndexCache) {
      resultsBox.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin:1.5rem 0;font-size:0.9rem;">Yükleniyor...</p>';
      return;
    }

    var q = query.toLocaleLowerCase('tr-TR');
    var sonuclar = searchIndexCache.filter(function (p) {
      return (p.title || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1 ||
             (p.code || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1 ||
             (p.category || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1 ||
             (p.description || '').toLocaleLowerCase('tr-TR').indexOf(q) !== -1;
    }).slice(0, 20);

    if (sonuclar.length === 0) {
      resultsBox.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin:1.5rem 0;font-size:0.9rem;">Sonuç bulunamadı.</p>';
      return;
    }

    var html = sonuclar.map(function (p) {
      var fiyatHtml = p.price && p.price > 0
        ? '<span style="color:#28a745;font-weight:bold;font-size:0.85rem;">' + p.price + ' TL</span>'
        : '<span style="color:#ffc107;font-size:0.8rem;">Fiyat için sorun</span>';

      return '' +
        '<a href="' + p.url + '" style="display:flex;gap:10px;align-items:center;padding:0.6rem;border-radius:6px;text-decoration:none;transition:background 0.15s;" ' +
           'onmouseover="this.style.background=\'rgba(255,255,255,0.05)\'" onmouseout="this.style.background=\'transparent\'">' +
          '<img src="' + p.image + '" alt="" style="width:44px;height:44px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.04);flex-shrink:0;">' +
          '<span style="flex:1;min-width:0;">' +
            '<span style="display:block;color:var(--white);font-size:0.88rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.title + '</span>' +
            '<span style="display:block;color:var(--text-muted);font-size:0.75rem;">' + (p.category || '') + (p.code ? ' · ' + p.code : '') + '</span>' +
          '</span>' +
          fiyatHtml +
        '</a>';
    }).join('');

    resultsBox.innerHTML = html;
  }

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

  /* =========================================================
     VEZNEDAR BACKEND ENTEGRASYONU (Hesap + Sipariş Takibi)
     ========================================================= */
  var VEZNEDAR_API_URL = 'https://sarigul-pos-backend.onrender.com';

  /* ---- Yardımcı: kayıtlı token/kullanıcıyı oku -------------- */
  function veznedarTokenAl() {
    return localStorage.getItem('sarigul_token') || null;
  }
  function veznedarKullaniciAl() {
    try { return JSON.parse(localStorage.getItem('sarigul_kullanici') || 'null'); }
    catch (e) { return null; }
  }

  /* ---- KAYIT OL --------------------------------------------- */
  window.kayitOlTikla = function () {
    var adSoyad = document.getElementById('kayit-adsoyad').value.trim();
    var email = document.getElementById('kayit-email').value.trim();
    var telefon = document.getElementById('kayit-telefon').value.trim();
    var sifre = document.getElementById('kayit-sifre').value;
    var hataEl = document.getElementById('kayit-hata');

    if (!adSoyad || !email || !sifre) {
      hataEl.textContent = 'Lütfen tüm zorunlu alanları doldurun.';
      hataEl.style.display = 'block';
      return;
    }

    fetch(VEZNEDAR_API_URL + '/api/kayit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adSoyad: adSoyad, email: email, telefon: telefon, sifre: sifre })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          hataEl.textContent = res.data.hata || 'Kayıt sırasında bir hata oluştu.';
          hataEl.style.display = 'block';
          return;
        }
        hataEl.style.display = 'none';
        localStorage.setItem('sarigul_token', res.data.token);
        localStorage.setItem('sarigul_kullanici', JSON.stringify(res.data.kullanici));
        hesapDurumunuGoster();
      })
      .catch(function () {
        hataEl.textContent = 'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.';
        hataEl.style.display = 'block';
      });
  };

  /* ---- GİRİŞ YAP ---------------------------------------------- */
  window.girisYapTikla = function () {
    var email = document.getElementById('giris-email').value.trim();
    var sifre = document.getElementById('giris-sifre').value;
    var hataEl = document.getElementById('giris-hata');

    if (!email || !sifre) {
      hataEl.textContent = 'E-posta ve şifre gereklidir.';
      hataEl.style.display = 'block';
      return;
    }

    fetch(VEZNEDAR_API_URL + '/api/giris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, sifre: sifre })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) {
          hataEl.textContent = res.data.hata || 'Giriş başarısız.';
          hataEl.style.display = 'block';
          return;
        }
        hataEl.style.display = 'none';
        localStorage.setItem('sarigul_token', res.data.token);
        localStorage.setItem('sarigul_kullanici', JSON.stringify(res.data.kullanici));
        hesapDurumunuGoster();
      })
      .catch(function () {
        hataEl.textContent = 'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.';
        hataEl.style.display = 'block';
      });
  };

  /* ---- ÇIKIŞ YAP ------------------------------------------------ */
  window.cikisYapTikla = function () {
    localStorage.removeItem('sarigul_token');
    localStorage.removeItem('sarigul_kullanici');
    hesapDurumunuGoster();
  };

  /* ---- Sekme değiştir (Giriş / Kayıt) -------------------------- */
  window.hesapTabDegistir = function (hangisi) {
    var girisBtn = document.getElementById('tab-giris-btn');
    var kayitBtn = document.getElementById('tab-kayit-btn');
    var girisForm = document.getElementById('giris-formu');
    var kayitForm = document.getElementById('kayit-formu');
    if (!girisBtn) return;

    if (hangisi === 'giris') {
      girisForm.style.display = 'block';
      kayitForm.style.display = 'none';
      girisBtn.style.background = 'var(--primary,#ff4757)';
      girisBtn.style.color = '#fff';
      kayitBtn.style.background = 'rgba(255,255,255,0.05)';
      kayitBtn.style.color = 'var(--text-muted,#a0a5b5)';
    } else {
      girisForm.style.display = 'none';
      kayitForm.style.display = 'block';
      kayitBtn.style.background = 'var(--primary,#ff4757)';
      kayitBtn.style.color = '#fff';
      girisBtn.style.background = 'rgba(255,255,255,0.05)';
      girisBtn.style.color = 'var(--text-muted,#a0a5b5)';
    }
  };

  /* ---- Hesabım sayfası: giriş durumuna göre görünüm ayarla ----- */
  function hesapDurumunuGoster() {
    var authAlani = document.getElementById('hesap-auth-alani');
    var panelAlani = document.getElementById('hesap-panel-alani');
    if (!authAlani || !panelAlani) return; // Bu sayfada değilsek çık

    var token = veznedarTokenAl();
    var kullanici = veznedarKullaniciAl();

    if (token && kullanici) {
      authAlani.style.display = 'none';
      panelAlani.style.display = 'block';
      document.getElementById('hesap-adsoyad').textContent = kullanici.adSoyad;
      document.getElementById('hesap-email').textContent = kullanici.email;
      siparislerimYukle();
    } else {
      authAlani.style.display = 'block';
      panelAlani.style.display = 'none';
    }
  }

  /* ---- Müşterinin kendi siparişlerini yükle --------------------- */
  function siparislerimYukle() {
    var liste = document.getElementById('siparislerim-listesi');
    if (!liste) return;
    var token = veznedarTokenAl();
    if (!token) return;

    fetch(VEZNEDAR_API_URL + '/api/siparislerim', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.siparisler || data.siparisler.length === 0) {
          liste.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Henüz siparişiniz yok.</p>';
          return;
        }
        liste.innerHTML = data.siparisler.map(function (s) {
          var urunler = s.urunler || [];
          var urunSatirlari = urunler.map(function (u) {
            return '<div style="color:var(--text-muted); font-size:0.85rem;">' + u.isim + ' x' + u.adet + ' — ' + (u.fiyat * u.adet).toLocaleString('tr-TR') + ' TL</div>';
          }).join('');
          var tarih = new Date(s.olusturulma_tarihi).toLocaleDateString('tr-TR');
          return '' +
            '<div style="background:var(--dark2,#161b22); border-radius:8px; padding:16px 20px; border:1px solid rgba(255,255,255,0.06); margin-bottom:12px;">' +
              '<div style="display:flex; justify-content:space-between; margin-bottom:8px;">' +
                '<strong style="color:#fff;">' + s.siparis_no + '</strong>' +
                '<span style="color:var(--primary,#ff4757); font-size:0.85rem; font-weight:bold;">' + s.durum + '</span>' +
              '</div>' +
              urunSatirlari +
              '<div style="display:flex; justify-content:space-between; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);">' +
                '<span style="color:var(--text-muted); font-size:0.8rem;">' + tarih + '</span>' +
                '<strong style="color:#28a745;">' + Number(s.toplam_tutar).toLocaleString('tr-TR') + ' TL</strong>' +
              '</div>' +
            '</div>';
        }).join('');
      })
      .catch(function () {
        liste.innerHTML = '<p style="color:#ff6b6b; text-align:center;">Siparişler yüklenirken bir hata oluştu.</p>';
      });
  }

  /* =========================================================
     YÖNETİCİ PANELİ
     ========================================================= */
  function adminAnahtarAl() {
    return sessionStorage.getItem('sarigul_admin_anahtar') || null;
  }

  window.adminGirisTikla = function () {
    var anahtar = document.getElementById('admin-anahtar-input').value.trim();
    var hataEl = document.getElementById('admin-giris-hata');
    if (!anahtar) return;

    fetch(VEZNEDAR_API_URL + '/api/admin/siparisler', {
      headers: { 'x-admin-anahtar': anahtar }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('yetkisiz');
        return r.json();
      })
      .then(function (data) {
        sessionStorage.setItem('sarigul_admin_anahtar', anahtar);
        document.getElementById('admin-giris-alani').style.display = 'none';
        document.getElementById('admin-panel-alani').style.display = 'block';
        adminSiparisleriCiz(data.siparisler);
      })
      .catch(function () {
        hataEl.textContent = 'Anahtar hatalı veya sunucuya ulaşılamadı.';
        hataEl.style.display = 'block';
      });
  };

  window.adminSiparisleriYukle = function () {
    var anahtar = adminAnahtarAl();
    if (!anahtar) return;
    fetch(VEZNEDAR_API_URL + '/api/admin/siparisler', {
      headers: { 'x-admin-anahtar': anahtar }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) { adminSiparisleriCiz(data.siparisler); });
  };

  function adminSiparisleriCiz(siparisler) {
    var liste = document.getElementById('admin-siparis-listesi');
    if (!liste) return;
    if (!siparisler || siparisler.length === 0) {
      liste.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Henüz sipariş yok.</p>';
      return;
    }

    var durumlar = ['Ödeme Bekleniyor', 'Ödeme Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi'];

    liste.innerHTML = siparisler.map(function (s) {
      var urunler = s.urunler || [];
      var urunSatirlari = urunler.map(function (u) {
        return '<div style="color:var(--text-muted); font-size:0.85rem;">' + u.isim + ' x' + u.adet + '</div>';
      }).join('');
      var tarih = new Date(s.olusturulma_tarihi).toLocaleString('tr-TR');
      var secenekler = durumlar.map(function (d) {
        return '<option value="' + d + '" style="background:#161b22; color:#fff;"' + (d === s.durum ? ' selected' : '') + '>' + d + '</option>';
      }).join('');

      return '' +
        '<div style="background:var(--dark2,#161b22); border-radius:8px; padding:18px 20px; border:1px solid rgba(255,255,255,0.06); margin-bottom:14px;">' +
          '<div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:8px;">' +
            '<strong style="color:#fff;">' + s.siparis_no + '</strong>' +
            '<span style="color:var(--text-muted); font-size:0.8rem;">' + tarih + '</span>' +
          '</div>' +
          '<div style="color:#fff; font-size:0.9rem; margin-bottom:4px;">' + s.ad_soyad + ' — ' + s.telefon + '</div>' +
          '<div style="color:var(--text-muted); font-size:0.85rem; margin-bottom:8px;">' + s.adres + '</div>' +
          urunSatirlari +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06); flex-wrap:wrap; gap:10px;">' +
            '<strong style="color:#28a745;">' + Number(s.toplam_tutar).toLocaleString('tr-TR') + ' TL</strong>' +
            '<select onchange="adminDurumGuncelle(\'' + s.siparis_no + '\', this.value)" style="background:#161b22; color:#fff; border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:0.4rem 0.6rem;">' +
              secenekler +
            '</select>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  window.adminDurumGuncelle = function (siparisNo, yeniDurum) {
    var anahtar = adminAnahtarAl();
    if (!anahtar) return;
    fetch(VEZNEDAR_API_URL + '/api/admin/siparisler/' + encodeURIComponent(siparisNo), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-anahtar': anahtar },
      body: JSON.stringify({ durum: yeniDurum })
    }).catch(function () {
      alert('Durum güncellenirken bir hata oluştu.');
    });
  };

  /* ---- Sayfa yüklenince hesap durumunu kontrol et --------------- */
  document.addEventListener('DOMContentLoaded', function () {
    hesapDurumunuGoster();
    // Yönetici sayfasında oturum zaten açıksa doğrudan paneli göster
    var adminAlan = document.getElementById('admin-panel-alani');
    if (adminAlan) {
      var kayitliAnahtar = adminAnahtarAl();
      if (kayitliAnahtar) {
        fetch(VEZNEDAR_API_URL + '/api/admin/siparisler', { headers: { 'x-admin-anahtar': kayitliAnahtar } })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            document.getElementById('admin-giris-alani').style.display = 'none';
            adminAlan.style.display = 'block';
            adminSiparisleriCiz(data.siparisler);
          })
          .catch(function () {});
      }
    }
  });

})();
