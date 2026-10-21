---
trigger: always_on
---

# PROJECT RULES: Portfolio Desainer Grafis "Blue Ink Archive"

## Identitas
- Nama: Hprxject
- Spesialisasi: [Graphic design]
- Kontak: [email, Instagram, Behance, discord]
- Bahasa konten: inggris

## Tujuan
Website portfolio personal, siap deploy ke Vercel free tier. Estetika:
katalog arsip bergaya editorial Swiss dengan permukaan hasil cetak
risograph satu tinta biru. Dark mode default, light mode alternatif.

## Palet (CSS variables, jangan tambah warna lain)
Dark (default): --bg #0B0B0C | --fg #ECEAE3 | --ink #1C81DA | --line rgba(236,234,227,0.18)
Light: --bg #ECEAE3 | --fg #0B0B0C | --ink #1C81DA | --line rgba(11,11,12,0.2)
- Biru hanya untuk teks besar (>=24px), garis, blok, dan overlay gambar.
  Teks kecil memakai --fg.
- Toggle dark/light: simpan di localStorage, ikuti prefers-color-scheme
  saat kunjungan pertama, tanpa flash saat load.

## Tipografi (Google Fonts, fallback jelas)
- Display: Fraunces (variable, boleh italic) untuk judul, skala ekstrem.
- Mono: JetBrains Mono untuk nomor indeks, label, metadata, navigasi
  (uppercase kecil, letter-spacing lebar).
- Body: Instrument Sans, min 16px, line-height 1.5.

## Elemen visual khas
1. Katalog: nomor indeks otomatis (001, 002, ...) dari field order;
   metadata gaya arsip `001 / BRAND IDENTITY / 2026 / KLIEN`.
2. Daftar proyek berbentuk tabel bergaris tipis. Hover (perangkat dengan
   hover) menampilkan gambar proyek duotone biru yang mengikuti kursor.
3. Gambar bergaya riso: duotone biru + hitam/putih, grain halus,
   halftone tipis. Halaman detail punya toggle "ORIGINAL / RISO".
4. Misregistration: judul besar punya lapisan duplikat biru bergeser
   2-3px, lebih jauh saat hover.
5. Overprint: elemen biru memakai mix-blend-mode (screen di dark,
   multiply di light), hanya pada elemen kecil.
6. Detail arsip: crop mark di sudut section, label "SHEET 01/05",
   kode registrasi kecil, tanggal update terakhir di footer.
7. Transisi halaman singkat (wipe biru). Hormati prefers-reduced-motion.

## Anti "AI slop" (wajib)
- DILARANG: gradasi ungu/biru, glassmorphism, font Inter/Roboto/Arial,
  emoji sebagai ikon, grid 3 kartu identik rounded + shadow, hero generik
  "Hi, I'm X, a creative designer", stock illustration, Lorem ipsum,
  copy klise ("passionate", "crafting experiences").
- Sudut tajam (radius 0) kecuali ada alasan kuat.
- Layout asimetris, whitespace disengaja, bukan semua rata tengah.
- Copy singkat, spesifik, bernada personal.

## Mobile (wajib, desain dari 360px ke atas)
- Uji di 360, 390, 768, 1024, 1440px. Tidak boleh ada scroll horizontal.
- Tipografi fluid dengan batas: clamp(min, vw, max), mis. hero
  clamp(3rem, 14vw, 12rem). Pakai overflow-wrap dan text-wrap: balance.
- Nav mobile: header ringkas (nama + tombol "MENU" mono) membuka overlay
  layar penuh dengan tautan besar. Tutup via tombol dan Esc, fokus
  terkunci di overlay saat terbuka.
- Tabel katalog di <768px jadi daftar bertumpuk: baris 1 nomor + judul
  (Fraunces), baris 2 kategori / tahun (mono kecil), thumbnail duotone
  kecil di kanan. Seluruh baris bisa disentuh.
- Efek hover punya padanan sentuh: kursor-ikut diganti thumbnail statis;
  misregistration aktif saat :active/focus atau animasi singkat saat
  masuk layar. Bungkus efek hover dengan @media (hover: hover). Hover
  tidak boleh jadi satu-satunya cara melihat informasi.
- Target sentuh min 44x44px.
- Galeri detail: satu kolom full-width, scroll vertikal; tap gambar untuk
  memperbesar dengan tombol tutup.
- Performa: grain berupa satu gambar PNG/SVG kecil yang di-tile (bukan
  filter live), batasi mix-blend-mode, matikan efek berat di <768px atau
  saat prefers-reduced-motion, gunakan sizes/srcset dan lazy loading.
- Pakai 100dvh (bukan 100vh), padding env(safe-area-inset-*), meta
  viewport dengan viewport-fit=cover.
- Crop mark dan label SHEET diperkecil/disembunyikan bila mengganggu.

## Sistem konten (kustomisasi tanpa mengedit komponen)
- `content/projects/` berisi satu file per proyek (MDX atau JSON) dengan
  field: title, slug, category, year, client, role, tools, cover,
  images[] (dengan alt), description, featured, order.
- Gambar di `public/projects/[slug]/`.
- `content/site.json`: nama, bio, kontak, link sosial, teks hero, warna ink.
- Menambah proyek = 1 file + gambar. Tidak ada kode lain yang diubah.
- 3 contoh proyek dengan placeholder lokal (bukan hotlink).

## Teknis
- Next.js (App Router) + TypeScript + Tailwind CSS.
- next/image untuk optimasi gambar.
- Lighthouse mobile: performa & aksesibilitas > 90.
- Alt text semua gambar, fokus keyboard jelas (outline biru), kontras memadai.
- SEO dasar: metadata, Open Graph image, sitemap, favicon.
- Tanpa database/backend berbayar. Form kontak: Web3Forms/Formspree
  atau cukup mailto.

## Cara kerja agent
- Kerjakan HANYA tahap yang diminta. Jangan menambah fitur di luar itu.
- Tunjukkan rencana file yang akan dibuat/diubah sebelum menulis kode.
- Jangan membuka browser untuk verifikasi kecuali diminta.
- Revisi: ubah hanya file/komponen yang disebut.