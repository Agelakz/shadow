export default async function handler(req, res) {
    // Kita matikan cache sementara untuk tes ini
    res.setHeader('Cache-Control', 'no-store');

    try {
        // Ini adalah URL sakti temuan Anda!
        const url = `https://api.sportsrc.org/v2/?type=matches&api_key=2ae30aee0f4854af5cbfcd1d40ab7d83`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Kita kirim seluruh data mentah ini langsung ke layar Anda
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Gagal menarik data dari Sportsrc", detail: error.message });
    }
}
