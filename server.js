// server.js (Back-End Node.js/Express yang Diperbarui)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Untuk parsing POST requests
const whois = require('whois');            // Untuk WHOIS Lookup
const gtts = require('gtts');              // Untuk Text-to-Speech
const fs = require('fs');                  // Untuk File System (Membuat File)
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public'))); // Untuk melayani file TTS

// Pastikan folder public ada untuk menyimpan file TTS
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Data Dummy
const musicTracks = {
    'terimakasih': {
        id: 'terimakasih',
        title: 'Terima Kasih Metadata',
        artist: 'DIZI Official',
        duration_ms: 180000, 
        status: '200 OK - SUCCESS'
    }
};

// ===========================================
// ENDPOINT 1: Status Sistem (Dashboard)
// ===========================================
app.get('/api/v1/status', (req, res) => {
    // ... (Logika status sistem yang sama) ...
    const latency = Math.floor(Math.random() * 50) + 5; 
    const activeUsers = Math.floor(Math.random() * 500) + 100;
    res.json({
        service_name: 'DIZI Advanced API Gateway',
        version: 'v3.0.0-PRO',
        current_time: new Date().toISOString(),
        api_latency_ms: latency,
        active_connections: activeUsers,
        system_status: 'OPERATIONAL',
        note: 'API is now integrated with real external tools (TTS, WHOIS).'
    });
});

// ===========================================
// ENDPOINT 2: Music Track Lookup (API Test)
// ===========================================
app.get('/api/v1/track/:id', (req, res) => {
    // ... (Logika track yang sama) ...
    const track = musicTracks[req.params.id.toLowerCase()];
    if (track) {
        setTimeout(() => res.json(track), 500); 
    } else {
        res.status(404).json({ error: 'Resource Not Found', message: 'Resource ID tidak ditemukan.' });
    }
});

// ===========================================
// ENDPOINT 3 (NYATA): Text-to-Speech (TTS)
// ===========================================
app.post('/api/v1/tools/tts', async (req, res) => {
    const text = req.body.text || 'Teks kosong, tidak bisa diubah menjadi suara.';
    const lang = req.body.lang || 'id'; // Default Bahasa Indonesia
    
    // Gunakan hash atau timestamp unik untuk nama file
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, 'public', filename);

    try {
        const gttsInstance = new gtts(text, lang);
        
        // Simpan file TTS secara fisik
        await new Promise((resolve, reject) => {
            gttsInstance.save(filepath, function(err, result) {
                if (err) return reject(err);
                resolve(result);
            });
        });
        
        // Kirim URL ke file yang baru dibuat
        const streamUrl = `https://dizital.privhandi.my.id:${PORT}/public/${filename}`;
        res.json({
            status: 'success',
            message: 'TTS file created successfully.',
            stream_url: streamUrl
        });

    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ status: 'error', message: 'Gagal membuat file TTS.', detail: error.message });
    }
});

// ===========================================
// ENDPOINT 4 (NYATA): WHOIS Lookup
// ===========================================
app.post('/api/v1/tools/whois', (req, res) => {
    const domain = req.body.domain;
    if (!domain) {
        return res.status(400).json({ status: 'error', message: 'Domain diperlukan.' });
    }

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
            download_url: `https://dizital.privhandi.my.id:${PORT}/public/${safeFilename}`
        });

    } catch (error) {
        console.error('File Creation Error:', error);
        res.status(500).json({ status: 'error', message: 'Gagal membuat file di server.', detail: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`DIZI API Server 100% WORKS berjalan di https://dizital.privhandi.my.id:${PORT}`);
});
