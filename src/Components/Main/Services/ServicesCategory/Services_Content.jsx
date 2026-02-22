import React from 'react'
import '../css/ServicesAllPage.css'
export default function Services_Content({ selectedCategory, items, loading, error }) {
    return (
        <div>
            {selectedCategory && (
                <div className="category-content">
                    <h2 className="content-title">
                        {items.find((i) => i.key === selectedCategory)?.name}
                    </h2>

                    {/* Loading */}
                    {loading && <p>Loading...</p>}

                    {/* Error */}
                    {error && <p className="error-text">{error}</p>}

                    {/* Data */}
                    {!loading && !error && (
                        <>
                            {data.length > 0 ? (
                                <div className="services-list">
                                    {data.map((item) => (
                                        <div key={item.id} className="service-card">
                                            {/* صورة (إذا موجودة) */}
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="card-image"
                                                />
                                            ) : (
                                                <div className="card-image placeholder-gradient" />
                                            )}

                                            <div className="card-body">
                                                <div className="card-heading">
                                                    <h3 className="service-name">{item.name}</h3>

                                                    {typeof item.rating === "number" && (
                                                        <span className="rating-badge">
                                                            ⭐ {item.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="service-description">
                                                    {item.description}
                                                </p>

                                                {/* Features */}
                                                {item.features && (
                                                    <div className="tags">
                                                        {item.features.slice(0, 4).map((tag, i) => (
                                                            <span key={i} className="tag">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="card-footer">
                                                    <span className="service-price">
                                                        ${item.price?.toLocaleString()}
                                                    </span>

                                                    {item.isAvailable && (
                                                        <span className="availability">
                                                            ✔ Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No services found in this category.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
