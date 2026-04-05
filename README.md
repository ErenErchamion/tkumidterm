# TKU Market Frontend

React + TypeScript + Vite + Material UI ile gelistirilmis, backend entegrasyonuna hazir bir e-ticaret arayuzu.

## Ozellikler

- Ana sayfada hero alani ve one cikan urun kartlari
- Urun detay sayfasi (`/product/:id`) ve adet secimi
- Context API tabanli sepet yonetimi
- Drawer tabanli sepet goruntuleme ve checkout akisi
- Mock servis katmani (`src/api/services`) ile Promise bazli gecikmeli veri islemleri
- Siparis olusturma sonrasi basari bildirimi (MUI Snackbar)
- Sol panelde kategori ve marka filtreleme
- Marka secimi ile `/brand/:brandId` rotasinda urun listeleme

## Teknoloji Yigini

- React (functional components + hooks)
- React Router DOM
- React Context API
- Material UI + MUI Icons

## Klasor Yapisi

```text
src/
  api/
    services/
  components/
    cart/
    home/
    layout/
    products/
  context/
  mockData/
  pages/
  router/
  types/
  utils/
```

## Hizli Baslangic

```powershell
npm install
npm run dev
```

## Diger Komutlar

```powershell
npm run build
npm run lint
npm run preview
```

## Servis Katmani Notu

`ProductService` ve `OrderService` icinde kullanilan metot imzalari, ileride Spring Boot + PostgreSQL backend entegrasyonunda `axios/fetch` cagrilarina dogrudan donusturulecek sekilde tasarlanmistir.
