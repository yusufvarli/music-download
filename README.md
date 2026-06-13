# MP3 Toplu İndirme Sitesi

Bu klasör, Kurdi müzik arşivinden seçimli/ZIP olarak MP3 indirmeyi sağlayan
küçük bir web sitesidir. Arkadaşın siteye girer, sanatçı/albüm/parça seçer ve
"İndir" butonlarına basar — dosyalar `Sanatçı/Albüm/Parça.mp3` yapısıyla iner.

Sunucu tarafında küçük bir **CORS proxy** var (`/api/proxy`) — kaynak site
(dangify.net) tarayıcıdan doğrudan indirmeye izin vermediği için, dosyalar
önce bu sunucu üzerinden geçiyor.

## Render.com'a ücretsiz deploy (önerilen)

1. **GitHub'a yükle**
   - GitHub'da yeni, boş bir repo oluştur (örn. `mp3-indirici-site`).
   - Bu `site` klasörünün içeriğini (package.json, server.js, public/, vs.) o
     repoya push et. Örnek (terminalde bu klasörün içindeyken):
     ```
     git init
     git add .
     git commit -m "ilk surum"
     git branch -M main
     git remote add origin https://github.com/KULLANICI_ADIN/mp3-indirici-site.git
     git push -u origin main
     ```

2. **Render'da hesap aç / giriş yap**
   - https://render.com adresine git, GitHub hesabınla giriş yap.

3. **Yeni Web Service oluştur**
   - Dashboard'da **New +** → **Web Service** seç.
   - Az önce push ettiğin repoyu seç.
   - Render, `render.yaml` dosyasını otomatik algılayabilir (varsa "Apply"
     diyebilirsin). Algılamazsa şu ayarları elle gir:
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   - **Create Web Service** butonuna bas.

4. **Bekle ve aç**
   - İlk deploy ~2-5 dakika sürer. Bittiğinde Render sana bir adres verir,
     örn: `https://mp3-indirici-site.onrender.com`
   - Bu adresi arkadaşınla paylaş — tarayıcıda açıp listeden seçip indirebilir.

### Notlar / sınırlamalar (Render Free plan)

- Ücretsiz plan ~15 dakika kullanılmazsa "uyku"ya geçer; ilk istekte 30-60
  saniye gecikme (cold start) olabilir, normaldir.
- Ücretsiz planın aylık çalışma süresi ve bant genişliği sınırlıdır. 86.000+
  parçanın tamamını indirmek bu sınırları zorlayabilir — büyük toplu
  indirmelerde sanatçı/albüm bazında küçük gruplar halinde indirmek daha
  güvenli olur.
- `/api/proxy` sadece `dangify.net` adresine istek yapmaya izin verir
  (kötüye kullanımı önlemek için `server.js` içindeki `ALLOWED_HOSTS`).

## Yerelde test etmek istersen

```
cd site
npm install
npm start
```

Sonra tarayıcıda `http://localhost:3000` adresini aç.
