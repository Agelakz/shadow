export default async function handler(req, res) {
    try {
        // 1. Mengambil Daftar Liga untuk Sidebar
        const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';
        const leaguesRes = await fetch(leaguesUrl);
        const leaguesJson = await leaguesRes.json();
        const leaguesData = leaguesJson.success ? leaguesJson.data : [];

        // 2. Mengambil Hasil/Skor Pertandingan (Menebak endpoint 'results')
        const matchesUrl = 'https://api.sportsrc.org/?data=results&category=football';
        const matchesRes = await fetch(matchesUrl);
        const matchesJson = await matchesRes.json();
        let matchesData = [];

        if (matchesJson.success && matchesJson.data) {
            // Mapping data pertandingan
            matchesData = matchesJson.data.map(item => {
                return {
                    id: item.id,
                    home: item.teams?.home?.name || "Tim Kandang",
                    away: item.teams?.away?.name || "Tim Tandang",
                    // Karena kita belum tahu persis struktur JSON skornya, kita coba tebak letaknya
                    scoreHome: item.scores?.home ?? item.score?.home ?? "-", 
                    scoreAway: item.scores?.away ?? item.score?.away ?? "-",
                    time: item.status || "Selesai",
                    leagueId: item.league || item.category || "Lainnya",
                    isLive: false // Anggap false dulu sampai kita tahu status livenya
                };
            });
        }

        // 3. Mengirimkan kedua data tersebut sekaligus
        res.status(200).json({
            leagues: leaguesData,
            matches: matchesData,
            rawMatches: matchesJson.data // Kita kirim data mentah ini untuk diintip di Console browser Anda
        });

    } catch (error) {
        console.error("Terjadi kesalahan backend:", error);
        res.status(500).json({ error: "Gagal memproses data ganda dari API" });
    }
}
