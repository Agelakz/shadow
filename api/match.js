export default async function handler(req, res) {
    try {
        const queryDate = req.query.date; 
        let dateParam = "";

        if (queryDate) {
            dateParam = queryDate.replace(/-/g, '');
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateParam = `${yyyy}${mm}${dd}`;
        }

        const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${dateParam}`;
        
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d' 
            }
        };

        const response = await fetch(url, options);
        const rawData = await response.json();

        // --- PERBAIKAN DI SINI ---
        // Kita perintahkan kode untuk membuka laci "matches" sesuai gambar Anda!
        let matchesArray = [];
        if (rawData.response && rawData.response.matches && Array.isArray(rawData.response.matches)) {
            matchesArray = rawData.response.matches; 
        } else if (rawData.response && Array.isArray(rawData.response)) {
            matchesArray = rawData.response;
        } else if (rawData.data && Array.isArray(rawData.data)) {
            matchesArray = rawData.data;
        }

        // Mapping Data (Menebak kunci dari RapidAPI)
        const mappedMatches = matchesArray.map((match, index) => {
            return {
                id: match.id || match.fixture?.id || index.toString(),
                
                // Coba berbagai variasi nama tim
                home: match.home?.name || match.homeTeam?.name || match.team1?.name || match.home_name || "Tim Kandang",
                away: match.away?.name || match.awayTeam?.name || match.team2?.name || match.away_name || "Tim Tandang",
                
                // Coba berbagai variasi skor
                scoreHome: match.home?.score ?? match.homeScore ?? match.score?.home ?? match.home_score ?? "-",
                scoreAway: match.away?.score ?? match.awayScore ?? match.score?.away ?? match.away_score ?? "-",
                
                time: match.status?.short || match.status?.name || match.time || match.matchTime || "Selesai",
                leagueId: match.league?.id || match.tournament?.id || "ALL",
                leagueName: match.league?.name || match.tournament?.name || "Lain-lain",
                dateString: queryDate
            };
        });

        // Ekstrak Daftar Liga Otomatis dari ratusan data tersebut
        const uniqueLeagues = [];
        const leagueMap = new Map();
        mappedMatches.forEach(m => {
            if (!leagueMap.has(m.leagueId) && m.leagueName !== "Lain-lain") {
                leagueMap.set(m.leagueId, true);
                uniqueLeagues.push({ id: m.leagueId, name: m.leagueName });
            }
        });

        res.status(200).json({
            leagues: uniqueLeagues,
            matches: mappedMatches,
            debugRaw: rawData 
        });

    } catch (error) {
        console.error("RapidAPI Error:", error);
        res.status(500).json({ error: "Gagal menarik data dari RapidAPI" });
    }
}
