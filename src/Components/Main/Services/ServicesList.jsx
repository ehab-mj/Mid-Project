import React, { useEffect, useState } from "react";
import { getProvidersByCategory } from "./ServicesCategory/providers";
import '../../../Pages/css/ServicesPage.css'

/**
 * Universal list component for any category in 'Collection'
 * @param {Object} props
 * @param {"music"|"decoration"|"photography"|"venue"} props.selectedCategory
 * @param {string} [props.title] - Optional custom title shown above the list
 */
export default function ServicesList({ selectedCategory, title }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const data = await getProvidersByCategory(selectedCategory);
                if (mounted) {
                    setServices(data);
                    setError("");
                }
            } catch (e) {
                if (mounted) setError(e?.message || "Failed to load data");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [selectedCategory]);

    const categoryLabels = {
        music: "DJs & Music",
        decoration: "Decorations",
        photography: "Photographers",
        venue: "Venues",
    };

    return (
        <div className="category-content">
            <div className="content-header">
                <h2 className="content-title">
                    {title || categoryLabels[selectedCategory] || "Services"}
                </h2>
                <span className="count-badge">{services.length}</span>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
                <div className="services-list">
                    {services.map((service) => (
                        <ServiceCardFunc key={service.id} item={service} />
                    ))}
                    {!services.length && <p>لا يوجد نتائج حالياً.</p>}
                </div>
            )}
        </div>
    );
}

function ServiceCardFunc({ item }) {
    const {
        name,
        description,
        features = [],
        price,
        rating,
        imageUrl,
        isAvailable,
    } = item;

    return (
        <div className="service-card">

            {imageUrl ? (
                <img src={imageUrl} alt={name} className="card-image" loading="lazy" />
            ) : (
                <div className="card-image placeholder-gradient" />
            )}

            <div className="card-body">

                <div className="card-heading">
                    <h3 className="service-name">{name}</h3>
                    {typeof rating === "number" && (
                        <span className="rating-badge">⭐ {rating.toFixed(1)}</span>
                    )}
                </div>


                {description && <p className="service-description">{description}</p>}


                {!!features.length && (
                    <div className="tags">
                        {features.slice(0, 4).map((t, i) => (
                            <span key={i} className="tag">
                                {t}
                            </span>
                        ))}
                    </div>
                )}


                <div className="card-footer">
                    {typeof price === "number" && (
                        <span className="service-price">${price.toLocaleString()}</span>
                    )}
                    {isAvailable && (
                        <span className="availability">✔ Custom options available</span>
                    )}
                </div>
            </div>
        </div>
    );
}