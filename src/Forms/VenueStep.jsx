import React, { useState } from "react";
import './css/Decor&Venue.css'
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function VenueStep({ selectedId, onSelect }) {
    const [Venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchVenues() {
            try {
                setLoading(true);

                const colRef = collection(db, "Collection");
                const snapshot = await getDocs(colRef);


                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const decorDocs = allDocs.filter(
                    (doc) => doc.category === "venue"
                );

                setVenues(decorDocs);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load venue");
            } finally {
                setLoading(false);
            }
        }

        fetchVenues();
    }, []);

    if (loading) return <p>Loading decorations...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Your Venue</h2>
                <p className="sc-sub">Choose the perfect location for your event</p>
            </div>

            <div className="sc-grid">
                {Venues.map((v) => {
                    const active = selectedId === v.id;
                    const imageUrl =
                        v.image ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    return (
                        <button
                            key={v.id}
                            type="button"
                            className={`sc-card ${active ? "active" : ""}`}
                            onClick={() => onSelect(v)}
                        >
                            <img className="sc-img" src={imageUrl} alt={v.name} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{v.name}</div>
                                    <div className="sc-price">${v.pricePerHour}/hr</div>
                                </div>

                                <div className="sc-meta">📍 {v.location}</div>
                                <div className="sc-meta">👥 Capacity: {v.capacity}</div>

                                {/* <div className="sc-tags">
                                    {v.amenities.map((a) => (
                                        <span className="sc-tag" key={a}>{a}</span>
                                    ))}
                                </div> */}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
