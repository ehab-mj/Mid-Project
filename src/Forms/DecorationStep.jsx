import React from "react";
import './css/Decor&Venue.css'

const DECORATIONS = [
    {
        id: "decor_basic",
        name: "Classic Elegance",
        price: 450,
        desc: "Simple modern setup with flowers and table styling.",
        img: "https://images.unsplash.com/photo-1529634897861-1d7d2f3b2e52?auto=format&fit=crop&w=1200&q=60",
    },
    {
        id: "decor_premium",
        name: "Premium Floral",
        price: 850,
        desc: "Full floral theme, lighting accents, premium tables.",
        img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=60",
    },
    {
        id: "decor_luxury",
        name: "Luxury Stage & Lights",
        price: 1400,
        desc: "Stage design, lighting setup, and luxury decoration.",
        img: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1200&q=60",
    },
];

export default function DecorationStep({ selectedId, onSelect }) {
    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Decoration</h2>
                <p className="sc-sub">Choose a decoration package for your event</p>
            </div>

            <div className="sc-grid">
                {DECORATIONS.map((pkg) => {
                    const active = selectedId === pkg.id;
                    return (
                        <button
                            key={pkg.id}
                            type="button"
                            className={`sc-card ${active ? "active" : ""}`}
                            onClick={() => onSelect(pkg)}
                        >
                            <img className="sc-img" src={pkg.img} alt={pkg.name} />
                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{pkg.name}</div>
                                    <div className="sc-price">${pkg.price}</div>
                                </div>
                                <div className="sc-desc">{pkg.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
