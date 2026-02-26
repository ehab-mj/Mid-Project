import React, { useEffect, useState } from "react";
import "./css/Decor&Venue.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function VenueStep({ selectedId = "", onSelect }) {
    const [venues, setVenues] = useState([]);
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

                const venueDocs = allDocs.filter((doc) => doc.category === "venue");
                setVenues(venueDocs);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load venues");
            } finally {
                setLoading(false);
            }
        }

        fetchVenues();
    }, []);

    function pickVenue(v) {
        if (selectedId === v.id) return onSelect(null);
        onSelect(v);
    }

    if (loading) return <p>Loading venues...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Venue</h2>
                <p className="sc-sub">Choose one venue for your event</p>
            </div>

            <div className="sc-grid">
                {venues.map((v) => {
                    const isActive = selectedId === v.id;

                    const imageUrl =
                        v.image ||
                        v.photoURL ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    const name = v.name || v.title || "Venue";
                    const location = v.location || v.city || v.area || "—";
                    const pricePerHour = v.pricePerHour || v.price || 0;
                    const capacity = v.capacity || 0;

                    return (
                        <button
                            key={v.id}
                            type="button"
                            className={`sc-card ${isActive ? "active" : ""}`}
                            onClick={() => pickVenue(v)}
                        >
                            <img className="sc-img" src={imageUrl} alt={name} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{name}</div>
                                    <div className="sc-price">₪{pricePerHour || "—"}/hr</div>
                                </div>

                                <div className="sc-desc">📍 {location}</div>
                                <div className="sc-desc">👥 Capacity: {capacity || "—"}</div>

                                {isActive && <div className="sc-selected">Selected</div>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}