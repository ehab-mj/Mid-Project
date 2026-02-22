import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProvidersByCategory } from "../services/providers";
import "../Forms/css/ServicesPage.css";

/**
 * Universal list component for any category in 'Collection'
 * @param {Object} props
 * @param {"music"|"decoration"|"photography"|"venue"} props.selectedCategory
 * @param {string} [props.title] - Optional custom title shown above the list
 * @param {boolean} [props.showCategoryButtons] - Whether to show category buttons (default: true)
 */
export default function ServicesList({ selectedCategory, title, showCategoryButtons = true }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(selectedCategory || "music");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getProvidersByCategory(category);
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
  }, [category]);

  const categoryLabels = {
    music: "DJs & Music",
    decoration: "Decorations",
    photography: "Photographers",
    venue: "Venues",
  };

return (
    <div className="category-content">
      {showCategoryButtons && (
      <div>
        <h1>Choose Category</h1>
        <button onClick={() => setCategory("music")}>Music</button>
        <button onClick={() => setCategory("decoration")}>Decoration</button>
        <button onClick={() => setCategory("photography")}>Photography</button>
        <button onClick={() => setCategory("venue")}>Venue</button>
      </div>
      )}

      <div className="content-header">
        <h2 className="content-title">
          {title || categoryLabels[category] || "Services"}
        </h2>
        <span className="count-badge">{services.length}</span>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="services-list">
          {services.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
          {!services.length && <p>لا يوجد نتائج حالياً.</p>}
        </div>
      )}
    </div>
  );
}

function ServiceCard({ item }) {
  const navigate = useNavigate();
  const {
    id,
    name,
    description,
    features = [],
    price,
    rating,
    imageUrl,
    isAvailable,
  } = item;

  const handleCardClick = () => {
    navigate(`/service/${id}`);
  };

  return (
    <div 
      className="service-card" 
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* صورة */}
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="card-image" loading="lazy" />
      ) : (
        <div className="card-image placeholder-gradient" />
      )}

      <div className="card-body">
        {/* العنوان + التقييم */}
        <div className="card-heading">
          <h3 className="service-name">{name}</h3>
          {typeof rating === "number" && (
            <span className="rating-badge">⭐ {rating.toFixed(1)}</span>
          )}
        </div>

        {/* الوصف */}
        {description && <p className="service-description">{description}</p>}

        {/* التاغز */}
        {!!features.length && (
          <div className="tags">
            {features.slice(0, 4).map((t, i) => (
              <span key={i} className="tag">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* السعر + ملاحظة التوفر */}
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
