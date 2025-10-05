const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const whois = require('node-whois');
const gtts = require('gtts'); // Google Text-to-Speech

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = 'v1.0.0 (Production)';
const API_NAME = 'DIZI API Gateway';

// --- MIDDLEWARE ---

// Konfigurasi CORS: Mengizinkan semua origin untuk memudahkan deployment awal.
// Dalam produksi nyata, ganti '*' dengan domain spesifik Anda (misalnya: 'https://dizital.privhandi.my.id')
app.use(cors({ origin: '*' })); 

app.use(bodyParser.json());
// Tambahkan middleware untuk melayani file statis (untuk file TTS dan File Creator)
app.use('/static', express.static(path.join(__dirname, 'static'))); 

// Buat direktori 'static' jika belum ada
if (!fs.existsSync(path.join(__dirname, 'static'))) {
    fs.mkdirSync(path.join(__dirname, 'static'));
}


// --- API ENDPOINTS (ROUTE /api/v1) ---

const router = express.Router();

// 1. Endpoint Status (Dashboard) - GET /api/v1/status
router.get('/status', (req, res) => {
    // Simulasi Latency
    const latency = Math.floor(Math.random() * 50) + 10; 

    res.json({
        service_name: API_NAME,
        version: API_VERSION,
        system_status: 'OPERATIONAL',
        current_time: new Date().toISOString(),
        api_latency_ms: latency,
        active_connections: Math.floor(Math.random() * 10) + 1,
        note: 'API is running and ready to handle requests on port ' + PORT,
    });
});

// 2. Endpoint Track (Docs Test) - GET /api/v1/track/:id
router.get('/track/:id', (req, res) => {
    if (req.params.id === 'nonexistent') {
        // Simulasi 404 Error (Untuk halaman FAQ)
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: `Resource with ID '${req.params.id}' not found in the database.`,
            suggestion: 'Check your endpoint ID.',
        });
    }

    // Simulasi 200 OK
    res.json({
        status: 'success',
        id: req.params.id,
        title: `Track Metadata for ${req.params.id.toUpperCase()}`,
        artist: 'DIZI Developer',
        duration_ms: 120000,
        retrieved_at: new Date().toISOString(),
    });
});

// --- TOOLS ENDPOINTS (POST /api/v1/tools/...) ---

// 3. TTS Generator - POST /api/v1/tools/tts
router.post('/tools/tts', (req, res) => {
    const { text, lang = 'en' } = req.body;
    if (!text) {
        return res.status(400).json({ status: 'error', message: 'Teks tidak boleh kosong.' });
    }

    try {
        const timestamp = Date.now();
        const filename = `tts_${timestamp}.mp3`;
        const filepath = path.join(__dirname, 'static', filename);
        
        const gtts_instance = new gtts(text, lang);
        
        gtts_instance.save(filepath, (err, result) => {
            if (err) {
                console.error('gTTS Error:', err);
                return res.status(500).json({ status: 'error', message: 'Gagal membuat file TTS (gTTS error).' });
            }
            // URL untuk diakses dari front-end
            const streamUrl = `${req.protocol}://${req.get('host')}/static/${filename}`;
            res.json({ status: 'success', message: 'File TTS berhasil dibuat.', filename, stream_url: streamUrl });
        });
    } catch (error) {
        console.error('TTS General Error:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal saat memproses TTS.' });
    }
});

// 4. WHOIS Domain Lookup - POST /api/v1/tools/whois
router.post('/tools/whois', async (req, res) => {
    const { domain } = req.body;
    if (!domain) {
        return res.status(400).json({ status: 'error', message: 'Domain tidak boleh kosong.' });
    }

    try {
        // whois lookup options
        const options = { timeout: 5000 }; 
        const result = await whois.lookup(domain, options);
        
        res.json({
            status: 'success',
            query_domain: domain,
            message: 'Informasi WHOIS berhasil diambil. Lihat di Console Browser.',
            raw_data: result, // data dikirim ke front-end untuk log console
        });
    } catch (error) {
        console.error('WHOIS Error:', error);
        res.status(500).json({ status: 'error', message: `Gagal melakukan WHOIS lookup untuk domain ${domain}.` });
    }
});

// 5. File Creator - POST /api/v1/tools/createfile
router.post('/tools/createfile', (req, res) => {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
        return res.status(400).json({ status: 'error', message: 'Nama file dan konten tidak boleh kosong.' });
    }

    try {
        const filepath = path.join(__dirname, 'static', filename);
        
        // Memastikan tidak menimpa file kritis dengan path traversal
        if (!filepath.startsWith(path.join(__dirname, 'static'))) {
             return res.status(400).json({ status: 'error', message: 'Invalid file path.' });
        }

        fs.writeFileSync(filepath, content, 'utf8');
        
        const downloadUrl = `${req.protocol}://${req.get('host')}/static/${filename}`;
        
        res.json({ 
            status: 'success', 
            message: `File '${filename}' berhasil dibuat di server.`, 
            download_url: downloadUrl 
        });
        
    } catch (error) {
        console.error('File Creator Error:', error);
        res.status(500).json({ status: 'error', message: 'Gagal membuat file di server.' });
    }
});


// Hubungkan router ke path /api/v1
app.use('/api/v1', router);

// Handle 404 untuk semua route API yang tidak terdefinisi
app.use('/api/v1/*', (req, res) => {
    res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Endpoint tidak ditemukan di API v1.',
        path: req.originalUrl
    });
});


// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`  DIZI API Gateway Server Aktif!`);
    console.log(`  Version: ${API_VERSION}`);
    console.log(`  Port: ${PORT}`);
    console.log(`  URL Lokal: http://localhost:${PORT}`);
    console.log(`  Siap diakses dari dizital.privhandi.my.id`);
    console.log(`==============================================\n`);
});    }

    // Panggil library WHOIS nyata
    whois.lookup(domain, function(err, data) {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Gagal melakukan WHOIS lookup.', detail: err.message });
        }
        
        // Memformat data mentah menjadi array baris yang lebih bersih
        const formattedData = data.split('\n').filter(line => line.trim() !== '');

        res.json({
            status: 'success',
            query_domain: domain,
            raw_data: data,
            formatted_data: formattedData 
        });
    });
});

// ===========================================
// ENDPOINT 5 (NYATA): Create File (Code Generator)
// ===========================================
app.post('/api/v1/tools/createfile', async (req, res) => {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
        return res.status(400).json({ status: 'error', message: 'Nama file dan konten diperlukan.' });
    }

    // Batasi jenis file dan pastikan nama file aman
    const safeFilename = path.basename(filename);
    const filepath = path.join(__dirname, 'public', safeFilename); 

    try {
        await fs.promises.writeFile(filepath, content);
        
        res.json({
            status: 'success',
            message: `File ${safeFilename} berhasil dibuat di server!`,
            download_url: `https://dizital.privhandi.my.id/public/${safeFilename}`
        });

    } catch (error) {
        console.error('File Creation Error:', error);
        res.status(500).json({ status: 'error', message: 'Gagal membuat file di server.', detail: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`DIZI API Server 100% WORKS berjalan di https://dizital.privhandi.my.id`);
});
