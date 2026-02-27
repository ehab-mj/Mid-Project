import React, { useMemo } from "react";
import "./css/PackageCard.css";

export default function PackageCard({ form, total, onRemove, onNotesChange }) {
    const venueCost = useMemo(() => {
        return Number(form.venuePricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.venuePricePerHour, form.durationHours]);

    const djCost = useMemo(() => {
        return Number(form.djPricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.djPricePerHour, form.durationHours]);

    const photoCost = useMemo(() => {
        return Number(form.photoPricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.photoPricePerHour, form.durationHours]);

    return (
        <div className="rp">
            <div className="rp-header">
                <div className="rp-header-title">Your Event Package</div>
                <div className="rp-header-sub">Review and finalize your selections</div>
            </div>

            <div className="rp-body">
                <div className="rp-box">
                    <div className="rp-box-title">📅 Event Details</div>

                    <div className="rp-grid">
                        <div><span>Type:</span> <b>{form.eventType || "-"}</b></div>
                        <div><span>Guests:</span> <b>{form.numberOfGuests} people</b></div>
                        <div><span>Date:</span> <b>{form.eventDate || "-"}</b></div>
                        <div><span>Time:</span> <b>{form.startTime || "-"}</b></div>
                        <div><span>Duration:</span> <b>{form.durationHours} hours</b></div>
                    </div>
                </div>

                <div className="rp-section-title">Selected Services</div>

                {/* VENUE */}
                <div className="rp-service venue">
                    <div className="rp-icon">🏢</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{form.venueName || "Venue"}</div>
                        <div className="rp-service-sub">
                            ₪{form.venuePricePerHour || 0}/hr × {form.durationHours}h = ₪{venueCost}
                        </div>
                        <div className="rp-service-sub">📍 {form.venueLocation || "—"}</div>
                    </div>
                    <button className="rp-trash" type="button" onClick={() => onRemove("venue")}>🗑</button>
                </div>

                {/* DJ */}
                <div className="rp-service dj">
                    <div className="rp-icon">🎵</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{form.djName || "DJ"}</div>
                        <div className="rp-service-sub">
                            ₪{form.djPricePerHour || 0}/hr × {form.durationHours}h = ₪{djCost}
                        </div>
                        <div className="rp-service-sub">📍 {form.djLocation || "—"}</div>
                        {form.djEmail && <div className="rp-service-sub">✉ {form.djEmail}</div>}
                    </div>
                    <button className="rp-trash" type="button" onClick={() => onRemove("dj")}>🗑</button>
                </div>

                <div className="rp-service photo">
                    <div className="rp-icon">📸</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{form.photoName || "Photographer"}</div>

                        <div className="rp-service-sub">
                            ₪{form.photoPricePerHour || 0}/hr × {form.durationHours}h = ₪{photoCost}
                        </div>

                        <div className="rp-service-sub">📍 {form.photoLocation || "—"}</div>

                        {/* ✅ NEW: show email if exists */}
                        {form.photoEmail && <div className="rp-service-sub">✉ {form.photoEmail}</div>}
                    </div>

                    {/* ✅ NEW: allow remove photographer (CreateBooking already supports onRemove("photo")) */}
                    <button className="rp-trash" type="button" onClick={() => onRemove("photo")}>
                        🗑
                    </button>
                </div>

                {/* DECORATIONS (MULTI) */}
                <div className="rp-section-title" style={{ marginTop: 16 }}>Decorations</div>

                {(form.decorations || []).length === 0 ? (
                    <p style={{ color: "var(--muted)", fontWeight: 800 }}>No decorations selected</p>
                ) : (
                    (form.decorations || []).map((d) => (
                        <div className="rp-service decor" key={d.id}>
                            <div className="rp-icon">✨</div>
                            <div className="rp-service-body">
                                <div className="rp-service-title">{d.name || d.title || "Decoration"}</div>
                                <div className="rp-service-sub">₪{Number(d.price || 0)}</div>
                            </div>
                            <button
                                className="rp-trash"
                                type="button"
                                onClick={() => onRemove("decor", d.id)}
                            >
                                🗑
                            </button>
                        </div>
                    ))
                )}

                {(form.decorations || []).length > 0 && (
                    <div className="rp-total" style={{ marginTop: 10 }}>
                        <div>
                            <div className="rp-total-title">Decorations Total:</div>
                            <div className="rp-total-sub">Sum of selected decoration packages</div>
                        </div>
                        <div className="rp-total-price">₪{Number(form.decorationsTotal || 0)}</div>
                    </div>
                )}

                <div className="rp-section-title">Additional Notes (Optional)</div>
                <textarea
                    className="rp-notes"
                    value={form.notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Any special requests or information..."
                />

                <div className="rp-total">
                    <div>
                        <div className="rp-total-title">Total Package Cost:</div>
                        <div className="rp-total-sub">Final price subject to service provider confirmation</div>
                    </div>
                    <div className="rp-total-price">₪{Number(total || 0)}</div>
                </div>
            </div>
        </div>
    );
}