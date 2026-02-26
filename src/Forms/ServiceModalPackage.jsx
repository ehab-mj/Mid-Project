import React, { useMemo } from "react";
import "./css/ServiceModalPackage.css";
import { useNavigate } from "react-router-dom";

export default function ServiceModalPackage({ item, category = "", onClose }) {
    const navigate = useNavigate();
    const safeItem = item ?? {};

    const title = safeItem.title || safeItem.name || "Service";
    const img = safeItem.image || safeItem.photoURL || safeItem.img || "";

    const price =
        safeItem.price ??
        safeItem.totalPrice ??
        safeItem.pricePerHour ??
        safeItem.pricePerPerson ??
        0;

    const desc = safeItem.description || safeItem.bio || "—";
    const cate = safeItem.category || "—";

    const capacity = safeItem.capacity ?? safeItem.maxGuests ?? "—";
    const eventsCompleted = safeItem.eventsCompleted ?? safeItem.eventsCount ?? "—";
    const experience = safeItem.experienceYears ?? safeItem.yearsExperience ?? "—";

    const city = safeItem.location || safeItem.city || safeItem.address || "—";
    
    const isAvailable = Boolean(safeItem.isAvailable);

    const rating = Number(safeItem.rating ?? safeItem.stars ?? 0);
    const ratingText = Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "—";

    const tags = useMemo(() => {
        const arr =
            safeItem.tags ||
            safeItem.genres ||
            safeItem.styles ||
            safeItem.categories ||
            safeItem.features ||
            [];
        return Array.isArray(arr) ? arr.filter(Boolean) : [];
    }, [safeItem]);

    return (
        <div className="mback" onClick={onClose} role="button" tabIndex={-1}>
            <div className="mmodal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="mhead">
                    <div>
                        <div className="mtitle">{title}</div>
                        <div className="msub">{String(category || "").toUpperCase()}</div>
                    </div>

                    <button className="mclose" onClick={onClose} type="button" aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="mimg">
                    {img ? <img src={img} alt={title} /> : <div className="mimgEmpty" />}
                </div>

                <div className="mbody">
                    <div className="minfo">
                        <div>
                            <span>Price:</span>
                            <b>₪{Number(price || 0).toLocaleString()}</b>
                        </div>

                        <div>
                            <span>Rating:</span>
                            <b>{ratingText}</b>
                        </div>

                        <div>
                            <span>Location:</span>
                            <b>{city}</b>
                        </div>

                        <div>
                            <span>Email:</span>
                            <b>{safeItem.email || "—"}</b>
                        </div>

                        <div>
                            <span>Phone:</span>
                            <b>{safeItem.phone || "—"}</b>
                        </div>
                    </div>

                    <div className="mdesc">
                        <b className="svcDesc">Description</b>
                        <p>{desc}</p>

                        <p>Events Count: {eventsCompleted}</p>
                        <p>Experience: {experience}</p>
                        <p>Capacity: {capacity}</p>
                    </div>

                    <div className="mdesc">
                        {tags.length > 0 && (
                            <div className="svcTags">
                                {tags.slice(0, 6).map((t, i) => (
                                    <span key={`${t}-${i}`} className="svcTag">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="svcCate">Category: {cate}</p>

                        <p
                            className={`isAvailable 
                        ${isAvailable ? "available" : "busy"}`}
                        >
                            {isAvailable ? "Available" : "Busy"}
                        </p>
                    </div>

                    <div className="mactions">
                        <button className="mbtn solid" type="button" onClick={onClose}>
                            Close
                        </button>

                        <button
                            className="mbtn book"
                            type="button"
                            onClick={() => {
                                onClose?.();
                                navigate(`/package/${safeItem.id}`);
                            }}
                            disabled={!isAvailable}
                            title={!isAvailable ? "This service is busy" : "Book this service"}
                        >
                            Book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}