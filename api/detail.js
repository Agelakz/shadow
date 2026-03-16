export default async function handler(req, res) {
    // SIHIR CACHING VERCEL: Simpan data analisis selama 5 MENIT (300 detik)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    const { type, id, h2h, league, season } = req.query;
    const apiKey = 'API_KEY_BARU_ANDA'; // MASUKKAN API KEY BARU DI SINI JUGA
    let url = "";

    if (type === 'stats') {
        url = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`;
    } else if (type === 'h2h') {
        url = `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${h2h}&last=5`;
    } else if (type === 'standing') {
        url = `https://v3.football.api-sports.io/standings?league=${league}&season=${season}`;
    } else if (type === 'odds') {
        url = `https://v3.football.api-sports.io/odds?fixture=${id}`;
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
