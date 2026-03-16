export default async function handler(req, res) {
    // Ini adalah URL pasti dari screenshot Anda
    const url = 'https://free-api-live-football-data.p.rapidapi.com/football-current-live';
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
            'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d' // API Key Anda
        }
    };

    try {
        const response = await fetch(url, options);
        
        // Membaca data dari RapidAPI
        const result = await response.json();
        
        // Langsung tampilkan ke layar agar kita bisa pelajari bentuknya
        res.status(200).json(result);

    } catch (error) {
        console.error("Gagal koneksi ke RapidAPI:", error);
        res.status(500).json({ error: "Gagal terhubung ke RapidAPI", detail: error.message });
    }
}
