import React, { useMemo, useState } from "react";
import "./css/ServicesCard.css";

export default function ServicesCard({ item, category, onClick }) {
    const safeItem = item ?? {};
    const title = item.title || item.name || item.packageName || "Service";
    const desc = item.description || item.bio || null;

    const img = item.image || item.photoURL
    const [imgOk, setImgOk] = useState(true);

    const cate = item.category;
    const city = item.location || item.city;

    const isAvailable = Boolean(safeItem.isAvailable);

    const price =
        item.price ??
        item.totalPrice ??
        item.pricePerHour ??
        item.packagePrice ??
        0;

    const rating = Number(item.rating ?? item.stars ?? 4.8);

    const tags = useMemo(() => {
        const arr = item.tags || item.genres || item.styles || item.categories || item.features || [];
        return Array.isArray(arr) ? arr : [];
    }, [item]);

    return (
        <section className="product-container">
            <div
                className={`svcCard ${isAvailable ? "" : "busy"}`} // busy class when not available
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onClick?.()}
            >
                {/* TOP CURVE + ACTIVE/BUSY BADGE */}
                <div
                    className="svcTop"
                    data-status={isAvailable ? "available" : "busy"} // controls top color
                >
                    <div className="svcTopCurve" />

                    <div
                        className="svcActive"
                        data-active={isAvailable ? "true" : "false"} // controls badge color
                    >
                        <span className={`svcDot ${isAvailable ? "available" : "busy"}`} />
                        {isAvailable ? "Available" : "Busy"}
                    </div>
                </div>

                {/* IMAGE */}
                <div className={`svcMedia ${img && imgOk ? "" : "blank"}`}>
                    {img && imgOk ? (
                        <img
                            src={img}
                            alt={title}
                            className="svcImg"
                            onError={() => setImgOk(false)}
                        />
                    ) : (
                        <div className="svcBlank"></div>
                    )}

                    {/* RATING */}
                    <div className="svcRating">
                        <span className="svcStar">★</span>
                        <span className="svcRatingNum">{Number(rating || 0).toFixed(1)}</span>
                    </div>
                </div>

                {/* BODY */}
                <div className="svcBody">
                    <div className="svcTitle">{title}</div>

                    {tags?.length > 0 && (
                        <div className="svcTags">
                            {tags.slice(0, 4).map((t) => (
                                <span key={t} className="svcTag">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="svcDesc">
                        <p>{desc}</p>
                    </div>

                    <div className="svcCate">
                        <p>{cate}</p>
                    </div>

                    <div className="svcCity">
                        <p>{city}</p>
                    </div>

                    <div className="svcBottom">
                        {/* <div>
                            <div className="svcFrom">
                                Packages from:
                                <div className="svcNote">🎵 Custom playlists available</div>
                            </div>
                        </div> */}

                        <div className="svcPrice">₪{Number(price || 0).toLocaleString()}</div>
                    </div>

                    {/* BOOK NOW BUTTON */}
                    <button
                        type="button"
                        className="svcBookBtn"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent triggering card click
                            onClick?.(); // or call your booking function
                        }}
                        disabled={!isAvailable} // optional: disable when busy
                    >
                        {isAvailable ? "Book Now" : "Busy"}
                    </button>
                </div>
            </div>
        </section>
    );
}