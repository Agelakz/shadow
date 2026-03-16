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
        
        // CEK APAKAH KENA LIMIT DARI RAPID API
        if (rawData.message) {
            return res.status(200).json({ error: `Pesan RapidAPI: ${rawData.message}` });
        }

        // BONGKAR SEMUA KEMUNGKINAN LACI DATA
        let matchesArray = [];
        if (Array.isArray(rawData)) matchesArray = rawData;
        else if (rawData.response && Array.isArray(rawData.response)) matchesArray = rawData.response;
        else if (rawData.response?.matches && Array.isArray(rawData.response.matches)) matchesArray = rawData.response.matches;
        else if (rawData.events && Array.isArray(rawData.events)) matchesArray = rawData.events;
        else if (rawData.data && Array.isArray(rawData.data)) matchesArray = rawData.data;

        const mappedMatches = matchesArray.map((match, index) => {
            let hScore = match.homeScore?.display ?? match.homeScore?.current ?? match.score?.home ?? "-";
            let aScore = match.awayScore?.display ?? match.awayScore?.current ?? match.score?.away ?? "-";

            let leagueName = "Lain-lain";
            if (match.tournament?.name) leagueName = match.tournament.name;
            else if (match.league?.name) leagueName = match.league.name;
            else if (match.tournament?.category?.name) leagueName = match.tournament.category.name;

            return {
                id: match.id || index.toString(),
                home: match.homeTeam?.name || match.home?.name || "Tim Kandang",
                away: match.awayTeam?.name || match.away?.name || "Tim Tandang",
                homeId: match.homeTeam?.id || match.home?.id,
                awayId: match.awayTeam?.id || match.away?.id,
                scoreHome: hScore,
                scoreAway: aScore,
                timestamp: match.startTimestamp || 0,
                statusCode: match.status?.code || 0,
                statusDesc: match.status?.description || match.status?.type || "FT",
                leagueName: leagueName.toLowerCase() // huruf kecil agar filter mudah
            };
        });

        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
