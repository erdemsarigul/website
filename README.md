# Sarıgül Ticaret Website

Hugo ile oluşturulmuş statik web sitesi – GitHub Pages üzerinde yayınlanmaktadır.

## 🚀 Canlı Site

`https://erdemsarigul.github.io/website/`

## 🛠 Yerel Geliştirme

```bash
# Hugo'yu yükleyin (v0.147.0+)
# https://gohugo.io/installation/

# Geliştirme sunucusunu başlatın
hugo server -D

# Siteyi derleyin
hugo --minify
```

## 📦 Ürün Eklemek

Yeni ürün eklemek için `content/urunler/` klasörüne yeni bir `.md` dosyası oluşturun:

```yaml
---
title: "Ürün Adı"
date: 2026-01-01
draft: false
category: "sarj"          # sarj | ses | aksesuar | elektronik | kilif | ekran
categoryLabel: "Şarj"
image: "IMG-00000.jpg"    # static/images/ altındaki dosya adı
badge: "new"              # new | hot | toptan | (boş bırakın)
badgeLabel: "Yeni"
description: "Ürün açıklaması."
featured: false           # true ise ana sayfada görünür
weight: 100               # sıralama numarası
---
```

## 🚀 Deployment

Her `main` branch push'unda GitHub Actions otomatik olarak:
1. Hugo ile siteyi derler
2. `public/` klasörünü GitHub Pages'e yükler

## 📁 Klasör Yapısı

```
├── content/
│   ├── _index.md          # Ana sayfa içeriği
│   ├── urunler/           # Ürün MD dosyaları (her ürün ayrı dosya)
│   ├── iletisim/          # İletişim sayfası
│   └── gizlilik/          # Gizlilik politikası
├── layouts/               # Hugo şablonları
│   ├── _default/baseof.html
│   ├── index.html         # Ana sayfa şablonu
│   ├── urunler/list.html  # Ürün kataloğu şablonu
│   └── partials/          # Tekrar kullanılan parçalar
├── static/                # CSS, JS, görseller
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
└── .github/workflows/hugo.yml  # GitHub Pages deploy
```