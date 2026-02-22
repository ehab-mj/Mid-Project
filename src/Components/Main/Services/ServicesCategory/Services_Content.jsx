import React from 'react'
import '../css/ServicesAllPage.css'
import '../css/Services_Content.css'
export default function Services_Content({ selectedCategory, items, loading, error, providers, decorations }) {

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    if (selectedCategory === "decoration") {
        return (
            <div className="services-grid">
                {decorations.length === 0 ? (
                    <p>No decoration packages found.</p>
                ) : (
                    decorations.map(pkg => (
                        <div key={pkg.id} className="service-card">
                            <img src={pkg.Image || "fallback.jpg"} alt={pkg.name} />
                            <h3>{pkg.name}</h3>
                            <p className="price">₪{pkg.price}</p>
                            <p>{pkg.description || pkg.desc}</p>
                            <div>
                                <ul>
                                    <li>{pkg.features}</li>
                                </ul>
                            </div>
                            <p>{pkg.rating}</p>
                            <p>{pkg.category}</p>
                            {/* Add "Select" / "View details" button if needed */}
                        </div>
                    ))
                )}
            </div>
        );
    }

    return (
        <div className="services-grid">
            {providers.map(provider => (
                <div key={provider.id} className="service-card">
                    {/* your normal provider card layout */}
                </div>
            ))}
        </div>
    )
}
