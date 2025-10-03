# 🎬 TV+ Sosyal İzleme - Social Watch Party

Netflix Party benzeri arkadaşlarla birlikte senkronize film/dizi izleme uygulaması.

## ✨ Özellikler

- 🏠 **Oda Oluşturma & Davet Sistemi**
- 🗳️ **İçerik Oylama** - En çok oy alan içerik izlenir
- ▶️ **Senkronize Oynatma** - Host video kontrollerini yönetir
- 💬 **Gerçek Zamanlı Sohbet** - Rate limiting ile spam koruması
- 😀 **Emoji Tepkileri** - Hızlı emoji butonları
- 💰 **Masraf Paylaşımı** - Pizza/atıştırmalık masraflarını böl
- 📱 **Responsive Tasarım** - Mobile-friendly UI

## 🛠️ Teknolojiler

- **Frontend:** React 19 + Tailwind CSS
- **UI Library:** Shadcn/UI (Radix UI tabanlı)
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Routing:** React Router DOM v7

## 🚀 Kurulum

1. **Proje Klasörü Oluştur:**
```bash
mkdir tv-plus-social-watch
cd tv-plus-social-watch
```

2. **Dosya Yapısını Oluştur:**
```bash
mkdir -p src/components/ui src/data src/hooks public
```

3. **Bağımlılıkları Yükle:**
```bash
yarn install
```

4. **Geliştirme Sunucusunu Başlat:**
```bash
yarn start
```

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── WatchParty.jsx      # Ana izleme sayfası
│   ├── RoomCreation.jsx    # Oda oluşturma
│   ├── VotingTab.jsx       # İçerik oylama
│   ├── ChatTab.jsx         # Sohbet sistemi
│   ├── SplitTab.jsx        # Masraf paylaşımı
│   └── ui/                 # Shadcn UI bileşenleri
├── data/
│   └── mock.js             # Mock data & API simülasyonu
├── hooks/
│   └── use-toast.js        # Toast notifications
└── App.js                  # Ana uygulama
```

## 🎮 Kullanım

1. **Oda Oluştur:** İsim, tarih, saat belirle
2. **Arkadaşları Davet Et:** Link/QR kod paylaş
3. **İçerik Seç:** Favori film/dizi için oy ver
4. **İzlemeye Başla:** Host video kontrollerini yönetir
5. **Sosyal Etkileşim:** Sohbet et, emoji gönder
6. **Masrafları Böl:** Pizza/atıştırmalık masraflarını paylaş

## 🔧 Mock Data

Şu anda tüm özellikler mock data ile çalışmaktadır:
- Kullanıcı profilleri (avatar'lar Pravatar'dan)
- İçerik kataloğu (Unsplash posterları)
- Sohbet mesajları
- Masraf hesaplamaları

## 🛣️ Roadmap

- [ ] **Backend API** (FastAPI + MongoDB)
- [ ] **WebSocket** - Gerçek zamanlı senkronizasyon
- [ ] **User Authentication** 
- [ ] **Video Stream Integration**
- [ ] **Push Notifications**
- [ ] **Mobile App** (React Native)

