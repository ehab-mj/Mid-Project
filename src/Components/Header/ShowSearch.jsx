import React from "react";

export default function ShowSearch({ items, onSelect }) {
    return (
        <div className="search-grid">
            {items.map((item) => {
                const img =
                    item.image ||
                    item.imageUrl ||
                    "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                const price =
                    typeof item.pricePerHour === "number"
                        ? item.pricePerHour
                        : typeof item.price === "number"
                            ? item.price
                            : null;

                return (
                    <button
                        key={item.id}
                        type="button"
                        className="search-card"
                        onClick={() => onSelect(item)}
                    >
                        <div className="search-media">
                            <img className="search-img" src={img} alt={item.name} />

                            {typeof item.rating === "number" && (
                                <span className="search-rating">⭐ {item.rating.toFixed(1)}</span>
                            )}
                        </div>

                        <div className="search-body">
                            <div className="search-title">{item.name}</div>

                            {!!(item.features || []).length && (
                                <div className="search-tags">
                                    {(item.features || []).slice(0, 4).map((t, i) => (
                                        <span className="search-tag" key={i}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {item.description && (
                                <div className="search-desc">{item.description}</div>
                            )}

                            <div className="search-footer">
                                <div className="search-cat">{item.category}</div>
                                {price !== null && <div className="search-price">₪{price.toLocaleString()}</div>}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}