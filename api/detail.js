export default async function handler(req, res) {
    const eventId = req.query.id;
    if (!eventId) return res.status(400).json({ error: "ID Pertandingan diperlukan" });

    // Menggunakan endpoint harta karun Anda!
    const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-match-all-stats?eventid=${eventId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
                'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d'
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Gagal menarik statistik" });
    }
}
