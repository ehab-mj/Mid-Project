import React from "react";
import "./css/DjSelectStep.css";

export default function DjSelectStep({ djs, selectedDjEmail, onSelectDjEmail, onSkip }) {
    return (
        <div className="dj-step">
            <div className="dj-head">
                <h2 className="dj-title">Select Your DJ</h2>
                <p className="dj-sub">Choose the perfect DJ for your event</p>
            </div>

            <div className="dj-grid">
                {djs.map((dj) => {
                    const active = selectedDjEmail === dj.email;

                    return (
                        <button
                            key={dj.id}
                            type="button"
                            className={`dj-card ${active ? "active" : ""}`}
                            onClick={() => onSelectDjEmail(dj.email)}
                        >
                            <div className="dj-card-top">
                                <div className="dj-avatar">{(dj.name || dj.email || "DJ")[0]}</div>
                                <div className="dj-price">{dj.pricePerHour ? `$${dj.pricePerHour}/hr` : " "}</div>
                            </div>

                            <div className="dj-name">{dj.name || "DJ"}</div>
                            <div className="dj-meta">
                                <span className="dj-meta-item">📍 {dj.city || dj.location || "—"}</span>
                                <span className="dj-meta-item">⭐ {dj.rating || "—"}</span>
                            </div>

                            <div className="dj-email">{dj.email}</div>
                        </button>
                    );
                })}
            </div>

            <button className="dj-skip" type="button" onClick={onSkip}>
                Skip - choose later
            </button>
        </div>
    );
}
