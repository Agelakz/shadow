export default async function handler(req, res) {
    const { type, id } = req.query; // type: 'standing' atau 'stats'
    const apiKey = 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d';
    const host = 'free-api-live-football-data.p.rapidapi.com';

    let url = "";
    if (type === 'standing') {
        url = `https://${host}/football-get-standing-all?leagueid=${id}`;
    } else {
        url = `https://${host}/football-get-match-all-stats?eventid=${id}`;
    }

    try {
        const response = await fetch(url, {
            headers: { 'x-rapidapi-host': host, 'x-rapidapi-key': apiKey }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
