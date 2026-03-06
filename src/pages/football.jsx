import React, { useEffect, useState } from "react";

const Football = () => {
  const [matches, setMatches] = useState([]);
  const [odds, setOdds] = useState({});
  const [loading, setLoading] = useState(true);

  const API_KEY = "66d984ba9cb0695b85feae5c12a611734ca5e17f8001c84981d8d18bd6504dc7";

  useEffect(() => {
    const fetchMatchesAndOdds = async () => {
      // 1️⃣ Fetch all football events
      const eventsRes = await fetch(
        `https://api.odds-api.io/v3/events?apiKey=${API_KEY}&sport=football&limit=10`
      );
      const eventsData = await eventsRes.json();
      setMatches(eventsData);

      // 2️⃣ For each event, fetch odds
      const oddsPromises = eventsData.map(async (event) => {
        const oddsRes = await fetch(
          `https://api.odds-api.io/v3/odds?apiKey=${API_KEY}&eventId=${event.id}`
        );
        const oddsData = await oddsRes.json();
        return { eventId: event.id, data: oddsData };
      });

      const allOdds = await Promise.all(oddsPromises);
      const oddsMap = {};
      allOdds.forEach((o) => (oddsMap[o.eventId] = o.data));

      setOdds(oddsMap);
      setLoading(false);
    };

    fetchMatchesAndOdds();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", background: "#0b1d2a", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>⚽ Football Matches + Odds</h1>

      {matches.map((m) => (
        <div
          key={m.id}
          style={{ background: "#132f44", padding: "15px", margin: "10px 0", borderRadius: "8px" }}
        >
          <h2>{m.home} vs {m.away}</h2>
          <p style={{ fontSize: "14px" }}>Date: {new Date(m.date).toLocaleString()}</p>

          {odds[m.id] && odds[m.id].length ? (
            <div>
              {Object.entries(odds[m.id][0]?.bookmakers || {}).map(([bookie, markets]) => (
                <div key={bookie}>
                  <strong style={{ display: "block", marginTop: "8px" }}>{bookie}</strong>
                  {markets
                    .filter((market) => market.name === "ML")
                    .map((market, i) => (
                      <div key={i}>
                        {market.odds[0] && (
                          <div>
                            <span style={{ marginRight: "10px" }}>H: {market.odds[0].home}</span>
                            <span style={{ marginRight: "10px" }}>D: {market.odds[0].draw}</span>
                            <span>A: {market.odds[0].away}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <p>No odds found</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Football;