export default async function handler(req, res) {
    try {
        const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';
        const matchesUrl = 'https://api.sportsrc.org/?data=matches&category=football';

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
                // HELM PENGAMAN: Beri nilai default jika data dari API rusak/kosong
                let timeString = "TBA";
                let dateString = "1970-01-01"; 

                // Perbaikan cara membaca format waktu API
                if (item.date) {
                    try {
                        // Memastikan format waktu angka (timestamp) terbaca dengan benar, baik sebagai teks maupun angka murni
                        const timestamp = isNaN(item.date) ? item.date : Number(item.date);
                        const matchDate = new Date(timestamp);
                        
                        // Jika tanggalnya valid, baru kita ekstrak jam dan harinya
                        if (!isNaN(matchDate.getTime())) {
                            timeString = matchDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                            const yyyy = matchDate.getFullYear();
                            const mm = String(matchDate.getMonth() + 1).padStart(2, '0');
                            const dd = String(matchDate.getDate()).padStart(2, '0');
                            dateString = `${yyyy}-${mm}-${dd}`;
                        }
                    } catch(e) {
                        console.error("Gagal membaca tanggal dari API:", item.date);
                    }
                }

                return {
                    id: item.id || Math.random().toString(),
                    home: item.teams?.home?.name || "Tim Kandang",
                    away: item.teams?.away?.name || "Tim Tandang",
                    scoreHome: "-", 
                    scoreAway: "-", 
                    time: timeString,
                    leagueId: item.league || item.category || "ALL",
                    dateString: dateString
                };
            });
        }

        res.status(200).json({
            leagues: leaguesData,
            matches: matchesData
        });

    } catch (error) {
        console.error("Terjadi kesalahan fatal backend:", error);
        res.status(500).json({ error: "Gagal memproses data API sportsrc", detail: error.message });
    }
}
