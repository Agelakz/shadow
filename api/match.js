export default async function handler(req, res) {
    try {
        // 1. Tangkap tanggal yang diminta oleh layar depan (Frontend)
        const queryDate = req.query.date; 
        let dateParam = "";

        if (queryDate) {
            // Ubah dari 2026-03-16 menjadi 20260316 untuk RapidAPI
            dateParam = queryDate.replace(/-/g, '');
        } else {
            // Jika tidak ada, gunakan tanggal hari ini
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateParam = `${yyyy}${mm}${dd}`;
        }

        // 2. Tembak URL RapidAPI yang baru Anda temukan!
        const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${dateParam}`;
        
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d' // Kunci Anda
            }
        };

        const response = await fetch(url, options);
        const rawData = await response.json();

        // 3. Cari di mana RapidAPI menyembunyikan array pertandingannya
        let matchesArray = [];
        if (Array.isArray(rawData)) matchesArray = rawData;
        else if (rawData.response && Array.isArray(rawData.response)) matchesArray = rawData.response;
        else if (rawData.data && Array.isArray(rawData.data)) matchesArray = rawData.data;

        // 4. SMART MAPPING: Mengubah data mentah RapidAPI menjadi format FreshScore
        const mappedMatches = matchesArray.map((match, index) => {
            return {
                id: match.id || match.fixture?.id || index.toString(),
                // API berbeda punya gaya berbeda, kita tebak semua kemungkinan nama kuncinya:
                home: match.teams?.home?.name || match.homeTeam?.name || match.home?.name || "Tim Kandang",
                away: match.teams?.away?.name || match.awayTeam?.name || match.away?.name || "Tim Tandang",
                scoreHome: match.goals?.home ?? match.scores?.homeScore ?? match.homeScore ?? "-",
                scoreAway: match.goals?.away ?? match.scores?.awayScore ?? match.awayScore ?? "-",
                time: match.fixture?.status?.short || match.status?.short || match.time || "FT",
                leagueId: match.league?.id || match.tournament?.id || "ALL",
                leagueName: match.league?.name || match.tournament?.name || "Lainnya",
                dateString: queryDate // Kembalikan label tanggal
            };
        });

        // 5. Ekstrak Daftar Liga Otomatis dari jadwal hari itu untuk Sidebar
        const uniqueLeagues = [];
        const leagueMap = new Map();
        mappedMatches.forEach(m => {
            if (!leagueMap.has(m.leagueId) && m.leagueName !== "Lainnya") {
                leagueMap.set(m.leagueId, true);
                uniqueLeagues.push({ id: m.leagueId, name: m.leagueName });
            }
        });

        // 6. Kirim ke Frontend!
        res.status(200).json({
            leagues: uniqueLeagues,
            matches: mappedMatches,
            debugRaw: rawData // Data intipan untuk console log
        });

    } catch (error) {
        console.error("RapidAPI Error:", error);
        res.status(500).json({ error: "Gagal menarik data dari RapidAPI" });
    }
}
