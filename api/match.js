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
        
        let matchesArray = [];
        if (rawData.response?.matches) matchesArray = rawData.response.matches;
        else if (rawData.events) matchesArray = rawData.events;

        const mappedMatches = matchesArray.map((match, index) => {
            let hScore = match.homeScore?.display ?? match.homeScore?.current ?? "-";
            let aScore = match.awayScore?.display ?? match.awayScore?.current ?? "-";

            const leagueName = match.tournament?.name || match.league?.name || match.tournament?.category?.name || "Lain-lain";
            const leagueId = match.tournament?.uniqueTournament?.id || match.tournament?.id || "ALL";

            // LOGIKA MESIN WAKTU ANTI-GAGAL
            let timeDisplay = "FT";
            let isUnplayed = false;
            
            if (match.startTimestamp) {
                const matchTimeMs = match.startTimestamp * 1000;
                const nowMs = Date.now();
                
                // Jika waktu kick-off masih di masa depan, ATAU status API bilang belum mulai
                if (matchTimeMs > nowMs || match.status?.type === 'notstarted' || match.status?.code === 0) {
                    const dateObj = new Date(matchTimeMs);
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const mins = String(dateObj.getMinutes()).padStart(2, '0');
                    timeDisplay = `${hours}:${mins}`;
                    isUnplayed = true;
                    hScore = "-"; // Paksa skor jadi strip
                    aScore = "-";
                } 
                // Jika sedang berlangsung
                else if (match.status?.type === 'inprogress') {
                    timeDisplay = "Live";
                } 
                // Jika sudah lewat
                else {
                    timeDisplay = match.status?.description === "Ended" ? "FT" : (match.status?.description || "FT");
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
                leagueName: leagueName
            };
        });

        // Backend hanya mengirimkan data, Frontend yang mengatur menu
        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
