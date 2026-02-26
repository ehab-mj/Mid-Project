import React, { useEffect, useMemo, useState } from "react";
import "./css/Decor&Venue.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function DecorationStep({ selectedIds = [], onChange }) {
    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    useEffect(() => {
        async function fetchDecorations() {
            try {
                setLoading(true);

                const colRef = collection(db, "Collection");
                const snapshot = await getDocs(colRef);

                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const decorDocs = allDocs.filter((doc) => doc.category === "decoration");
                setDecorations(decorDocs);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load decorations");
            } finally {
                setLoading(false);
            }
        }

        fetchDecorations();
    }, []);

    function togglePkg(pkg) {
        const nextIds = selectedSet.has(pkg.id)
            ? selectedIds.filter((id) => id !== pkg.id)
            : [...selectedIds, pkg.id];

        const nextPkgs = decorations.filter((d) => nextIds.includes(d.id));
        onChange(nextPkgs);
    }

    if (loading) return <p>Loading decorations...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Decoration</h2>
                <p className="sc-sub">Choose decoration package(s) for your event</p>
            </div>

            <div className="sc-grid">
                {decorations.map((pkg) => {
                    const isActive = selectedSet.has(pkg.id);

                    const imageUrl =
                        pkg.image ||
                        pkg.photoURL ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    return (
                        <button
                            key={pkg.id}
                            type="button"
                            className={`sc-card ${isActive ? "active" : ""}`}
                            onClick={() => togglePkg(pkg)}
                        >
                            <img className="sc-img" src={imageUrl} alt={pkg.name || "Decoration package"} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{pkg.name || "Unnamed Package"}</div>
                                    <div className="sc-price">₪{pkg.price || "?"}</div>
                                </div>

                                <div className="sc-desc">{pkg.description || pkg.desc || "No description available"}</div>

                                {isActive && <div className="sc-selected">Selected</div>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}