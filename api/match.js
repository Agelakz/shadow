export default function handler(req, res) {
    // Simulasi data pertandingan dari API
    const liveData = [
        {
            leagueName: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGGRIS: Premier League",
            matches: [
                { time: "75'", home: "Liverpool", away: "Tottenham", scoreHome: 2, scoreAway: 1, isLive: true },
                { time: "FT", home: "Arsenal", away: "Chelsea", scoreHome: 0, scoreAway: 1, isLive: false },
                { time: "45'", home: "Man City", away: "Man United", scoreHome: 1, scoreAway: 0, isLive: true }
            ]
        },
        {
            leagueName: "🎾 ATP: Indian Wells",
            matches: [
                { time: "Set 2", home: "C. Alcaraz", away: "J. Sinner", scoreHome: "6  4", scoreAway: "3  2", isLive: true }
            ]
        },
        {
            leagueName: "🇪🇸 SPANYOL: La Liga",
            matches: [
                { time: "FT", home: "Real Madrid", away: "Barcelona", scoreHome: 3, scoreAway: 1, isLive: false }
            ]
        }
    ];

    res.status(200).json(liveData);
}
