export default async function handler(req, res) {
    try {
        // API-Football membutuhkan format YYYY-MM-DD
        let queryDate = req.query.date || new Date().toISOString().split('T')[0];
        
        const url = `https://v3.football.api-sports.io/fixtures?date=${queryDate}`;
        const options = {
            method: 'GET',
            headers: {
                'x-apisports-key': '20178b9693c87fccba1b1cbd4cc44830' // API Key Baru Anda!
            }
        };

        const response = await fetch(url, options);
        const rawData = await response.json();
        
        // Cek jika ada error dari API
        if (rawData.errors && Object.keys(rawData.errors).length > 0) {
            return res.status(200).json({ error: Object.values(rawData.errors)[0] });
        }

        const matchesArray = rawData.response || [];

        const mappedMatches = matchesArray.map((match) => {
            return {
                id: match.fixture.id,
                home: match.teams.home.name,
                away: match.teams.away.name,
                homeLogo: match.teams.home.logo, // Logo resmi dari API-Football!
                awayLogo: match.teams.away.logo,
                scoreHome: match.goals.home !== null ? match.goals.home : "-",
                scoreAway: match.goals.away !== null ? match.goals.away : "-",
                timestamp: match.fixture.timestamp,
                statusCode: match.fixture.status.short, // NS (Not Started), FT, HT, dll.
                statusDesc: match.fixture.status.long,
                leagueName: match.league.name.toLowerCase(),
                leagueId: match.league.id
            };
        });

        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
