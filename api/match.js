export default async function handler(req, res) {
    try {
        // Di sinilah kita memanggil API sportsrc.org secara aman di sisi server.
        // Ganti URL ini dengan endpoint API sportsrc yang sebenarnya jika Anda sudah punya dokumentasinya.
        const apiUrl = 'https://api.sportsrc.org/v1/events'; 
        
        // Catatan: Jika sportsrc butuh API Key, Anda bisa menambahkannya di headers
        /*
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer API_KEY_ANDA'
            }
        });
        const data = await response.json();
        */

        // --- MULAI DATA SIMULASI ---
        // Sementara menunggu akses API sportsrc asli, kita gunakan data ini 
        // agar script di Vercel Anda dijamin berjalan sukses (Status 200) dan tidak error 500.
        const mockData = [
            { id: 1, homeTeam: "Arsenal", awayTeam: "Chelsea", score: "2 - 1", status: "88'" },
            { id: 2, homeTeam: "Real Madrid", awayTeam: "Barcelona", score: "0 - 0", status: "HT" },
            { id: 3, homeTeam: "Juventus", awayTeam: "AC Milan", score: "1 - 3", status: "FT" }
        ];
        // --- AKHIR DATA SIMULASI ---

        // Mengirimkan data ke frontend Anda dengan status 200 (Sukses)
        res.status(200).json(mockData);

    } catch (error) {
        // Jika ada yang salah saat mengambil data API, ini akan mencegah Vercel crash total
        console.error("Terjadi kesalahan:", error);
        res.status(500).json({ error: "Gagal mengambil data dari server API." });
    }
}
