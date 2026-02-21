import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Forms/css/ServicesPage.css";
import { listenProvidersByCategory } from "../services/providers";

export default function CategoriesBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("music");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // تعريف العناصر
  const items = useMemo(() => [
    { name: "DJs & Music", icon: "🎵", path: "/music", key: "music", count: 50 },
    { name: "Decorations", icon: "🪅", path: "/decorations", key: "decoration", count: 30 },
    { name: "Photographers", icon: "📸", path: "/photographers", key: "photography", count: 25 },
    { name: "Venues", icon: "🏛️", path: "/venues", key: "venue", count: 20 },
  ], []);

  // تحديد الكاتيجوري من URL
  const categoryFromUrl = useMemo(() => {
    const path = location.pathname.replace("/", "");
    const matched = items.find((i) => i.path.replace("/", "") === path);
    return matched?.key || "music";
  }, [location.pathname, items]);

  // تحديث selectedCategory عند تغيير URL
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // 🔥 Listen to realtime updates whenever selectedCategory changes
  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);

    const unsub = listenProvidersByCategory(
      selectedCategory,
      (arr) => {
        setData(arr);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Error loading data");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [selectedCategory]);

  const handleCategoryClick = (item) => {
    setSelectedCategory(item.key);
    navigate(item.path);
  };

  return (
    <div className="categories-wrapper">
      <h1 className="title">All Event Services</h1>
      <p className="subtitle">Browse our complete catalog of event services</p>

      {/* Tabs */}
      <div className="categories-container">
        {items.map((item) => (
          <div
            key={item.key}
            onClick={() => handleCategoryClick(item)}
            className={`category-item ${
              selectedCategory === item.key ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.name}</span>
            {item.count && <span className="count">{item.count}</span>}
          </div>
        ))}
      </div>

      {/* Content */}
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
  );
}
