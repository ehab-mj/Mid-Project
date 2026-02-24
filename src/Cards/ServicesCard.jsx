import React from "react";
import "./css/ServiceCard.css";

export default function ServiceCard({ item, category, onClick }) {
    const title = item.title || item.name || item.packageName || "Service";
    const desc = item.description || item.bio || "View full package details";
    const img = item.image || item.photoURL || item.cover || item.thumbnail;

    const price =
        item.price ??
        item.totalPrice ??
        item.pricePerHour ??
        item.packagePrice ??
        0;

    const tags = useMemo(() => {
        const arr =
            item.tags ||
            item.genres ||
            item.styles ||
            item.categories ||
            [];
        return Array.isArray(arr) ? arr : [];
    }, [item]);

    return (
        <button type="button" className="svcCard" onClick={onClick}>
            <div className={`svcMedia ${img ? "" : "blank"}`}>
                {img ? <img src={img} alt={title} /> : <div className="svcPlaceholder" />}

                <div className="svcRating">
                    <span className="svcStar">★</span>
                    <span>{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="svcBody">
                <h3 className="svcTitle">{title}</h3>

                {tags.length > 0 && (
                    <div className="svcTags">
                        {tags.slice(0, 4).map((t) => (
                            <span key={t} className="svcTag">{t}</span>
                        ))}
                    </div>
                )}

                <p className="svcDesc">{desc}</p>

                <div className="svcBottom">
                    <div className="svcLeft">
                        <div className="svcFrom">Packages from:</div>
                        <div className="svcNote">🎵 Custom playlists available</div>
                    </div>

                    <div className="svcPrice">₪{Number(price || 0).toLocaleString()}</div>
                </div>
            </div>
        </button>
    );
}