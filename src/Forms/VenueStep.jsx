import React from "react";
import './css/Decor&Venue.css'

const VENUES = [
    {
        id: "venue_ballroom",
        name: "Grand Ballroom",
        location: "Downtown Manhattan, NY",
        capacity: 300,
        amenities: ["Parking", "Stage", "VIP Area"],
        pricePerHour: 500,
        img: "https://images.unsplash.com/photo-1521337706264-a414f153a5f5?auto=format&fit=crop&w=1200&q=60",
    },
    {
        id: "venue_rooftop",
        name: "Rooftop Garden",
        location: "Brooklyn, NY",
        capacity: 150,
        amenities: ["Outdoor", "Bar", "City View"],
        pricePerHour: 350,
        img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=60",
    },
    {
        id: "venue_beach",
        name: "Beachside Pavilion",
        location: "Long Beach, NY",
        capacity: 200,
        amenities: ["Ocean View", "Outdoor", "Photography Spot"],
        pricePerHour: 400,
        img: "https://images.unsplash.com/photo-1529634897861-1d7d2f3b2e52?auto=format&fit=crop&w=1200&q=60",
    },
];

export default function VenueStep({ selectedId, onSelect }) {
    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Your Venue</h2>
                <p className="sc-sub">Choose the perfect location for your event</p>
            </div>

            <div className="sc-grid">
                {VENUES.map((v) => {
                    const active = selectedId === v.id;
                    return (
                        <button
                            key={v.id}
                            type="button"
                            className={`sc-card ${active ? "active" : ""}`}
                            onClick={() => onSelect(v)}
                        >
                            <img className="sc-img" src={v.img} alt={v.name} />
                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{v.name}</div>
                                    <div className="sc-price">${v.pricePerHour}/hr</div>
                                </div>

                                <div className="sc-meta">📍 {v.location}</div>
                                <div className="sc-meta">👥 Capacity: {v.capacity}</div>

                                <div className="sc-tags">
                                    {v.amenities.map((a) => (
                                        <span className="sc-tag" key={a}>{a}</span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
