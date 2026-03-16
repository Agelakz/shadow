export default async function handler(req, res) {
    try {
        // 1. URL Endpoint asli dari gambar Anda
        const apiUrl = 'https://api.sportsrc.org/?data=matches&category=football'; 
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Gagal memanggil API sportsrc');
        }

        // 2. Mendapatkan data mentah (JSON) seperti di gambar Anda
        const json = await response.json();

        // Pastikan API membalas dengan success: true
        if (json.success && json.data) {
            
            // 3. PROSES DATA MAPPING (Transformasi)
            const mappedMatches = json.data.map(item => {
                // Mengubah format "date" (1773624600000) menjadi Jam:Menit (misal 20:30)
                const matchDate = new Date(item.date);
                const timeString = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                return {
                    time: timeString, // Menampilkan jam pertandingan
                    home: item.teams.home.name, // Mengambil nama tim kandang
                    away: item.teams.away.name, // Mengambil nama tim tandang
                    scoreHome: "-", // Belum ada data skor di API ini
                    scoreAway: "-", // Belum ada data skor di API ini
                    isLive: false   // Anggap belum live karena ini jadwal
                };
            });

            // 4. Membungkus data sesuai format yang diminta frontend kita
            const formattedData = [
                {
                    leagueName: "⚽ JADWAL PERTANDINGAN (sportsrc.org)",
                    matches: mappedMatches
                }
            ];

            // 5. Kirim data yang sudah rapi ke frontend Vercel Anda!
            res.status(200).json(formattedData);
            
        } else {
            res.status(500).json({ error: "Format data dari API tidak sesuai dugaan." });
        }

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        res.status(500).json({ error: "Gagal memproses data API", detail: error.message });
    }
}
