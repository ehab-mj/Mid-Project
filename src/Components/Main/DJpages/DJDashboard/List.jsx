import React from 'react'
import BookingReq from './BookingReq';

export default function List({ bookings = [], error, formatEventDate, setStatus }) {
    if (bookings.length === 0 && !error) {
        return <p className="dj-empty">No bookings in this tab.</p>;
    }
    return (
        <div>
            <section className="dj-list">

                {bookings.map((b) => {
                    const status = String(b.status || "pending").toLowerCase();
                    const badgeClass =
                        status === "accepted" ? "accepted" : status === "rejected" ? "rejected" : "pending";

                    // your booking structure: venue inside b.venue
                    const location = b?.venue?.location || b.location || "-";
                    const guests = b.numberOfGuests ?? "-";
                    const duration = b.durationHours ? `${b.durationHours}h` : "-";
                    const time = b.startTime || "-";
                    const total = b.totalPrice ?? 0;

                    const userName = b.userName || b.userEmail || "User";
                    const userEmail = b.userEmail || "-";

                    return (
                        <article className="dj-card" key={b.id}>
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

                            <div className="dj-info-grid">
                                <div className="dj-info">
                                    <div className="dj-info-label">Event Type</div>
                                    <div className="dj-info-value">{b.eventType || "Booking"}</div>
                                </div>

                                <div className="dj-info">
                                    <div className="dj-info-label">Date</div>
                                    <div className="dj-info-value">{formatEventDate(b.eventDate)}</div>
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

                            <button className="dj-details" type="button">
                                ▶ View Package Details
                            </button>

                            <div className="dj-card-bottom">
                                <div className="dj-requested">
                                    Location: <b>{location}</b>
                                </div>

                                <BookingReq bookingId={b.id} status={b.status} onSetStatus={setStatus} />
                            </div>
                        </article>
                    );
                })}
            </section>
        </div>
    )
}
