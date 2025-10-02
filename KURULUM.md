# 🎬 TV+ Sosyal İzleme - Kurulum Kılavuzu

## 📁 Dosya Yapısını Oluşturma

1. **Ana klasör oluşturun:**
```bash
mkdir tv-plus-social-watch
cd tv-plus-social-watch
```

2. **Alt klasörleri oluşturun:**
```bash
mkdir -p src/components/ui src/data src/hooks src/lib public
```

## 📄 Dosyaları Kopyalayın

### Kök Dizin Dosyaları:
- `package.json`
- `tailwind.config.js` 
- `craco.config.js`
- `postcss.config.js`
- `README.md`

### public/ Klasörü:
- `index.html`

### src/ Klasörü:
- `index.js`
- `App.js`
- `App.css`
- `index.css`

### src/lib/ Klasörü:
- `utils.js`

### src/hooks/ Klasörü:
- `use-toast.js`

### src/data/ Klasörü:
- `mock.js`

### src/components/ Klasörü:
- `WatchParty.jsx`
- `RoomCreation.jsx`
- `VotingTab.jsx`
- `ChatTab.jsx`
- `SplitTab.jsx`

### src/components/ui/ Klasörü:
- `button.jsx`
- `card.jsx`
- `tabs.jsx`
- `input.jsx`
- `label.jsx`
- `avatar.jsx`
- `badge.jsx`
- `progress.jsx`
- `dialog.jsx`
- `scroll-area.jsx`
- `toast.jsx`
- `toaster.jsx`

## 🚀 Kurulum ve Çalıştırma

```bash
# 1. Bağımlılıkları yükle
yarn install

# 2. Geliştirme sunucusunu başlat
yarn start
```

## ✅ Test Etme

1. Tarayıcıda `http://localhost:3000` açın
2. "Demo Odaya Katıl" butonuna tıklayın
3. Oylama, Sohbet, Split sekmelerini test edin

## 🔧 Sorun Giderme

### Hata: Cannot find module
```bash
yarn add @radix-ui/react-slot @radix-ui/react-avatar @radix-ui/react-tabs
```

### Import hatası (@/lib/utils)
`src/lib/utils.js` dosyasının oluşturulduğundan emin olun.

### CSS yüklenmezse
`craco.config.js` ve `postcss.config.js` dosyalarının mevcut olduğunu kontrol edin.

## 📱 Özellikler

✅ **Çalışan:** Oda oluşturma, oylama, sohbet, masraf paylaşımı
🚧 **Geliştiriliyor:** Backend API, WebSocket, authentication

Tebrikler! 🎉 Uygulamanız çalışmaya hazır!