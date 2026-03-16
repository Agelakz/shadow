export default async function handler(req, res) {
    const eventId = req.query.id;
    if (!eventId) return res.status(400).json({ error: "ID Pertandingan diperlukan" });

    // Endpoint statistik dari API-Football
    const url = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${eventId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-apisports-key': '20178b9693c87fccba1b1cbd4cc44830'
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Gagal menarik statistik" });
    }
}
