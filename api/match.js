export default async function handler(req, res) {
    // URL ini kita coba arahkan ke "Livescores" atau daftar liga populer
    // Jika endpoint ini salah, kita akan melihat error aslinya dari RapidAPI
    const url = 'https://free-api-live-football-data.p.rapidapi.com/football-get-popular-leagues';
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
            'x-rapidapi-key': 'aa90a97566msh0596dc8fd7c0d9ep13f42bjsna912b1c6ca9d' // API Key dari gambar Anda
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        // Kita kirimkan seluruh data MENTAH dari RapidAPI langsung ke layar Anda
        // agar kita bisa membedah dan mempelajari strukturnya bersama-sama.
        res.status(200).json(result);

    } catch (error) {
        console.error("Gagal koneksi ke RapidAPI:", error);
        res.status(500).json({ error: "Gagal terhubung ke RapidAPI", detail: error.message });
    }
}
