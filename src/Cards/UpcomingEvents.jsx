import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

import ServicesCard from "../Cards/ServicesCard"; // adjust path if needed
import "./css/UpcomingEvents.css";

export default function UpcomingEvents({ title = "Upcoming Music Events" }) {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchMusicServices() {
            try {
                setLoading(true);
                setErrorMsg("");

                const snap = await getDocs(collection(db, "Collection"));

                const all = snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));

                // ✅ FILTER: Only category = music AND available
                const musicOnly = all.filter(
                    (item) =>
                        String(item.category || "").toLowerCase() === "music" &&
                        Boolean(item.isAvailable) === true
                );

                setItems(musicOnly);
            } catch (e) {
                setErrorMsg(e.message || "Failed to load music services");
            } finally {
                setLoading(false);
            }
        }

        fetchMusicServices();
    }, []);

    return (
        <section className="upc-wrap">
            <div className="upc-title">{title}</div>

            {loading && <p className="upc-msg">Loading...</p>}
            {errorMsg && <p className="upc-msg upc-err">{errorMsg}</p>}

            {!loading && !errorMsg && items.length === 0 && (
                <p className="upc-msg">No active music services found.</p>
            )}

            <div className="upc-grid">
                {items.map((item) => (
                    <ServicesCard
                        key={item.id}
                        item={item}
                        category={item.category}
                        onClick={() => navigate(`/package/${item.id}`)}
                    />
                ))}
            </div>
        </section>
    );
}