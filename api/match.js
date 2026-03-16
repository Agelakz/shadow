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
        
        // Membuka laci yang benar
        let matchesArray = [];
        if (rawData.response?.matches) matchesArray = rawData.response.matches;
        else if (rawData.events) matchesArray = rawData.events;

        const mappedMatches = matchesArray.map((match, index) => {
            // EKSTRAKSI SKOR SUPER KETAT
            let hScore = match.homeScore?.display ?? match.homeScore?.current ?? match.score?.home ?? "-";
            let aScore = match.awayScore?.display ?? match.awayScore?.current ?? match.score?.away ?? "-";

            // EKSTRAKSI NAMA LIGA YANG BENAR
            const leagueName = match.tournament?.name || match.league?.name || match.tournament?.category?.name || "Lain-lain";
            const leagueId = match.tournament?.uniqueTournament?.id || match.tournament?.id || match.league?.id || "ALL";

            // EKSTRAKSI JAM
            let timeDisplay = match.status?.description || match.status?.type || "FT";
            if (match.startTimestamp) {
                const dateObj = new Date(match.startTimestamp * 1000);
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const mins = String(dateObj.getMinutes()).padStart(2, '0');
                if (timeDisplay.toLowerCase().includes('not start') || match.status?.code === 0) {
                    timeDisplay = `${hours}:${mins}`;
                } else if (timeDisplay.toLowerCase().includes('end') || match.status?.code === 100) {
                    timeDisplay = 'FT';
                }
            }

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || match.home?.name || "Tim Kandang",
                away: match.awayTeam?.name || match.away?.name || "Tim Tandang",
                homeId: match.homeTeam?.id,
                awayId: match.awayTeam?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                time: timeDisplay,
                leagueId: leagueId,
                leagueName: leagueName
            };
        });

        // FILTER LIGA: Hanya ambil liga terkenal untuk di sidebar
        const topLeagueNames = ['Premier League', 'LaLiga', 'Serie A', 'Bundesliga', 'Ligue 1', 'UEFA Champions League', 'UEFA Europa League', 'Eredivisie', 'Championship', 'World Cup'];
        
        const leagueMap = new Map();
        mappedMatches.forEach(m => {
            if (m.leagueName !== "Lain-lain") leagueMap.set(m.leagueId, m.leagueName);
        });

        const uniqueLeagues = Array.from(leagueMap).map(([id, name]) => ({ id, name }));
        // Saring: Jika namanya mengandung daftar Top Liga di atas
        let filteredLeagues = uniqueLeagues.filter(l => topLeagueNames.some(top => l.name.includes(top)));
        
        // Jika sedang tidak ada liga top, tampilkan 10 liga acak saja agar tidak kosong
        if (filteredLeagues.length === 0) filteredLeagues = uniqueLeagues.slice(0, 10);

        res.status(200).json({ leagues: filteredLeagues, matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
