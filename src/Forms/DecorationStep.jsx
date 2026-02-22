import React, { useEffect, useState } from "react";
import './css/Decor&Venue.css'
import { collection, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../firebase/config";

export default function DecorationStep({ selectedId, onSelect }) {

    const [decorations, setDecorations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function testRead() {
            try {
                console.log("→ Starting read from collection: decor_1");

                const colRef = collection(db, "decor_1");
                const snapshot = await getDocs(colRef);

                console.log("→ Query finished");
                console.log("→ empty?", snapshot.empty);
                console.log("→ count:", snapshot.size);
                console.log("→ from cache?", snapshot.metadata.fromCache);

                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));

                console.log("→ All documents:", data);

                setDecorations(data);
            } catch (err) {
                console.error("→ ERROR:", err);
                console.error("→ Code:", err.code);
                console.error("→ Message:", err.message);

                let friendlyMsg = "Unknown error";

                if (err.code === "permission-denied") {
                    friendlyMsg = "PERMISSION DENIED → your security rules do not allow reading decor_1";
                } else if (err.code === "unavailable") {
                    friendlyMsg = "Firestore unavailable (check internet / emulator)";
                } else if (err.code === "failed-precondition") {
                    friendlyMsg = "Failed precondition (emulator / rules issue?)";
                }

                setErrorMsg(friendlyMsg + " — check browser console for details");
            } finally {
                setLoading(false);
            }
        }

        testRead();
    }, []);

    if (loading) return <div style={{ padding: "2rem" }}>Loading documents from decor_1...</div>;

    if (errorMsg) {
        return (
            <div style={{ padding: "2rem", color: "red", fontWeight: "bold" }}>
                Error: {errorMsg}
                <br /><br />
                <small>Open browser console (F12) and look for lines starting with →</small>
            </div>
        );
    }

    if (docs.length === 0) {
        return (
            <div style={{ padding: "2rem", background: "#fff3cd", border: "1px solid #ffeeba" }}>
                <strong>No documents found in decor_1</strong>
                <ul style={{ marginTop: "1rem" }}>
                    <li>Check security rules → must allow read on /decor_1</li>
                    <li>Confirm collection name is exactly "decor_1" (underscore, lowercase d)</li>
                    <li>Make sure documents have top-level fields (not only subcollections)</li>
                    <li>Look at browser console for more clues</li>
                </ul>
            </div>
        );
    }

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Decoration</h2>
                <p className="sc-sub">Choose a decoration package for your event</p>
            </div>

            <div className="sc-grid">
                {decorations.length === 0 ? (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
                        No decoration packages found
                    </p>
                ) : (
                    decorations.map((pkg) => {
                        const isActive = selectedId === pkg.id;

                        // Fallback values in case some fields are missing
                        const imageUrl =
                            pkg.img ||
                            "https://images.unsplash.com/photo-1519741497674-281450b9b157?auto=format&fit=crop&w=800&q=80";

                        return (
                            <button
                                key={pkg.id}
                                type="button"
                                className={`sc-card ${isActive ? "active" : ""}`}
                                onClick={() => onSelect(pkg)}
                                disabled={!pkg.isAvailable}
                                style={{ opacity: pkg.isAvailable ? 1 : 0.6 }}
                            >
                                <img className="sc-img" src={imageUrl} alt={pkg.name || "Decoration"} />

                                <div className="sc-body">
                                    <div className="sc-row">
                                        <div className="sc-name">{pkg.name || "Unnamed Package"}</div>
                                        <div className="sc-price">
                                            {pkg.price ? `₪${pkg.price.toLocaleString()}` : "Contact for price"}
                                        </div>
                                    </div>

                                    <div className="sc-desc">
                                        {pkg.description || pkg.desc || "No description available"}
                                    </div>

                                    {pkg.rating && (
                                        <div className="sc-rating">★ {pkg.rating.toFixed(1)}</div>
                                    )}

                                    {!pkg.isAvailable && (
                                        <div style={{ color: "#e74c3c", fontSize: "0.9rem", marginTop: "8px" }}>
                                            Currently Unavailable
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
