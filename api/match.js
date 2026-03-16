export default async function handler(req, res) {
    try {
        const queryDate = req.query.date || "";
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
        
        // Membuka laci data RapidAPI yang benar
        const matchesArray = rawData.response?.matches || [];

        const mappedMatches = matchesArray.map((match, index) => {
            // Mengambil skor (current score)
            const hScore = match.homeScore?.current ?? "-";
            const aScore = match.awayScore?.current ?? "-";

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || "Tim Kandang",
                away: match.awayTeam?.name || "Tim Tandang",
                homeId: match.homeTeam?.id,
                awayId: match.awayTeam?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                time: match.status?.description || match.time || "FT",
                leagueId: match.league?.id || "ALL",
                leagueName: match.league?.name || "Lain-lain"
            };
        });

        // Membuat daftar liga unik untuk Sidebar
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
