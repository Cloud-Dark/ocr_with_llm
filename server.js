require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const request = require('request');

// Inisialisasi Express
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Format file tidak didukung.'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Ambil konfigurasi dari file .env
const AI_API_URL = process.env.AI_API_URL;
const AI_API_KEY = process.env.AI_API_KEY;

// Fungsi untuk mengirim data ke AI
function sendToAI(prompt, ocr) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: AI_API_URL,
            headers: {
                Authorization: `Bearer ${AI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'Kamu adalah asisten pribadi untuk OCR.' },
                    { role: 'user', content: `Ini adalah hasil OCR: ${ocr}` },
                    { role: 'user', content: prompt },
                ],
            }),
        };

        request(options, (error, response, body) => {
            if (error) return reject(new Error('Gagal menghubungi AI.'));
            try {
                const parsedBody = JSON.parse(body);
                if (parsedBody.result?.response) {
                    resolve(parsedBody.result.response);
                } else {
                    reject(new Error('Respons AI tidak valid.'));
                }
            } catch (err) {
                reject(new Error('Gagal mem-parse respons AI.'));
            }
        });
    });
}

// Fungsi untuk memproses PDF menggunakan pdf-parse
async function extractTextFromPDF(filePath) {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text;
}

// Endpoint untuk OCR
app.post('/api/ocr', upload.single('file'), async (req, res) => {
    const file = req.file;
    const language = req.body.language || 'eng+ind'; // Default: Inggris + Indonesia

    if (!file) {
        return res.status(400).json({ success: false, message: 'File tidak ditemukan.' });
    }

    try {
        let extractedText = '';

        if (file.mimetype === 'application/pdf') {
            // Proses file PDF
            extractedText = await extractTextFromPDF(file.path);
        } else {
            // Proses file gambar menggunakan Tesseract.js
            const result = await Tesseract.recognize(file.path, language, {
                logger: (info) => console.log(info), // Untuk debugging
            });
            extractedText = result.data.text;
        }

        // Hapus file setelah selesai diproses
        fs.unlinkSync(file.path);

        // Kirim hasil teks OCR
        res.json({ success: true, text: extractedText });
    } catch (error) {
        console.error('Error OCR:', error);

        // Hapus file jika terjadi error
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

        res.status(500).json({ success: false, message: 'Gagal memproses OCR.' });
    }
});

// Endpoint untuk Chat AI
app.post('/api/chat', async (req, res) => {
    const { prompt, ocr } = req.body; // Ambil prompt dan hasil OCR dari body request

    if (!prompt || !ocr) {
        return res.status(400).json({ success: false, message: 'Prompt atau hasil OCR tidak boleh kosong.' });
    }

    try {
        // Kirim prompt dan hasil OCR ke AI
        const aiResponse = await sendToAI(prompt, ocr);
        res.json({ success: true, response: aiResponse });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
