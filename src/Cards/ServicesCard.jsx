import React, { useMemo, useState } from "react";
import "./css/ServicesCard.css";

export default function ServicesCard({ item, category, onClick }) {
    const title = item.title || item.name || item.packageName || "Service";
    const desc = item.description || item.bio || "View full package details";

    const img = item.image || item.photoURL || item.cover || item.thumbnail; // NO placeholder.com
    const [imgOk, setImgOk] = useState(true);

    const price =
        item.price ??
        item.totalPrice ??
        item.pricePerHour ??
        item.packagePrice ??
        0;

    const rating = Number(item.rating ?? item.stars ?? 4.8);

    const tags = useMemo(() => {
        const arr = item.tags || item.genres || item.styles || item.categories || [];
        return Array.isArray(arr) ? arr : [];
    }, [item]);

    return (
        <div className="svcCard" onClick={onClick} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick?.()}>
            <div className={`svcMedia ${img && imgOk ? "" : "blank"}`}>
                {img && imgOk ? (
                    <img
                        src={img}
                        alt={title}
                        className="svcImg"
                        onError={() => setImgOk(false)}
                    />
                ) : (
                    <div className="svcBlank">
                        <span className="svcBlankIcon">🎉</span>
                    </div>
                )}

                <div className="svcRating">
                    <span className="svcStar">★</span>
                    <span className="svcRatingNum">{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="svcBody">
                <div className="svcTitle">{title}</div>

                {tags.length > 0 && (
                    <div className="svcTags">
                        {tags.slice(0, 4).map((t) => (
                            <span key={t} className="svcTag">{t}</span>
                        ))}
                    </div>
                )}

                <div className="svcDesc">{desc}</div>

                <div className="svcBottom">
                    <div>
                        <div className="svcFrom">Packages from:</div>
                        <div className="svcNote">🎵 Custom playlists available</div>
                    </div>
                    <div className="svcPrice">₪{Number(price || 0).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}