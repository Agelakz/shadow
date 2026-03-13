const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// 1. FRONTEND: Mengirimkan tampilan web saat kamu membuka localhost:3000
app.get('/', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>X Health Checker</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
            h2 { margin-top: 0; color: #1da1f2; }
            input[type="text"] { width: 90%; padding: 12px; margin: 15px 0; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; }
            button { background-color: #1da1f2; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%; font-weight: bold; transition: background-color 0.3s; }
            button:hover { background-color: #1a91da; }
            button:disabled { background-color: #9ca3af; cursor: not-allowed; }
            .result-box { margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f8f9fa; text-align: left; display: none; font-size: 14px; }
            .status-item { margin-bottom: 8px; }
            .safe { color: #10b981; font-weight: bold; }
            .ban { color: #ef4444; font-weight: bold; }
            .loading { color: #6b7280; font-style: italic; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>X Health Checker</h2>
            <p>Pantau visibilitas dan status akun otomatis</p>
            <input type="text" id="username" placeholder="Masukkan username (tanpa @)">
            <button onclick="checkAccount()" id="checkBtn">Cek Status Akun</button>
            <div class="result-box" id="resultBox"></div>
        </div>

        <script>
            async function checkAccount() {
                const usernameInput = document.getElementById('username').value.trim();
                const resultBox = document.getElementById('resultBox');
                const checkBtn = document.getElementById('checkBtn');
                const username = usernameInput.replace(/^@/, '');

                if (!username) return alert("Harap masukkan username yang valid!");

                resultBox.style.display = "block";
                resultBox.innerHTML = '<div class="loading">⏳ Robot sedang memeriksa @' + username + ' ke X... Ini memakan waktu beberapa detik.</div>';
                checkBtn.disabled = true;

                try {
                    // Memanggil API internal di bawah
                    const response = await fetch('/api/check?user=' + username);
                    const data = await response.json();

                    if (data.error) {
                        resultBox.innerHTML = '<div class="ban">❌ Error: ' + data.error + '</div>';
                    } else {
                        resultBox.innerHTML = \`
                            <h3 style="margin-top:0; border-bottom: 1px solid #ccc; padding-bottom: 8px;">Hasil: @\${data.username}</h3>
                            <div class="status-item">🚫 <b>Suspended:</b> \${data.isSuspended ? '<span class="ban">Ya</span>' : '<span class="safe">Tidak</span>'}</div>
                            <div class="status-item">❓ <b>Akun Ditemukan:</b> \${data.notFound ? '<span class="ban">Tidak Ada</span>' : '<span class="safe">Ya</span>'}</div>
                            <div class="status-item">✅ <b>Status Umum:</b> \${data.statusAman ? '<span class="safe">Akun Aktif & Aman</span>' : '<span class="ban">Bermasalah</span>'}</div>
                        \`;
                    }
                } catch (error) {
                    resultBox.innerHTML = '<div class="ban">❌ Gagal memproses data.</div>';
                }
                checkBtn.disabled = false;
            }
        </script>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// 2. BACKEND API: Robot Puppeteer yang bekerja di belakang layar
app.get('/api/check', async (req, res) => {
    const username = req.query.user;
    if (!username) return res.status(400).json({ error: 'Username kosong' });

    console.log(\`Mengecek status untuk @\${username}...\`);

    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        await page.goto(\`https://x.com/\${username}\`, { waitUntil: 'networkidle2' });
        
        const pageText = await page.evaluate(() => document.body.innerText);
        
        const isSuspended = pageText.includes('Account suspended');
        const notFound = pageText.includes('This account doesn’t exist');

        await browser.close();

        res.json({
            username: username,
            isSuspended: isSuspended,
            notFound: notFound,
            statusAman: !isSuspended && !notFound
        });

    } catch (error) {
        console.error('Error Puppeteer:', error);
        res.status(500).json({ error: 'Gagal menghubungi server X' });
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(\`✅ Aplikasi berjalan! Buka http://localhost:\${PORT} di peramban kamu.\`);
});