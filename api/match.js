export default async function handler(req, res) {
    try {
        // 1. Mengambil Daftar Liga untuk Sidebar (SUDAH TERBUKTI BERHASIL)
        const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';
        const leaguesRes = await fetch(leaguesUrl);
        const leaguesJson = await leaguesRes.json();
        const leaguesData = leaguesJson.success ? leaguesJson.data : [];

        // 2. Mengambil Jadwal Pertandingan (Menggunakan endpoint 'matches' yang terbukti jalan)
        const matchesUrl = 'https://api.sportsrc.org/?data=matches&category=football';
        const matchesRes = await fetch(matchesUrl);
        const matchesJson = await matchesRes.json();
        let matchesData = [];

        if (matchesJson.success && matchesJson.data) {
            matchesData = matchesJson.data.map(item => {
                // Ubah format waktu jadi jam
                const matchDate = new Date(item.date);
                const timeString = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                return {
                    id: item.id,
                    home: item.teams?.home?.name || "Tim Kandang",
                    away: item.teams?.away?.name || "Tim Tandang",
                    scoreHome: "-", // Masih strip karena ini data jadwal
                    scoreAway: "-", 
                    time: timeString,
                    isLive: false 
                };
            });
        }

        // 3. Mengirimkan data ke frontend
        res.status(200).json({
            leagues: leaguesData,
            matches: matchesData,
            rawMatches: matchesJson.data // Tetap kita intip di console
        });

    } catch (error) {
        console.error("Terjadi kesalahan backend:", error);
        res.status(500).json({ error: "Gagal memproses data API" });
    }
}
