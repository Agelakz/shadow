export default async function handler(req, res) {
    try {
        const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';
        const matchesUrl = 'https://api.sportsrc.org/?data=matches&category=football';

        // Menarik data dengan pelindung agar tidak crash jika sportsrc error
        const [leaguesRes, matchesRes] = await Promise.all([
            fetch(leaguesUrl).catch(() => null),
            fetch(matchesUrl).catch(() => null)
        ]);

        // Jika API sportsrc menolak koneksi sama sekali
        if (!leaguesRes || !matchesRes || !leaguesRes.ok || !matchesRes.ok) {
            return res.status(200).json({ leagues: [], matches: [], error: "API sportsrc sedang sibuk/menolak koneksi." });
        }

        const leaguesJson = await leaguesRes.json();
        const matchesJson = await matchesRes.json();

        const leaguesData = leaguesJson.success ? leaguesJson.data : [];
        let matchesData = [];

        if (matchesJson.success && matchesJson.data) {
            matchesData = matchesJson.data.map(item => {
                let timeString = "TBA";
                let dateString = "1970-01-01"; 

                if (item.date) {
                    const timestamp = isNaN(item.date) ? item.date : Number(item.date);
                    const matchDate = new Date(timestamp);
                    if (!isNaN(matchDate.getTime())) {
                        timeString = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                        const yyyy = matchDate.getFullYear();
                        const mm = String(matchDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(matchDate.getDate()).padStart(2, '0');
                        dateString = `${yyyy}-${mm}-${dd}`;
                    }
                }

                return {
                    id: item.id || Math.random().toString(),
                    home: item.teams?.home?.name || "Tim Kandang",
                    away: item.teams?.away?.name || "Tim Tandang",
                    scoreHome: "-", 
                    scoreAway: "-", 
                    time: timeString,
                    // Karena API tidak kasih tau ini liga apa, kita gabungkan teksnya agar bisa dicari
                    leagueId: item.league || "ALL", 
                    dateString: dateString
                };
            });
        }

        res.status(200).json({ leagues: leaguesData, matches: matchesData });

    } catch (error) {
        console.error("Kesalahan internal:", error);
        res.status(500).json({ error: "Gagal memproses kode." });
    }
}
