export default async function handler(req, res) {
    try {
        // 1. URL Endpoint asli dari sportsrc.org (contoh endpoint live events)
        const apiUrl = 'https://api.sportsrc.org/v1/events/live'; 
        
        // 2. Memanggil API asli menggunakan fetch
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // Biasanya API olahraga membutuhkan API Key agar tidak diblokir.
                // Ganti tulisan di bawah ini dengan API Key asli Anda dari sportsrc
                // 'X-API-Key': 'MASUKKAN_API_KEY_ANDA_DI_SINI',
                'Content-Type': 'application/json'
            }
        });

        // Jika API menolak (misal karena belum ada API key atau URL salah), lempar error
        if (!response.ok) {
            throw new Error(`Gagal memanggil API: ${response.status} ${response.statusText}`);
        }

        // Ini adalah data mentah asli dari sportsrc.org
        const rawData = await response.json();

        // 3. TRANSFORMASI DATA (MAPPING)
        // Di sinilah kita mengubah data mentah API menjadi format yang dimengerti oleh website kita.
        // CATATAN: Struktur 'rawData' di bawah ini hanyalah tebakan umum. 
        // Anda harus menyesuaikannya dengan struktur asli dari dokumentasi sportsrc.
        
        /* --- CONTOH LOGIKA MAPPING ---
        const formattedData = rawData.events.map(event => {
            return {
                leagueName: event.league.name, // Tarik nama liga
                matches: [
                    {
                        time: event.matchTime, // Tarik menit pertandingan
                        home: event.homeTeam.name,
                        away: event.awayTeam.name,
                        scoreHome: event.homeScore,
                        scoreAway: event.awayScore,
                        isLive: event.status === 'LIVE' // Tentukan status live
                    }
                ]
            };
        });
        ------------------------------ */

        // Untuk uji coba pertama, kita kirimkan data mentahnya dulu untuk melihat responnya
        // Nanti, ganti 'rawData' menjadi 'formattedData' setelah kita tahu persis strukturnya
        res.status(200).json(rawData);

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        // Fallback: Jika API error, jangan biarkan Vercel crash (500), tapi kirim pesan error yang rapi
        res.status(500).json({ error: "Gagal mengambil skor dari sportsrc.org", detail: error.message });
    }
}
