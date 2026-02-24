// Services_Content.jsx  (example – adapt to your design)
import '../css/Services_Content.css'
export default function Services_Content({
    selectedCategory,
    items = [],
    loading,
    error,
}) {
    if (loading) return <div className="loading">Loading {selectedCategory}...</div>;
    if (error) return <div className="error">{error}</div>;

    if (items.length === 0) {
        return <p>No {selectedCategory} services available at the moment.</p>;
    }

    return (
        <div className="services-grid">
            {items.map((item) => (
                <div key={item.id} className="service-card">
                    <img
                        src={item.img || item.Image || item.photo || "https://via.placeholder.com/400x300"}
                        alt={item.name}
                        className="card-image"
                    />
                    <div className="card-body">
                        <h3>{item.name}</h3>

                        {item.price && (
                            <div className="price">₪{item.price.toLocaleString()}</div>
                        )}

                        <p className="description">
                            {item.description || item.bio || "No description available"}
                        </p>

                        {/* Optional: show different things based on category */}
                        {selectedCategory === "decoration" && item.features && (
                            <ul className="features">
                                {item.features.map((f, i) => (
                                    <li key={i}>• {f}</li>
                                ))}
                            </ul>
                        )}

                        {item.rating && (
                            <div className="rating">★ {item.rating.toFixed(1)}</div>
                        )}

                        <button>Select / Contact</button>
                    </div>
                </div>
            ))}
        </div>
    );
}