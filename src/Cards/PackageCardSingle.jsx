import React from "react";
import "../Cards/css/PackageCard.css";
import '../Components/Main/UserPages/css/EventInfoStep.css'
const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Anniversary", "Graduation", "Other"];

export default function PackageCardSingle({
    form,
    update,
    service,
    total,
    onNotesChange,
    onSubmit,
}) {
    const title = service?.title || service?.name || "Service";
    const price =
        service?.price ??
        service?.totalPrice ??
        service?.pricePerHour ??
        service?.packagePrice ??
        service?.pricePerPerson ??
        0;

    return (
        <div className="rp">
            <div className="rp-header">
                <div className="rp-header-title">Your Event Package</div>
                <div className="rp-header-sub">Review and finalize your selections</div>
            </div>

            <div className="rp-body">
                {/* ✅ Event Details (same style as EventInfoStep) */}
                <div className="rp-box">
                    <div className="rp-box-title">📅 Event Details</div>

                    <div className="ei">
                        {/* Event Type buttons */}
                        <div className="ei-block">
                            <label className="ei-label">Event Type *</label>

                            <div className="ei-type-grid">
                                {EVENT_TYPES.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`ei-type-btn ${form.eventType === t ? "selected" : ""}`}
                                        onClick={() => update({ eventType: t })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date + Time */}
                        <div className="ei-row">
                            <div className="ei-field">
                                <label className="ei-label">Event Date *</label>
                                <div className="ei-input-wrap">
                                    <input
                                        className="ei-input"
                                        type="date"
                                        value={form.eventDate || ""}
                                        onChange={(e) => update({ eventDate: e.target.value })}
                                    />
                                    <span className="ei-icon"></span>
                                </div>
                            </div>

                            <div className="ei-field">
                                <label className="ei-label">Start Time *</label>
                                <div className="ei-input-wrap">
                                    <input
                                        className="ei-input"
                                        type="time"
                                        value={form.startTime || ""}
                                        onChange={(e) => update({ startTime: e.target.value })}
                                    />
                                    <span className="ei-icon">🕒</span>
                                </div>
                            </div>
                        </div>

                        {/* Duration + Guests */}
                        <div className="ei-row">
                            <div className="ei-field">
                                <label className="ei-label">Duration (hours) *</label>
                                <input
                                    className="ei-input"
                                    type="number"
                                    min="1"
                                    value={form.durationHours ?? 1}
                                    onChange={(e) => update({ durationHours: e.target.value })}
                                />
                            </div>

                            <div className="ei-field">
                                <label className="ei-label">Number of Guests *</label>
                                <input
                                    className="ei-input"
                                    type="number"
                                    min="1"
                                    value={form.numberOfGuests ?? 1}
                                    onChange={(e) => update({ numberOfGuests: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected service */}
                <div className="rp-section-title">Selected Services</div>

                <div className="rp-service dj">
                    <div className="rp-icon">🎯</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{title}</div>
                        <div className="rp-service-sub">₪{Number(price || 0).toLocaleString()}</div>
                    </div>
                </div>

                {/* Notes */}
                <div className="rp-section-title">Additional Notes (Optional)</div>

                <textarea
                    className="ei-textarea"
                    rows="5"
                    value={form.notes || ""}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Any special requests or information about your event..."
                />

                {/* Total */}
                <div className="rp-total">
                    <div>
                        <div className="rp-total-title">Total Package Cost:</div>
                        <div className="rp-total-sub">Final price subject to service provider confirmation</div>
                    </div>
                    <div className="rp-total-price">₪{Number(total || 0).toLocaleString()}</div>
                </div>

                {/* Submit */}
                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                    <button className="cb-continue" type="button" onClick={onSubmit}>
                        Send Booking →
                    </button>
                </div>
            </div>
        </div>
    );
}