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
            <div
                className="mmodal mmodal--card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="mhead">
                    <div>
                        <div className="mtitle">{title}</div>
                        <div className="msub">{String(category || "").toUpperCase()}</div>
                    </div>

                    <button className="mclose" onClick={onClose} type="button" aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="mcard">
                    <div className="mcard-left">
                        {img ? (
                            <img className="mcard-img" src={img} alt={title} />
                        ) : (
                            <div className="mcard-imgEmpty" />
                        )}
                    </div>

                    <div className="mcard-right">
                        <h3 className="mcard-title">{title}</h3>
                        <p className="mcard-desc">{desc}</p>

                        <div className="mcard-info">
                            <div className="infoRow">
                                <span className="infoLabel">Price</span>
                                <span className="infoValue">₪{Number(price || 0).toLocaleString()}</span>
                            </div>

                            <div className="infoRow">
                                <span className="infoLabel">Location</span>
                                <span className="infoValue">{city}</span>
                            </div>

                            <div className="infoRow">
                                <span className="infoLabel">Rating</span>
                                <span className="infoValue">{ratingText}</span>
                            </div>

                            <div className="infoRow">
                                <span className="infoLabel">Email</span>
                                <span className="infoValue">{safeItem.email || "—"}</span>
                            </div>

                            <div className="infoRow">
                                <span className="infoLabel">Phone</span>
                                <span className="infoValue">{safeItem.phone || "—"}</span>
                            </div>
                        </div>

                        <div className="mcard-meta">
                            <p>Events Count: {eventsCompleted}</p>
                            <p>Experience: {experience}</p>
                            <p>Capacity: {capacity}</p>
                            <p className="svcCate">Category: {cate}</p>

                            <p className={`isAvailable ${isAvailable ? "available" : "busy"}`}>
                                {isAvailable ? "Available" : "Busy"}
                            </p>
                        </div>

                        {tags.length > 0 && (
                            <div className="mcard-tags">
                                {tags.slice(0, 6).map((t, i) => (
                                    <span key={`${t}-${i}`} className="chip">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mcard-actions">
                            <button className="btnGhost" type="button" onClick={onClose}>
                                Close
                            </button>

                            <button
                                className="btnPrimary"
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
        </div>
    );
}