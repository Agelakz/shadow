export default async function handler(req, res) {
    try {
        const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';
        const matchesUrl = 'https://api.sportsrc.org/?data=matches&category=football';

        // 🚀 SUPER SPEED: Mengambil 2 data sekaligus secara paralel (bersamaan)
        const [leaguesRes, matchesRes] = await Promise.all([
            fetch(leaguesUrl),
            fetch(matchesUrl)
        ]);

        const leaguesJson = await leaguesRes.json();
        const matchesJson = await matchesRes.json();

        const leaguesData = leaguesJson.success ? leaguesJson.data : [];
        let matchesData = [];

        if (matchesJson.success && matchesJson.data) {
            matchesData = matchesJson.data.map(item => {
                const matchDate = new Date(item.date);
                const timeString = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                return {
                    id: item.id,
                    home: item.teams?.home?.name || "Tim Kandang",
                    away: item.teams?.away?.name || "Tim Tandang",
                    scoreHome: "-", 
                    scoreAway: "-", 
                    time: timeString,
                    leagueId: item.league || item.category || "Lainnya"
                };
            });
        }

        res.status(200).json({
            leagues: leaguesData,
            matches: matchesData
        });

    } catch (error) {
        console.error("Terjadi kesalahan backend:", error);
        res.status(500).json({ error: "Gagal memproses data API sportsrc" });
    }
}
