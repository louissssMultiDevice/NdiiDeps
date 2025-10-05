// js/app.js: Tambahkan/Ganti di bagian elemen dan event listener

// --- ELEMEN BARU UNTUK API NYATA ---
const ttsInput = document.getElementById('tts-input');
const ttsBtn = document.getElementById('tts-btn');
const ttsStatusBox = document.getElementById('tts-status-box');

const whoisInput = document.getElementById('whois-input');
const whoisBtn = document.getElementById('whois-btn');
const whoisStatusBox = document.getElementById('whois-status-box');

const fileNameInput = document.getElementById('file-name-input');
const fileContentInput = document.getElementById('file-content-input');
const fileCreatorBtn = document.getElementById('file-creator-btn');
const fileCreatorStatus = document.getElementById('file-creator-status');


// --- FUNGSI API TTS NYATA ---
async function handleTts() {
    const text = ttsInput.value.trim();
    if (!text) { ttsStatusBox.className = 'api-status-box error'; ttsStatusBox.innerHTML = '❌ Teks kosong!'; return; }
    
    ttsBtn.disabled = true;
    ttsStatusBox.className = 'api-status-box loading';
    ttsStatusBox.innerHTML = '⚡ **CALLING API**... Converting text to speech... ⚡';

    try {
        const response = await fetch(`${API_BASE_URL}/tools/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang: 'id' })
        });
        const data = await response.json();
        
        if (response.ok) {
            ttsStatusBox.className = 'api-status-box success';
            ttsStatusBox.innerHTML = `✅ **SUCCESS**! Audio created on server. <a href="${data.stream_url}" target="_blank" style="color: var(--color-glow-secondary);">**KLIK UNTUK DENGAR**</a>`;
        } else {
            ttsStatusBox.className = 'api-status-box error';
            ttsStatusBox.innerHTML = `❌ **ERROR**: ${data.message}`;
        }
    } catch (error) {
        ttsStatusBox.className = 'api-status-box error';
        ttsStatusBox.innerHTML = `❌ **CONNECTION ERROR**: Gagal menghubungi server TTS.`;
    } finally {
        ttsBtn.disabled = false;
    }
}

// --- FUNGSI API WHOIS NYATA ---
async function handleWhois() {
    const domain = whoisInput.value.trim();
    if (!domain) { whoisStatusBox.className = 'api-status-box error'; whoisStatusBox.innerHTML = '❌ Domain kosong!'; return; }

    whoisBtn.disabled = true;
    whoisStatusBox.className = 'api-status-box loading';
    whoisStatusBox.innerHTML = `⚡ **CALLING API**... Performing WHOIS lookup on ${domain}... ⚡`;

    try {
        const response = await fetch(`${API_BASE_URL}/tools/whois`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain })
        });
        const data = await response.json();

        if (response.ok) {
            whoisStatusBox.className = 'api-status-box success';
            whoisStatusBox.innerHTML = `✅ **SUCCESS**! Domain: ${data.query_domain}. Data berhasil diambil.`;
            // Tampilkan data mentah di console untuk developer
            console.log("WHOIS Raw Data:", data.raw_data);
        } else {
            whoisStatusBox.className = 'api-status-box error';
            whoisStatusBox.innerHTML = `❌ **ERROR**: ${data.message}`;
        }
    } catch (error) {
        whoisStatusBox.className = 'api-status-box error';
        whoisStatusBox.innerHTML = `❌ **CONNECTION ERROR**: Gagal menghubungi server WHOIS.`;
    } finally {
        whoisBtn.disabled = false;
    }
}

// --- FUNGSI API FILE CREATOR NYATA ---
async function handleFileCreation() {
    const filename = fileNameInput.value.trim();
    const content = fileContentInput.value;
    
    if (!filename || !content) {
        fileCreatorStatus.className = 'api-status-box error';
        fileCreatorStatus.innerHTML = '❌ Nama file dan konten tidak boleh kosong!';
        return;
    }

    fileCreatorBtn.disabled = true;
    fileCreatorStatus.className = 'api-status-box loading';
    fileCreatorStatus.innerHTML = `⚡ **CALLING API**... Creating file ${filename} on server... ⚡`;

    try {
        const response = await fetch(`${API_BASE_URL}/tools/createfile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, content })
        });
        const data = await response.json();

        if (response.ok) {
            fileCreatorStatus.className = 'api-status-box success';
            fileCreatorStatus.innerHTML = `✅ **SUCCESS**! ${data.message} <a href="${data.download_url}" target="_blank" style="color: var(--color-glow-secondary);">**DOWNLOAD FILE**</a>`;
        } else {
            fileCreatorStatus.className = 'api-status-box error';
            fileCreatorStatus.innerHTML = `❌ **ERROR**: ${data.message}`;
        }
    } catch (error) {
        fileCreatorStatus.className = 'api-status-box error';
        fileCreatorStatus.innerHTML = `❌ **CONNECTION ERROR**: Gagal menghubungi server.`;
    } finally {
        fileCreatorBtn.disabled = false;
    }
}


// --- EVENT LISTENERS INITIALIZATION (Diperbarui) ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (Logika fetchDashboardData, callApiBtn, faqCallApiBtn yang sama) ...
    
    // Inisialisasi Event Listener API NYATA
    if (ttsBtn) {
        ttsBtn.addEventListener('click', handleTts);
    }
    if (whoisBtn) {
        whoisBtn.addEventListener('click', handleWhois);
    }
    if (fileCreatorBtn) {
        fileCreatorBtn.addEventListener('click', handleFileCreation);
    }
});
