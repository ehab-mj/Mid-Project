import React from "react";
import "./css/PackageCardSingle.css"
// import '../Components/Main/UserPages/css/EventInfoStep.css'
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
        <div className="sng">
            <div className="sng-header">
                <div className="sng-header-title">Your Event Package</div>
                <div className="sng-header-sub">Review and finalize your selections</div>
            </div>

            <div className="sng-body">
                <div className="sng-box">
                    <div className="sng-box-title">📅 Event Details</div>

                    <div className="et">
                        <div className="et-block">
                            <label className="et-label">Event Type *</label>

                            <div className="et-type-grid">
                                {EVENT_TYPES.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`et-type-btn ${form.eventType === t ? "selected" : ""}`}
                                        onClick={() => update({ eventType: t })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="ed-row">
                            <div className="ed-field">
                                <label className="ed-label">Event Date *</label>
                                <div className="ed-input-wrap">
                                    <input
                                        className="ed-input"
                                        type="date"
                                        value={form.eventDate || ""}
                                        onChange={(e) => update({ eventDate: e.target.value })}
                                    />
                                    <span className="ed-icon"></span>
                                </div>
                            </div>

                            <div className="st-field">
                                <label className="st-label">Start Time *</label>
                                <div className="st-input-wrap">
                                    <input
                                        className="st-input"
                                        type="time"
                                        value={form.startTime || ""}
                                        onChange={(e) => update({ startTime: e.target.value })}
                                    />
                                    <span className="st-icon">🕒</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-row">
                            <div className="d-field">
                                <label className="d-label">Duration (hours) *</label>
                                <input
                                    className="d-input"
                                    type="number"
                                    min="1"
                                    value={form.durationHours ?? 1}
                                    onChange={(e) => update({ durationHours: e.target.value })}
                                />
                            </div>

                            <div className="gu-field">
                                <label className="gu-label">Number of Guests *</label>
                                <input
                                    className="gu-input"
                                    type="number"
                                    min="1"
                                    value={form.numberOfGuests ?? 1}
                                    onChange={(e) => update({ numberOfGuests: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ser-section-title">Selected Services</div>

                <div className="se-service dj">
                    <div className="se-icon">🎯</div>
                    <div className="se-service-body">
                        <div className="se-service-title">{title}</div>
                        <div className="se-service-sub">₪{Number(price || 0).toLocaleString()}</div>
                    </div>
                </div>

                <div className="note-section-title">Additional Notes (Optional)</div>

                <textarea
                    className="txt-textarea"
                    rows="5"
                    value={form.notes || ""}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Any special requests or information about your event..."
                />

                <div className="t-total">
                    <div>
                        <div className="t-total-title">Total Package Cost:</div>
                        <div className="t-total-sub">Final price subject to service provider confirmation</div>
                    </div>
                    <div className="t-total-price">₪{Number(total || 0).toLocaleString()}</div>
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                    <button className="cb-continue" type="button" onClick={onSubmit}>
                        Send Booking →
                    </button>
                </div>
            </div>
        </div>
    );
}