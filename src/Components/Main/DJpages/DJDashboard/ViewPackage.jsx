import React, { useMemo, useState } from "react";
import BookingReq from "./BookingReq";
import "../css/ViewPackage.css"

export default function ViewPackage({ b, formatEventDate, setStatus }) {
    const [open, setOpen] = useState(false);

    const status = String(b.status || "pending").toLowerCase();
    const badgeClass =
        status === "accepted" ? "accepted" : status === "rejected" ? "rejected" : "pending";

    const location = b?.venue?.location || b.location || "-";
    const guests = b.numberOfGuests ?? "-";
    const duration = b.durationHours ? `${b.durationHours}h` : "-";
    const time = b.startTime || "—";
    const total = b.totalPrice ?? 0;

    const userName = b.userName || b.userEmail || "User";
    const userEmail = b.userEmail || "-";

    // details values (safe)
    const djName = b?.dj?.name || b?.djEmail || b?.djId || b?.djIdEmail || b?.djId || "—";

    const venueRate = b?.venue?.pricePerHour ?? 0;
    const venueHours = Number(b.durationHours || 0);

    JSON.stringify(b?.decoration)

    // decoration can be object or array (handle both)
    const decorations = useMemo(() => {
        if (Array.isArray(b?.decorations)) return b.decorations;
        if (b?.decoration?.name) return [b.decoration];
        return [];
    }, [b]);

    return (
        <article className="dj-card">
            {/* TOP */}
            <div className="dj-card-top">
                <div className="dj-person">
                    <div className="dj-person-name">
                        {userName} <span className={`dj-badge ${badgeClass}`}>{status}</span>
                    </div>
                    <div className="dj-person-email">{userEmail}</div>
                </div>

                <div className="dj-total">
                    <div className="dj-total-label">Total Package</div>
                    <div className="dj-total-price">${total}</div>
                </div>
            </div>

            {/* INFO GRID */}
            <div className="dj-info-grid">
                <div className="dj-info">
                    <div className="dj-info-label">Event Type</div>
                    <div className="dj-info-value">{b.eventType || "Booking"}</div>
                </div>

                <div className="dj-info">
                    <div className="dj-info-label">Date</div>
                    <div className="dj-info-value">{formatEventDate?.(b.eventDate) || "-"}</div>
                </div>

                <div className="dj-info">
                    <div className="dj-info-label">Time & Duration</div>
                    <div className="dj-info-value">
                        {time} ({duration})
                    </div>
                </div>

                <div className="dj-info">
                    <div className="dj-info-label">Guests</div>
                    <div className="dj-info-value">{guests} people</div>
                </div>
            </div>

            {/* TOGGLE BUTTON */}
            <button
                className={`dj-details ${open ? "open" : ""}`}
                type="button"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="dj-caret">{open ? "▼" : "▶"}</span>
                View Package Details
            </button>

            {/* DETAILS PANEL */}
            {open && (
                <div className="dj-details-panel">
                    <div className="dj-detail-box purple">
                        <div className="dj-detail-title">🎵 DJ & Music Service</div>
                        <div className="dj-detail-row"><span>DJ:</span> <b>{djName}</b></div>
                        <div className="dj-detail-row"><span>Package Type:</span> <b>Default</b></div>
                        <div className="dj-detail-row"><span>Package:</span> <b>{b?.djPackageName || "—"}</b></div>
                    </div>

                    <div className="dj-detail-box green">
                        <div className="dj-detail-title">🏛 Venue</div>
                        <div className="dj-detail-row"><span>Location:</span> <b>{b?.venue?.name || location}</b></div>
                        <div className="dj-detail-row">
                            <span>Rate:</span>{" "}
                            <b>${venueRate}/hour</b> × <b>{venueHours} hours</b>
                        </div>
                    </div>

                    <div className="dj-detail-box pink">
                        <div className="dj-detail-title">✨ Decorations ({decorations.length})</div>

                        {decorations.length === 0 ? (
                            <div className="dj-detail-row">—</div>
                        ) : (
                            <div className="dj-detail-split">
                                <div className="dj-detail-list">
                                    {decorations.map((d, i) => (
                                        <div key={i} className="dj-detail-item">
                                            {d.name || d.title || "Decoration"}
                                        </div>
                                    ))}
                                </div>

                                <div className="dj-detail-prices">
                                    {decorations.map((d, i) => (
                                        <div key={i} className="dj-detail-price">
                                            ${Number(d.price || 0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="dj-message">
                        <div className="dj-message-title">Message from client:</div>
                        <div className="dj-message-body">{b.notes || "—"}</div>
                    </div>
                </div>
            )}

            {/* BOTTOM */}
            <div className="dj-card-bottom">
                <div className="dj-requested">
                    Location: <b>{location}</b>
                </div>

                <BookingReq bookingId={b.id} status={b.status} onSetStatus={setStatus} />
            </div>
        </article>
    );
}