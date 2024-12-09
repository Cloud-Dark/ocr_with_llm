# OCR dan AI Chat

Proyek ini adalah aplikasi web untuk ekstraksi teks dari file gambar atau PDF menggunakan OCR (Optical Character Recognition) dan integrasi dengan sistem AI untuk menghasilkan respons berdasarkan hasil OCR.

## Fitur
![image](https://github.com/user-attachments/assets/327c5e98-5525-47b1-a191-432a16cd8118)

- **Upload File**: Mendukung pengunggahan file gambar (JPEG, PNG) dan dokumen PDF.
- **OCR**: Ekstraksi teks dari file gambar atau PDF menggunakan `Tesseract.js` untuk gambar dan `pdf-parse` untuk PDF.
- **Chat AI**: Integrasi dengan API AI untuk menghasilkan respons berdasarkan teks hasil OCR. Hasil respons didukung dengan format Markdown, sehingga tampilannya lebih rapi dan mudah dibaca.
- **Antarmuka Web**: Antarmuka yang intuitif untuk pratinjau file, hasil OCR, dan chat AI.

## Teknologi yang Digunakan

- **Backend**:
  - Node.js dengan framework Express.
  - Library utama: `dotenv`, `multer`, `pdf-parse`, `tesseract.js`, `request`.
- **Frontend**:
  - HTML, CSS, dan JavaScript.
  - Library tambahan: `marked` untuk rendering markdown.
- **Lingkungan**:
  - File `.env` untuk menyimpan konfigurasi sensitif seperti API URL dan API Key.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek ini:

1. **Clone Repository**
   ```bash
   git clone https://github.com/Cloud-Dark/ocr_with_llm.git
   cd ocr_with_llm
   ```

2. **Install Dependencies**
   Pastikan Anda sudah menginstal Node.js, lalu jalankan:
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan**
   Buat file `.env` di root proyek dan tambahkan konfigurasi berikut:
   ```
   AI_API_URL=<URL_API_AI>
   AI_API_KEY=<KUNCI_API_AI>
   ```

4. **Jalankan Server**
   ```bash
   node server.js
   ```
   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Struktur Direktori

- `server.js`: Server backend dengan endpoint untuk OCR dan chat AI.
- `public/index.html`: Halaman web utama dengan antarmuka pengguna.
- `uploads/`: Direktori sementara untuk file yang diunggah.
- `.env`: File konfigurasi lingkungan (tidak diupload ke repository).

## API Endpoint

### 1. **OCR Endpoint**
   - **URL**: `/api/ocr`
   - **Metode**: POST
   - **Header**: 
     - `Content-Type`: multipart/form-data
   - **Body**:
     - `file`: File yang akan diproses.
     - `language` (opsional): Bahasa untuk OCR (default: `eng+ind`).
   - **Respons**:
     ```json
     {
       "success": true,
       "text": "<hasil teks>"
     }
     ```

### 2. **Chat AI Endpoint**
   - **URL**: `/api/chat`
   - **Metode**: POST
   - **Header**: 
     - `Content-Type`: application/json
   - **Body**:
     ```json
     {
       "prompt": "<pertanyaan>",
       "ocr": "<hasil OCR>"
     }
     ```
   - **Respons**:
     ```json
     {
       "success": true,
       "response": "<respons AI>"
     }
     ```

## Cara Penggunaan

1. Buka [http://localhost:3000](http://localhost:3000) di browser.
2. Unggah file gambar atau PDF melalui antarmuka pengguna.
3. Klik tombol "Proses" untuk menjalankan OCR dan mendapatkan hasil teks.
4. Tulis prompt di kolom chat untuk mengirim hasil OCR ke AI dan mendapatkan respons.

## Kontribusi

Kontribusi sangat terbuka! Ikuti langkah berikut untuk berkontribusi:

1. Fork repository ini.
2. Buat branch baru: `git checkout -b fitur-baru`.
3. Commit perubahan Anda: `git commit -m 'Menambahkan fitur baru'`.
4. Push ke branch: `git push origin fitur-baru`.
5. Ajukan Pull Request.

## Lisensi

Proyek ini menggunakan lisensi MIT. Silakan lihat file `LICENSE` untuk detail lebih lanjut.

## Kontak

Jika ada pertanyaan, silakan hubungi:
- GitHub: [Cloud-Dark](https://github.com/Cloud-Dark/ocr_with_llm)
