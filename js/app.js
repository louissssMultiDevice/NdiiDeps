    // js/app.js - Logika Aplikasi 100% Bekerja

    // --- KONFIGURASI GLOBAL ---
    // JANGAN UBAH INI UNTUK LOKAL! API harus berjalan di http://localhost:3000
    const API_BASE_URL = 'http://dizital.privhandi.my.id/api/v1'; 

    // --- ELEMEN UTAMA ---
    const root = document.documentElement;
    const weatherToggle = document.getElementById("weather-toggle");
    const precipitationElement = document.getElementById("precipitation");
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    const callApiBtn = document.getElementById('call-api-btn');
    const apiStatusBox = document.getElementById('api-status-box');
    const apiResponseData = document.getElementById('api-response-data');
    const faqCallApiBtn = document.getElementById('faq-call-api-btn');
    const faqStatusBox = document.getElementById('faq-api-status-box');
    const faqResponseData = document.getElementById('faq-api-response-data');

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


    // --- FUNGSI NAVIGASI DINAMIS ---
    window.navigateTo = function(pageId) {
        const validPages = Array.from(pages).map(p => p.id);
        let targetPageId = validPages.includes(pageId) ? pageId : 'error-page';
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });
        
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(targetPageId).classList.add('active');

        if (targetPageId === 'home-page') {
            fetchDashboardData();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navigateTo(e.target.getAttribute('data-page'));
        });
    });

    // --- FUNGSI API CALL DASHBOARD (System Status) ---
    async function fetchDashboardData() {
        const dashboardDataElement = document.getElementById('dashboard-data');
        try {
            const response = await fetch(`${API_BASE_URL}/status`);
            const data = await response.json();
            
            dashboardDataElement.innerHTML = `
                <div class="module-card">
                    <h3>System Status | ${data.service_name}</h3>
                    <p style="color: var(--color-accent);">Version: ${data.version}</p>
                    <p>Status: <span style="color: #00ffaa; font-weight: 600;">${data.system_status}</span></p>
                    <p>Current Time: ${new Date(data.current_time).toLocaleTimeString()}</p>
                </div>
                <div class="module-card">
                    <h3>Performance Metrics</h3>
                    <p>API Latency: <span style="color: var(--color-glow-secondary);">${data.api_latency_ms}ms</span></p>
                    <p>Active Connections: ${data.active_connections}</p>
                    <p>Note: ${data.note}</p>
                </div>
                <div class="module-card">
                    <h3>Deployment Status</h3>
                    <p>Back-End: Operational (Node.js)</p>
                    <p>Front-End: Deployed via GitHub/Vercel (Simulated)</p>
                    <p>Environment: Production Ready</p>
                </div>
            `;
        } catch (error) {
            dashboardDataElement.innerHTML = `<div class="module-card" style="color: var(--color-error);">
                <h3>🚨 GAGAL KONEKSI API 🚨</h3>
                <p>Penyebab: **Server API Anda (server.js) Belum Aktif atau Port 3000 Diblokir.**</p>
                <p>Solusi: Jalankan \`node server.js\` di terminal dan JANGAN tutup.</p>
            </div>`;
        }
    }

    // --- FUNGSI API CALL 200 OK (DOCS) ---
    async function fetchTrackApi() {
        if (callApiBtn.disabled) return;
        callApiBtn.disabled = true;
        apiStatusBox.className = 'api-status-box loading';
        apiStatusBox.innerHTML = '⚡ **CALLING API**... Initiating holographic connection... ⚡';
        apiResponseData.innerText = 'Processing API response...';

        try {
            const response = await fetch(`${API_BASE_URL}/track/terimakasih`);
            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            if (response.ok) {
                apiResponseData.innerText = JSON.stringify(data, null, 2); 
                apiStatusBox.className = 'api-status-box success';
                apiStatusBox.innerHTML = '✅ **SUCCESS** - Metadata Retrieved (200 OK)';
            } else {
                apiResponseData.innerText = JSON.stringify(data, null, 2);
                apiStatusBox.className = 'api-status-box error';
                apiStatusBox.innerHTML = `❌ **ERROR** - Failed to retrieve data (${response.status})`;
            }
        } catch (error) {
            apiResponseData.innerText = `ERROR: Gagal terhubung ke API Server. Detail: ${error.message}`;
            apiStatusBox.className = 'api-status-box error';
            apiStatusBox.innerHTML = '❌ **CONNECTION ERROR** - API Host Unreachable';
        } finally {
            callApiBtn.disabled = false;
        }
    }

    // --- FUNGSI API CALL 404 (FAQ) ---
    async function fetchFailedApi() {
        if (faqCallApiBtn.disabled) return;

        faqCallApiBtn.disabled = true;
        faqStatusBox.className = 'api-status-box loading';
        faqStatusBox.innerHTML = '⚡ **CALLING API**... Searching for non-existent resource... ⚡';
        faqResponseData.innerText = 'Processing API response...';

        try {
            const response = await fetch(`${API_BASE_URL}/track/nonexistent`); 
            const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            faqResponseData.innerText = JSON.stringify(data, null, 2); 
            faqStatusBox.className = 'api-status-box error';
            faqStatusBox.innerHTML = `❌ **ERROR** - Resource Not Found (404)`;

        } catch (error) {
            faqResponseData.innerText = `ERROR: Gagal terhubung ke API Server. Detail: ${error.message}`;
            faqStatusBox.className = 'api-status-box error';
            faqStatusBox.innerHTML = '❌ **CONNECTION ERROR** - Host Unreachable';
        } finally {
            faqCallApiBtn.disabled = false;
        }
    }


    // ===============================================
    // --- FUNGSI API NYATA (TOOLS PAGE) ---
    // ===============================================
    // --- FUNGSI API TTS NYATA ---
    async function handleTts() {
        const text = ttsInput.value.trim();
        if (!text) { ttsStatusBox.className = 'api-status-box error'; ttsStatusBox.innerHTML = '❌ Teks kosong!'; return; }
        
        ttsBtn.disabled = true;
        ttsStatusBox.className = 'api-status-box loading';
        ttsStatusBox.innerHTML = '⚡ **CALLING API**... Converting text to speech (gTTS)... ⚡';

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
                whoisStatusBox.innerHTML = `✅ **SUCCESS**! Domain: ${data.query_domain}. Data berhasil diambil. (Lihat Console)`;
                console.log("------------------------------------------");
                console.log(`WHOIS Lookup Results for: ${data.query_domain}`);
                console.log(data.raw_data);
                console.log("------------------------------------------");

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


    // --- LOGIKA CUACA (Dipertahankan untuk UI/UX) ---
    const weathers = [
        { name: "Cerah", emoji: "☀️", filter: "saturate(1.2) brightness(1.1)", particle: "" },
        { name: "Hujan", emoji: "🌧️", filter: "grayscale(0.2) brightness(0.6) contrast(1.2) hue-rotate(10deg)", particle: "rain" },
        { name: "Salju", emoji: "❄️", filter: "grayscale(0.5) brightness(1.0) contrast(1.1) sepia(0.2)", particle: "snow" }
    ];
    let currentWeatherIndex = 0;

    function changeWeather() {
        currentWeatherIndex = (currentWeatherIndex + 1) % weathers.length;
        const nextWeather = weathers[currentWeatherIndex];
        root.style.setProperty('--weather-filter', nextWeather.filter);
        weatherToggle.textContent = `${nextWeather.emoji} ${nextWeather.name}`;
        precipitationElement.className = 'precipitation'; 
        if (nextWeather.particle) { precipitationElement.classList.add(nextWeather.particle); }
    }

    if (weatherToggle) {
      weatherToggle.addEventListener('click', changeWeather);
    }


    // --- EVENT LISTENERS INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Inisialisasi Dashboard
        fetchDashboardData();
        
        // 2. API Call Tests
        if (callApiBtn) { callApiBtn.addEventListener('click', fetchTrackApi); }
        if (faqCallApiBtn) { faqCallApiBtn.addEventListener('click', fetchFailedApi); }

        // 3. API Nyata Tools
        if (ttsBtn) { ttsBtn.addEventListener('click', handleTts); }
        if (whoisBtn) { whoisBtn.addEventListener('click', handleWhois); }
        if (fileCreatorBtn) { fileCreatorBtn.addEventListener('click', handleFileCreation); }
    });
