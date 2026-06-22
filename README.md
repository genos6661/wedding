# Quest of Two Hearts — Retro RPG Wedding Invitation

Undangan pernikahan digital bertema RPG retro (SNES era) yang berubah menjadi
gulungan surat elegan. Dibuat murni dengan **HTML + CSS + JavaScript + jQuery**
(plus GSAP via CDN untuk animasi scroll). Tidak ada build tool, tidak ada
Node dependency — cukup buka `index.html` di browser, atau upload ke hosting
biasa.

## Cara Menjalankan

1. Buka `index.html` langsung di browser (double-click), **atau**
2. Upload seluruh folder ke hosting statis apa pun (Netlify, Vercel static,
   cPanel, GitHub Pages, dll). Tidak perlu server/backend.

> Catatan: butuh koneksi internet saat dibuka karena font (Google Fonts),
> jQuery, dan GSAP dimuat dari CDN. Jika ingin 100% offline, unduh file-file
> tersebut dan ganti `<link>`/`<script src>` di `index.html` agar menunjuk ke
> file lokal.

## Struktur File

```
/index.html          → struktur halaman & urutan "chapter" gulungan
/css/style.css        → semua styling (boot terminal, parchment, dsb)
/js/app.js            → logic + objek data undangan (weddingData)
/assets/images/       → 6 foto placeholder pixel-art (ganti dengan foto asli)
/assets/audio/        → taruh theme.mp3, confirm.mp3, page.mp3 di sini (opsional)
/assets/icons/        → ikon scroll untuk sequence "Item Acquired"
```

## Cara Mengubah Isi Undangan

Semua data ada di satu tempat: object `weddingData` di **`js/app.js`** baris ±8.

```js
const weddingData = {
  groomName: "Raka Putra Wijaya",
  brideName: "Salsabila Anindya",
  groomShort: "Raka",
  brideShort: "Salsa",
  weddingDate: "2026-09-12T09:00:00",   // dipakai countdown
  weddingDateDisplay: "Sabtu, 12 September 2026",
  weddingTimeDisplay: "09.00 WIB — selesai",
  venue: "Graha Kencana Hall",
  address: "Jl. Mawar Indah No. 21, Lumajang, Jawa Timur",
  mapLink: "https://maps.google.com/?q=...",
  quote: "...",
  story: ["paragraf 1", "paragraf 2", "..."],
  gallery: [
    { src: "assets/images/memory-01.jpg", caption: "First Meeting" },
    // tambah/kurangi 4–8 foto
  ],
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "1234567890",
  accountHolder: "Raka Putra Wijaya",
  signatureNames: "Raka & Salsa"
};
```

Ubah nilai-nilai di atas, simpan, refresh browser — seluruh halaman otomatis
mengikuti.

### Mengganti Foto Gallery
Taruh file `.jpg`/`.png` di `assets/images/`, lalu update `src` di array
`gallery` pada `weddingData`. Boleh 4–8 foto.

### Mengganti Foto Pasangan (bagian penutup)
Dua foto potret yang tampil berdampingan di akhir gulungan. Ganti file:
- `assets/images/groom-portrait.jpg` — foto mempelai pria
- `assets/images/bride-portrait.jpg` — foto mempelai wanita

Atau ubah path-nya langsung di `weddingData.groomPortrait` /
`weddingData.bridePortrait` pada `js/app.js` jika ingin nama file berbeda.
Disarankan rasio potret (vertikal), karena frame foto memakai aspect-ratio 3:4.

### Menambahkan Musik (opsional)
Taruh file audio di `assets/audio/`:
- `theme.mp3` — musik latar loop, mulai otomatis saat scroll dibuka
- `confirm.mp3` — sfx tombol/konfirmasi
- `page.mp3` — sfx saat membuka galeri

Jika file tidak ada, website tetap berjalan normal tanpa suara (silent fail).

## Fitur Utama
- **Modal nama pemain** (sebelum boot terminal): membaca query `?player_name=`
  di URL. Jika belum ada, tampil modal kosong untuk diisi lalu otomatis
  menambahkan `?player_name=...` ke URL. Jika sudah ada, modal tetap tampil
  terisi otomatis lalu "auto-submit" sejenak kemudian.
- Nama pemain muncul sebagai baris khusus (`WELCOME, NAMA!`) di terminal boot,
  dengan jeda tampil yang sedikit lebih lama dari baris lain.
- Boot terminal retro dengan animasi mengetik (skip dengan klik/tap)
- Sequence "Item Acquired" + tombol buka scroll
- Animasi gulungan terbuka (GSAP)
- Satu gulungan panjang berisi chapter: pembukaan, nama, kutipan, cerita,
  info acara, countdown, galeri (lightbox), RSVP, gift (treasure chest),
  **foto pasangan berdampingan**, lalu penutup
- Tanda tangan animasi (SVG stroke draw-on)
- Easter egg achievement strip
- Toggle musik latar
- Fallback otomatis jika CDN gagal dimuat (tidak blank page)

## Mengintegrasikan RSVP ke Backend Sungguhan
Saat ini submit RSVP hanya tersimpan di `console.log` (tidak ada backend,
sesuai permintaan "tanpa Node/bundler"). Untuk menyimpan data sungguhan,
cari fungsi `initRsvpForm()` di `js/app.js` dan ganti bagian
`// NOTE: This demo stores nothing server-side...` dengan pemanggilan
`fetch()` ke endpoint pilihan Anda (misalnya Google Apps Script Web App,
Formspree, atau API sendiri).
