# 🔬 AlgoLab 2.0 — Algorithm & Data Structures Visualizer

[![Live Demo](https://img.shields.io/badge/Live_Demo-algo--lab--app.netlify.app-5e825d?style=for-the-badge&logo=netlify)](https://algo-lab-app.netlify.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tests Passing](https://img.shields.io/badge/Tests-533_Passed-4a6b53?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Bilingual](https://img.shields.io/badge/i18n-TR_%7C_EN-c88e32?style=for-the-badge)](https://algo-lab-app.netlify.app/)
[![Theme](https://img.shields.io/badge/Theme-Light_%7C_Dark-2b2623?style=for-the-badge)](https://algo-lab-app.netlify.app/)

> **AlgoLab 2.0**, algoritmaları ve veri yapılarını metin yığınları yerine **etkileşimli görsel metaforlar, çift yönlü zaman yolculuğu oynatıcısı, canlı Big-O analizleri ve senkronize sözde kod** ile adım adım öğreten modern bir simülasyon platformudur.

---

## 🌟 Öne Çıkan Özellikler (Key Features)

### 1. 🧱 Doğrusal Veri Yapıları (Linear Data Structures)
- **Stack (Yığın - LIFO)**: Görsel silindir kapsül metaforu, dinamik `TOP` göstergesi, `Push`, `Pop` ve `Peek` anlık animasyonları.
- **Queue (Kuyruk - FIFO)**: Taşıyıcı mekanik bant metaforu, `FRONT` (Çıkış) ve `REAR` (Giriş) kapıları, çift işaretçi takibi.
- **Singly Linked List (Tek Yönlü Bağlı Liste)**: Bellek hücreleri, dinamik SVG bağlayıcı oklar, NULL sonlandırıcı, Başa/Sona Düğüm Ekleme, Silme ve Arama.

### 2. 🌳 Ağaç Veri Yapıları (Tree Data Structures)
- **Binary Search Tree (BST)**: Otomatik hiyerarşik koordinat yerleşimi, SVG Bezier kavisli dallar, Düğüm Ekleme ve Arama.
- **Canlı Ağaç Gezinmeleri (Traversals)**: `In-Order`, `Pre-Order`, `Post-Order` ve `Level-Order (BFS)` gezinmeleri sırasında aktif ziyaret sırası şeridi.

### 3. ⚡ 5 Sıralama Algoritması (Sorting Algorithms)
- **Bubble Sort** (Baloncuk Sıralaması)
- **Selection Sort** (Seçmeli Sıralama)
- **Insertion Sort** (Araya Ekleme Sıralaması)
- **Quick Sort** (Lomuto Bölümleme ile Hızlı Sıralama)
- **Merge Sort** (Birleştirmeli Sıralama)

### 4. 🔍 5 Arama Algoritması (Searching Algorithms)
- **Linear Search** (Doğrusal Arama)
- **Binary Search** (İkili Arama)
- **Jump Search** ($\sqrt{n}$ Blok Sıçrama Araması)
- **Interpolation Search** (Matematiksel Enterpolasyon Araması)
- **Exponential Search** ($2^i$ Üstel Aralık Sınırlandırma ve İkili Arama)

### 5. 🌐 Çift Dilli Destek (Bilingual TR / EN)
- Tek tıkla **Türkçe** ve **İngilizce** arasında geçiş yapabilme (`TR | EN`).
- Arayüz elemanları, algoritma isimleri, butonlar, mikro durum mesajları ve metrikler anında yerelleştirilir.
- Tercih `localStorage` üzerinde saklanır.

### 6. 🌙 Dokunsal & Sıcak Karanlık Mod (Dark Mode)
- Doğal kağıt ve sıcak kömür tonlarında (`#151311`, `#231f1b`, adaçayı yeşili `#7ea37d`, pişmiş toprak `#df8166`) göz yormayan karanlık tema.
- `☀️ / 🌙` butonu ile anında geçiş ve `localStorage` entegrasyonu.

### 7. ⏱️ Durum Motoru & Zaman Yolculuğu (Immutable Snapshot Engine)
- Race-condition içermeyen, tamamen saf durum anlık görüntüsü (Snapshot) tabanlı yürütme mimarisi.
- **Çift Yönlü Kontrol**: İleri adım, geri adım, baştan oynatma, sürükle-bırak zaman tüneli (Scrubber).
- **Hız & Döngü**: 0.5x, 1x, 2x, 4x hız kademeleri ve otomatik tekrarlama modu.

### 8. 📊 Canlı Metrikler & Senkronize Sözde Kod
- **Big-O Analizi**: Ortalama Zaman ve Alan Karmaşıklığı rozetleri.
- **Canlı Sayaçlar**: Karşılaştırma, Takas (Swap) ve İşlem sayıları.
- **İşaretçi Takibi**: `low`, `mid`, `high`, `i`, `j`, `top`, `front`, `rear` gibi anlık işaretçiler.
- **Eş Zamanlı Sözde Kod**: Her adımda yürütülen kod satırını canlı olarak vurgulama.

---

## 🏗️ Proje Mimarisi (Architecture)

```
src/
├── algorithms/             # Sıralama ve Arama algoritmaları
│   ├── sorting/            # Bubble, Selection, Insertion, Quick, Merge
│   ├── searching/          # Linear, Binary, Jump, Interpolation, Exponential
│   └── registry.ts         # Merkezi algoritma kataloğu
├── structures/             # Doğrusal ve Ağaç Veri Yapıları
│   ├── stack/              # Stack motoru, bileşeni ve stilleri
│   ├── queue/              # Queue motoru, bileşeni ve stilleri
│   ├── linkedList/         # Linked List motoru ve zincir SVG çizimi
│   └── bst/                # BST motoru, hiyerarşik yerleşim ve gezinmeler
├── engine/                 # Snapshot yürütme ve zaman yolculuğu motoru
│   ├── types.ts            # Tip tanımları ve snapshot şemaları
│   └── useVisualizerEngine.ts # Oynatma, duraklatma ve geri sarma kancası
├── components/             # Yeniden kullanılabilir UI bileşenleri
│   ├── layout/             # TopNavBar (İki Kademeli), CodeDrawer
│   ├── controls/           # TransportDock, StructureActionToolbar
│   └── visualizers/        # ArrayVisualizer
├── i18n/                   # Türkçe / İngilizce çeviri sözlükleri
│   └── translations.ts
└── styles/                 # Değişkenler, renk paletleri ve tema tokenları
    └── variables.css
```

---

## 🛠️ Kurulum ve Yerel Geliştirme

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/tarikmirzaomerli/algo-lab.git
cd algo-lab

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirici sunucusunu başlatın (Port: 5173)
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı inceleyebilirsiniz.

---

## 🧪 Testleri Çalıştırma

AlgoLab, 35 test dosyasında **533 adet birim ve entegrasyon testine** sahiptir:

```bash
# Testleri tek seferde koşturmak için:
npx vitest run

# Linter kontrolü için:
npm run lint
```

---

## 📦 Üretim Derlemesi (Production Build)

```bash
npm run build
```

Derlenen optimize edilmiş statik dosyalar `dist/` klasörüne yazılır.

---

## 🌐 Canlı Uygulama (Live Demo)

Uygulama Netlify üzerinde sürekli dağıtımla (Continuous Deployment) yayınlanmaktadır:  
👉 **[https://algo-lab-app.netlify.app/](https://algo-lab-app.netlify.app/)**

---

## 📄 Lisans

Bu proje açık kaynaklıdır ve eğitim/geliştirme amaçlı kullanıma uygundur.
