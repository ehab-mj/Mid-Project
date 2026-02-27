import React, { useEffect, useState } from "react";
import "./css/Decor&Venue.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function PhotographerStep({ selectedId = "", onSelect }) {
    const [phgrs, setPhgrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchPhotographer() {
            try {
                setLoading(true);
                setErrorMsg("");

                const colRef = collection(db, "Collection");
                const snapshot = await getDocs(colRef);

                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const djDocs = allDocs.filter((doc) => doc.category === "photography");
                setPhgrs(djDocs);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load DJs");
            } finally {
                setLoading(false);
            }
        }

        fetchPhotographer();
    }, []);

    function pickPhgr(phgr) {
        if (selectedId === phgr.id) return onSelect(null);
        onSelect(phgr);
    }

    if (loading) return <p>Loading Photography...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Photographer</h2>
                <p className="sc-sub">Choose one Photographer package for your event</p>
            </div>

            <div className="sc-grid">
                {phgrs.map((phgr) => {
                    const isActive = selectedId === phgr.id;

                    const imageUrl =
                        phgr.image ||
                        phgr.photoURL ||
                        phgr.cover ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    const name = phgr.name || phgr.title || "DJ Package";
                    const desc = phgr.description || phgr.desc || phgr.bio || "No description available";
                    const price = phgr.pricePerHour || phgr.price || 0;
                    const location = phgr.city || phgr.location || phgr.area || phgr.address || "—";

                    return (
                        <button
                            key={phgr.id}
                            type="button"
                            className={`sc-card ${isActive ? "active" : ""}`}
                            onClick={() => pickPhgr(phgr)}
                        >
                            <img className="sc-img" src={imageUrl} alt={name} />

                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{name}</div>
                                    <div className="sc-price">₪{price || "—"}/hr</div>
                                </div>

                                <div className="sc-desc">{desc}</div>
                                <div className="sc-desc" style={{ marginTop: 8 }}>📍 {location}</div>

                                {phgr.email && <div className="sc-desc" style={{ marginTop: 6 }}>✉ {phgr.email}</div>}
                                {isActive && <div className="sc-selected">Selected</div>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}