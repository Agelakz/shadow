export default async function handler(req, res) {
    const { type, id, h2h, league, season } = req.query;
    const apiKey = '20178b9693c87fccba1b1cbd4cc44830';
    let url = "";

    if (type === 'stats') {
        url = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`;
    } else if (type === 'h2h') {
        url = `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${h2h}&last=5`;
    } else if (type === 'standing') {
        url = `https://v3.football.api-sports.io/standings?league=${league}&season=${season}`;
    } else {
        return res.status(400).json({ error: "Tipe analisis tidak valid" });
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'x-apisports-key': apiKey }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Gagal menarik data analisis" });
    }
}
