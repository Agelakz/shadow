export default async function handler(req, res) {
    // SIHIR CACHING VERCEL: Simpan data ini di memori Edge selama 60 detik!
    // Dalam 60 detik ke depan, berapapun orang yang buka halaman ini, API tidak akan tersentuh.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    try {
        let queryDate = req.query.date || new Date().toISOString().split('T')[0];
        
        const url = `https://v3.football.api-sports.io/fixtures?date=${queryDate}`;
        const options = {
            method: 'GET',
            headers: { 'x-apisports-key': 'API_KEY_BARU_ANDA' } // MASUKKAN API KEY BARU DI SINI
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
                leagueName: match.league.name.toLowerCase()
            };
        });

        res.status(200).json({ matches: mappedMatches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
