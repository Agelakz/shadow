export default async function handler(req, res) {
    // Cache 30 Menit yang Anda minta sebelumnya
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

    try {
        let queryDate = req.query.date || new Date().toISOString().split('T')[0];
        
        const url = `https://v3.football.api-sports.io/fixtures?date=${queryDate}`;
        const options = {
            method: 'GET',
            headers: { 
                // 👇 JANGAN LUPA MASUKKAN API KEY ANDA DI SINI 👇
                'x-apisports-key': 'MASUKKAN_API_KEY_ANDA_DI_SINI' 
            }
        };

        const response = await fetch(url, options);
        const rawData = await response.json();
        
        if (rawData.errors && Object.keys(rawData.errors).length > 0) {
            return res.status(200).json({ error: Object.values(rawData.errors)[0] });
        }

        const matchesArray = rawData.response || [];

        const mappedMatches = matchesArray.map((match) => {
            return {
                id: match.fixture.id,
                home: match.teams.home.name,
                away: match.teams.away.name,
                homeLogo: match.teams.home.logo,
                awayLogo: match.teams.away.logo,
                homeId: match.teams.home.id,
                awayId: match.teams.away.id,
                leagueId: match.league.id,
                season: match.league.season,
                scoreHome: match.goals.home !== null ? match.goals.home : "-",
                scoreAway: match.goals.away !== null ? match.goals.away : "-",
                timestamp: match.fixture.timestamp,
                statusCode: match.fixture.status.short,
                statusDesc: match.fixture.status.long,
                leagueName: match.league.name.toLowerCase(),
                // 👇 DUA BARIS BARU UNTUK NEGARA & BENDERA 👇
                leagueCountry: match.league.country, 
                leagueFlag: match.league.flag
            };
        });

        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
