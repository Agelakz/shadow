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
        
        // Cek semua kemungkinan laci data RapidAPI
        let matchesArray = [];
        if (rawData.events && Array.isArray(rawData.events)) matchesArray = rawData.events;
        else if (rawData.response && Array.isArray(rawData.response)) matchesArray = rawData.response;
        else if (rawData.response?.matches && Array.isArray(rawData.response.matches)) matchesArray = rawData.response.matches;

        const mappedMatches = matchesArray.map((match, index) => {
            // MENGAMBIL SKOR
            let hScore = "-";
            let aScore = "-";
            if (match.homeScore) {
                hScore = match.homeScore.display ?? match.homeScore.current ?? match.homeScore.normaltime ?? "-";
            }
            if (match.awayScore) {
                aScore = match.awayScore.display ?? match.awayScore.current ?? match.awayScore.normaltime ?? "-";
            }

            // MENGAMBIL JAM & STATUS
            let timeDisplay = match.status?.description || match.status?.type || "FT";
            if (match.startTimestamp) {
                const dateObj = new Date(match.startTimestamp * 1000);
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const mins = String(dateObj.getMinutes()).padStart(2, '0');
                
                // Jika belum mulai, tampilkan jam. Jika selesai, tampilkan FT (Full Time).
                if (timeDisplay.toLowerCase().includes('not start')) timeDisplay = `${hours}:${mins}`;
                else if (timeDisplay.toLowerCase().includes('end') || timeDisplay.toLowerCase().includes('finish')) timeDisplay = 'FT';
            }

            // MENGAMBIL NAMA LIGA (Sekarang pasti terbaca!)
            const leagueName = match.tournament?.name || match.league?.name || "Lain-lain";
            const leagueId = match.tournament?.uniqueTournament?.id || match.tournament?.id || match.league?.id || "ALL";

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || match.home?.name || "Tim Kandang",
                away: match.awayTeam?.name || match.away?.name || "Tim Tandang",
                homeId: match.homeTeam?.id || match.home?.id,
                awayId: match.awayTeam?.id || match.away?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                time: timeDisplay,
                leagueId: leagueId,
                leagueName: leagueName
            };
        });

        // Kumpulkan Daftar Liga Unik
        const leagueMap = new Map();
        mappedMatches.forEach(m => {
            if (m.leagueName !== "Lain-lain") {
                leagueMap.set(m.leagueId, m.leagueName);
            }
        });
        const uniqueLeagues = Array.from(leagueMap).map(([id, name]) => ({ id, name }));

        res.status(200).json({ leagues: uniqueLeagues, matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
