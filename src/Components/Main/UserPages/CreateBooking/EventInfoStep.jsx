import React from "react";
import '../css/EventInfoStep.css'

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Anniversary", "Graduation", "Other"];

export default function EventInfoStep({ form, update }) {
    return (
        <div className="ei">
            <h2 className="ei-title">Event Information</h2>

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

            <div className="ei-row">
                <div className="ei-field">
                    <label className="ei-label">Event Date *</label>
                    <div className="ei-input-wrap">
                        <input
                            className="ei-input"
                            type="date"
                            value={form.eventDate}
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
                            value={form.startTime}
                            onChange={(e) => update({ startTime: e.target.value })}
                        />
                        <span className="ei-icon">🕒</span>
                    </div>
                </div>
            </div>

            <div className="ei-row">
                <div className="ei-field">
                    <label className="ei-label">Duration (hours) *</label>
                    <input
                        className="ei-input"
                        type="number"
                        min="1"
                        value={form.durationHours}
                        onChange={(e) => update({ durationHours: e.target.value })}
                    />
                </div>

                <div className="ei-field">
                    <label className="ei-label">Number of Guests *</label>
                    <input
                        className="ei-input"
                        type="number"
                        min="1"
                        value={form.numberOfGuests}
                        onChange={(e) => update({ numberOfGuests: e.target.value })}
                    />
                </div>
            </div>

            <div className="ei-field-big">
                <label className="ei-label">Additional Notes</label>
                <textarea
                    className="ei-textarea"
                    rows="5"
                    placeholder="Any special requests or information about your event..."
                    value={form.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                />
            </div>
        </div>
    );
}
