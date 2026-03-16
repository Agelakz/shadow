export default async function handler(req, res) {
    try {
        const queryDate = req.query.date || new Date().toISOString().split('T')[0].replace(/-/g, '');
        const dateParam = queryDate.replace(/-/g, '');
        
        const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${dateParam}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d'
            }
        };

        const response = await fetch(url, options);
        const rawData = await response.json();
        const matchesArray = rawData.response?.matches || [];

        const mappedMatches = matchesArray.map((match, index) => {
            // Ambil skor dengan lebih teliti
            const hScore = match.homeScore?.current ?? match.homeScore?.display ?? match.score?.home ?? "-";
            const aScore = match.awayScore?.current ?? match.awayScore?.display ?? match.score?.away ?? "-";

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || match.home?.name || "Tim Kandang",
                away: match.awayTeam?.name || match.away?.name || "Tim Tandang",
                // Ambil ID untuk Logo
                homeId: match.homeTeam?.id || match.home?.id,
                awayId: match.awayTeam?.id || match.away?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                time: match.status?.description || match.status?.type || match.time || "FT",
                statusCode: match.status?.code || 0, // Untuk cek sudah mulai/belum
                leagueId: match.league?.id || "ALL",
                leagueName: match.league?.name || "Lain-lain"
            };
        });

        // Pastikan Liga Terbaca di Sidebar
        const leagueMap = new Map();
        mappedMatches.forEach(m => {
            if (m.leagueId && m.leagueName !== "Lain-lain") {
                leagueMap.set(m.leagueId, m.leagueName);
            }
        });
        const uniqueLeagues = Array.from(leagueMap).map(([id, name]) => ({ id, name }));

        res.status(200).json({ leagues: uniqueLeagues, matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
