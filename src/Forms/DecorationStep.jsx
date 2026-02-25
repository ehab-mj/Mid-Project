import React, { useEffect, useState } from "react";
import "./css/Decor&Venue.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function DecorationStep({ selectedId, onSelect }) {
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchDecorations() {
            try {
                setLoading(true);

                console.log("→ Reading ALL documents from /Collection");

                const colRef = collection(db, "Collection");
                const snapshot = await getDocs(colRef);

                console.log("→ Total docs:", snapshot.size);

                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("→ All docs:", allDocs);

                // Filter only decoration category items
                const decorDocs = allDocs.filter(
                    (doc) => doc.category === "decoration"
                );


                console.log("→ Decoration docs:", decorDocs);

                setDecorations(decorDocs);
            } catch (err) {
                console.error("Fetch decorations failed:", err);
                setErrorMsg(err.message || "Failed to load decorations");
            } finally {
                setLoading(false);
            }
        }

        fetchDecorations();
    }, []);

    if (loading) return <p>Loading decorations...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Decoration</h2>
                <p className="sc-sub">Choose a decoration package for your event</p>
            </div>

            <div className="sc-grid">
                {decorations.map((pkg) => {
                    const isActive = selectedId === pkg.id;

                    const imageUrl =
                        pkg.image ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    return (
                        <button
                            key={pkg.id}
                            type="button"
                            className={`sc-card ${isActive ? "active" : ""}`}
                            onClick={() => onSelect(pkg)}
                        >

                            <img className="sc-img" src={imageUrl} alt={pkg.name || "Decoration package"} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{pkg.name || "Unnamed Package"}</div>
                                    <div className="sc-price">₪{pkg.price || "?"}</div>
                                </div>

                                <div className="sc-desc">
                                    {pkg.description || pkg.desc || "No description available"}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}