import React from "react";
import "./css/PackageCard.css";

export default function PackageCard({ form, djEmail, total, onRemove, onNotesChange }) {
    const venueCost = Number(form.venuePricePerHour || 0) * Number(form.durationHours || 0);

    return (
        <div className="rp">
            <div className="rp-header">
                <div className="rp-header-title">Your Event Package</div>
                <div className="rp-header-sub">Review and finalize your selections</div>
            </div>

            <div className="rp-body">
                {/* Event Details */}
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

                {/* Selected Services */}
                <div className="rp-section-title">Selected Services</div>

                {/* Venue */}
                <div className="rp-service venue">
                    <div className="rp-icon">🏢</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{form.venueName || "Venue"}</div>
                        <div className="rp-service-sub">
                            ${form.venuePricePerHour || 0}/hr × {form.durationHours}h = ${venueCost}
                        </div>
                    </div>
                    <button className="rp-trash" type="button" onClick={() => onRemove("venue")}>🗑</button>
                </div>

                {/* DJ */}
                <div className="rp-service dj">
                    <div className="rp-icon">🎵</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{djEmail || "DJ"}</div>
                    </div>
                    <button className="rp-trash" type="button" onClick={() => onRemove("dj")}>🗑</button>
                </div>

                {/* Decoration */}
                <div className="rp-service decor">
                    <div className="rp-icon">✨</div>
                    <div className="rp-service-body">
                        <div className="rp-service-title">{form.decorationName || "Decoration"}</div>
                        <div className="rp-service-sub">${form.decorationPrice || 0}</div>
                    </div>
                    <button className="rp-trash" type="button" onClick={() => onRemove("decor")}>🗑</button>
                </div>

                {/* Notes */}
                <div className="rp-section-title">Additional Notes (Optional)</div>
                <textarea
                    className="rp-notes"
                    value={form.notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Any special requests or information..."
                />

                {/* Total */}
                <div className="rp-total">
                    <div>
                        <div className="rp-total-title">Total Package Cost:</div>
                        <div className="rp-total-sub">Final price subject to service provider confirmation</div>
                    </div>
                    <div className="rp-total-price">${total}</div>
                </div>
            </div>
        </div>
    );
}
