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
            const leagueName = match.tournament?.name || match.league?.name || "Lain-lain";

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || "Tim Kandang",
                away: match.awayTeam?.name || "Tim Tandang",
                homeId: match.homeTeam?.id,
                awayId: match.awayTeam?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                // Kita kirim data mentah agar Frontend yang merakit jamnya dengan akurat!
                timestamp: match.startTimestamp || 0, 
                statusCode: match.status?.code || 0,
                statusDesc: match.status?.description || match.status?.type || "FT",
                leagueName: leagueName.toLowerCase() // huruf kecil agar mudah difilter
            };
        });

        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
