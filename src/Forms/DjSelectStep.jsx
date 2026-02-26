import React, { useEffect, useState } from "react";
import "./css/Decor&Venue.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function DjSelectStep({ selectedId = "", onSelect }) {
    const [djs, setDjs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchDjs() {
            try {
                setLoading(true);
                setErrorMsg("");

                const colRef = collection(db, "Collection");
                const snapshot = await getDocs(colRef);

                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const djDocs = allDocs.filter((doc) => doc.category === "music");
                setDjs(djDocs);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load DJs");
            } finally {
                setLoading(false);
            }
        }

        fetchDjs();
    }, []);

    function pickDj(dj) {
        if (selectedId === dj.id) return onSelect(null);
        onSelect(dj);
    }

    if (loading) return <p>Loading DJs...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select DJ</h2>
                <p className="sc-sub">Choose one DJ & Music package for your event</p>
            </div>

            <div className="sc-grid">
                {djs.map((dj) => {
                    const isActive = selectedId === dj.id;

                    const imageUrl =
                        dj.image ||
                        dj.photoURL ||
                        dj.cover ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    const name = dj.name || dj.title || "DJ Package";
                    const desc = dj.description || dj.desc || dj.bio || "No description available";
                    const price = dj.pricePerHour || dj.price || 0;
                    const location = dj.city || dj.location || dj.area || dj.address || "—";

                    return (
                        <button
                            key={dj.id}
                            type="button"
                            className={`sc-card ${isActive ? "active" : ""}`}
                            onClick={() => pickDj(dj)}
                        >
                            <img className="sc-img" src={imageUrl} alt={name} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{name}</div>
                                    <div className="sc-price">₪{price || "—"}/hr</div>
                                </div>

                                <div className="sc-desc">{desc}</div>
                                <div className="sc-desc" style={{ marginTop: 8 }}>📍 {location}</div>

                                {dj.email && <div className="sc-desc" style={{ marginTop: 6 }}>✉ {dj.email}</div>}
                                {isActive && <div className="sc-selected">Selected</div>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}