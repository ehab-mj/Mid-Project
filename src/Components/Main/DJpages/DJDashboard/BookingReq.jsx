import React from "react";
import '../css/BookingReq.css'

export default function BookingReq({ bookingId, status, onSetStatus }) {
    if (status !== "pending") return null;

    return (
        <div className="dj-actions">
            <button className="dj-btn approve" onClick={() => onSetStatus(bookingId, "accepted")}>
                Accept
            </button>

            <button className="dj-btn decline" onClick={() => onSetStatus(bookingId, "rejected")}>
                Deny
            </button>
        </div>
    );
}