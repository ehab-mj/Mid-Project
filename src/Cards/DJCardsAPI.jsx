import React from "react";
import './css/DJCardsAPI.css'

export default function DJCardsAPI({ dj, selected, onSelect }) {
    return (
        <button
            type="button"
            className={`djcard ${selected ? "selected" : ""}`}
            onClick={() => onSelect?.(dj)}
        >
            <div className="djcard-top">
                <div className="djcard-avatar">
                    {dj.photoURL ? <img src={dj.photoURL} alt="" /> : <span>🎧</span>}
                </div>

                <div className="djcard-main">
                    <div className="djcard-name">{dj.name || "DJ"}</div>
                    <div className="djcard-sub">{dj.location || "—"} • {dj.email}</div>
                </div>

                <div className="djcard-price">${dj.pricePerHour || 0}/hr</div>
            </div>

            <div className="djcard-tags">
                {(dj.tags || []).slice(0, 5).map((t) => (
                    <span key={t} className="djcard-tag">{t}</span>
                ))}
            </div>

            <div className="djcard-portfolio">
                {(dj.portfolio || []).slice(0, 3).map((url) => (
                    <img key={url} src={url} alt="" />
                ))}
            </div>
        </button>
    );
}