import React, { useContext, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config"; 
import { AuthContext } from "../context/Context"; 
import "./css/MusicModal.css";

export default function MusicModal({ item, itemId, onClose }) {
    const safeItem = item ?? {};
    const serviceId = itemId || safeItem.id || "";

    const { AuthUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const title = safeItem.title || safeItem.name || "Music Service";
    const sub = String(safeItem.category || "MUSIC").toUpperCase();

    const img =
        safeItem.image ||
        safeItem.photoURL ||
        safeItem.cover ||
        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

    // ✅ Timestamp/date helpers
    const toJsDate = (val) => {
        if (!val) return null;
        if (typeof val?.toDate === "function") return val.toDate();
        if (typeof val === "object" && typeof val.seconds === "number") return new Date(val.seconds * 1000);
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const dateObj = toJsDate(safeItem.eventDate || safeItem.date || safeItem.startDate);

    const dateText = dateObj
        ? dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "—";

    const timeText =
        safeItem.startTime ||
        safeItem.time ||
        (dateObj ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—");

    const location =
        safeItem.location ||
        safeItem.city ||
        safeItem.address ||
        safeItem.area ||
        "—";

    const price =
        safeItem.price ??
        safeItem.totalPrice ??
        safeItem.pricePerHour ??
        safeItem.packagePrice ??
        0;

    const rating = Number(safeItem.rating ?? safeItem.stars ?? 4.8).toFixed(1);
    const email = safeItem.email || "—";
    const phone = safeItem.phone || "—";

    async function submitMusicBooking() {
        try {
            setError("");
            setSuccess("");

            if (!AuthUser?.email) {
                setError("Please login first.");
                return;
            }

            if (!serviceId) {
                setError("Missing service ID.");
                return;
            }

            const eventDate = dateObj ? Timestamp.fromDate(dateObj) : null;

            setLoading(true);

            const bookingData = {
                createdAt: Timestamp.now(),
                status: "pending",

                userEmail: AuthUser.email,
                userId: AuthUser.email,

                serviceType: "music",
                serviceId: serviceId,
                serviceTitle: title,
                serviceCategory: safeItem.category || "music",
                serviceEmail: safeItem.email || "",
                servicePhone: safeItem.phone || "",
                serviceLocation: location,
                servicePrice: Number(price || 0),

                eventDate: eventDate,            
                startTime: safeItem.startTime || "", 

                serviceSnapshot: {
                    id: serviceId,
                    title: title,
                    image: safeItem.image || safeItem.photoURL || safeItem.cover || "",
                    price: Number(price || 0),
                    location: location,
                    rating: Number(rating || 0),
                },
            };

            const docRef = await addDoc(collection(db, "BOOKINGS"), bookingData);

            setSuccess(`Booking sent ✅ ID: ${docRef.id}`);
        } catch (e) {
            setSuccess("");
            setError(e.message || "Failed to send booking");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mm-back" onClick={onClose} role="button" tabIndex={-1}>
            <div className="mm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="mm-head">
                    <div className="mm-head-left">
                        <div className="mm-head-title">{title}</div>
                        <div className="mm-head-sub">{sub}</div>
                    </div>

                    <button className="mm-close" onClick={onClose} type="button" aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="mm-content">
                    <div className="mm-imgWrap">
                        <img className="mm-img" src={img} alt={title} />
                    </div>

                    <div className="mm-right">
                        <div className="mm-title2">{title}</div>

                        <div className="mm-infoBar">
                            <div className="mm-infoCol">
                                <div className="mm-infoRow">
                                    <span>Price</span>
                                    <b>₪{Number(price || 0).toLocaleString()}</b>
                                </div>
                                <div className="mm-infoRow">
                                    <span>Rating</span>
                                    <b>{rating}</b>
                                </div>
                                <div className="mm-infoRow">
                                    <span>Phone</span>
                                    <b>{phone}</b>
                                </div>
                            </div>

                            <div className="mm-infoCol">
                                <div className="mm-infoRow">
                                    <span>Location</span>
                                    <b>{location}</b>
                                </div>
                                <div className="mm-infoRow">
                                    <span>Email</span>
                                    <b>{email}</b>
                                </div>
                                <div className="mm-infoRow">
                                    <span>Status</span>
                                    <b className="mm-status">Available</b>
                                </div>
                            </div>
                        </div>

                        <div className="mm-mini">
                            <div className="mm-miniRow">
                                <span>Date</span>
                                <b>{dateText}</b>
                            </div>
                            <div className="mm-miniRow">
                                <span>Time</span>
                                <b>{timeText}</b>
                            </div>
                            <div className="mm-miniRow">
                                <span>Location</span>
                                <b>{location}</b>
                            </div>
                        </div>

                        {error && <p className="mm-msg mm-err">{error}</p>}
                        {success && <p className="mm-msg mm-ok">{success}</p>}

                        <div className="mm-actions">
                            <button className="mm-btn mm-btn-ghost" type="button" onClick={onClose} disabled={loading}>
                                Close
                            </button>

                            <button
                                className="mm-btn mm-btn-primary"
                                type="button"
                                onClick={submitMusicBooking} 
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Book"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}