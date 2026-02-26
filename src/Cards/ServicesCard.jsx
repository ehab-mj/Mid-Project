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

    const eventDate = item.eventDate || item.date || item.startDate || null;
    const toJsDate = (val) => {
        if (!val) return null;

        if (typeof val.toDate === "function") return val.toDate();

        if (typeof val === "object" && typeof val.seconds === "number") {
            return new Date(val.seconds * 1000);
        }

        if (val instanceof Date) return val;

        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const dateObj = toJsDate(eventDate);

    const eventDateText = dateObj
        ? dateObj.toLocaleDateString(undefined,
            { year: "numeric", month: "short", day: "numeric" })
        : null;

    const rating = Number(item.rating ?? item.stars ?? 4.8);

    const tags = useMemo(() => {
        const arr = item.tags || item.genres || item.styles || item.categories || item.features || [];
        return Array.isArray(arr) ? arr : [];
    }, [item]);

    return (
        <section className="product-container">
            <div
                className={`svcCard ${isAvailable ? "" : "busy"}`}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onClick?.()}
            >
                <div
                    className="svcTop"
                    data-status={isAvailable ? "available" : "busy"}
                >
                    <div className="svcTopCurve" />

                    <div
                        className="svcActive"
                        data-active={isAvailable ? "true" : "false"}
                    >
                        <span className={`svcDot ${isAvailable ? "available" : "busy"}`} />
                        {isAvailable ? "Available" : "Busy"}
                    </div>
                </div>

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

                    <div className="svcRating">
                        <span className="svcStar">★</span>
                        <span className="svcRatingNum">{Number(rating || 0).toFixed(1)}</span>
                    </div>
                </div>


                <div className="svcBody">
                    <div className="svcTitle">{title}</div>

                    {eventDateText && (
                        <div className="svcEventDate">
                            {eventDateText}
                        </div>
                    )}

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
                        <div className="svcPrice">₪{Number(price || 0).toLocaleString()}</div>
                    </div>

                    <button
                        type="button"
                        className="svcBookBtn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                            // navigate(`/package/${safeItem.id}`);
                        }}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? "Book Now" : "Busy"}
                    </button>
                </div>
            </div>
        </section>
    );
}