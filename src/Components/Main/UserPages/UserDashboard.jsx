import React, { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";


import "./css/UserDashboard.css";
import { db } from "../../../firebase/config";
import { AuthContext } from "../../../context/Context";

export default function UserDashboard() {
    const { AuthUser } = useContext(AuthContext);

    if (!AuthUser) return <Navigate to="/" replace />;

    const role = String(AuthUser.role || "").toLowerCase();
    const isRegular = role === "regular" || role === "user";
    if (!isRegular) return <Navigate to="/" replace />;

    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // all | pending | accepted | rejected
    const [error, setError] = useState("");

    useEffect(() => {
        if (!AuthUser?.email) return;

        setError("");

        const q = query(
            collection(db, "BOOKINGS"),
            where("userId", "==", AuthUser.email)
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setBookings(data);
            },
            (err) => setError(err.message || "Failed to load bookings")
        );

        return () => unsub();
    }, [AuthUser?.email]);

    const stats = useMemo(() => {
        const total = bookings.length;
        const pending = bookings.filter((b) => (b.status || "pending") === "pending").length;
        const confirmed = bookings.filter((b) => (b.status || "") === "accepted").length;
        const totalSpent = bookings
            .filter((b) => (b.status || "") === "accepted")
            .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

        return { total, pending, confirmed, totalSpent };
    }, [bookings]);


    const counts = useMemo(() => {
        const all = bookings.length;
        const pending = bookings.filter((b) => (b.status || "pending") === "pending").length;
        const approved = bookings.filter((b) => (b.status || "") === "accepted").length;
        const declined = bookings.filter((b) => (b.status || "") === "rejected").length;
        return { all, pending, approved, declined };
    }, [bookings]);

    const filtered = useMemo(() => {
        if (activeTab === "pending") return bookings.filter((b) => (b.status || "pending") === "pending");
        if (activeTab === "accepted") return bookings.filter((b) => (b.status || "") === "accepted");
        if (activeTab === "rejected") return bookings.filter((b) => (b.status || "") === "rejected");
        return bookings;
    }, [bookings, activeTab]);

    return (
        <div className="ud-page">
            <div className="ud-header">
                <h1 className="ud-title">My Event Bookings</h1>
                <p className="ud-sub">View and manage all your event booking packages</p>
            </div>

            {error && <p className="ud-error">{error}</p>}

            {/* Stats */}
            <div className="ud-stats">
                <div className="ud-stat">
                    <div>
                        <div className="ud-stat-label">Total Bookings</div>
                        <div className="ud-stat-value">{stats.total}</div>
                    </div>
                    <div className="ud-stat-icon">▦</div>
                </div>

                <div className="ud-stat">
                    <div>
                        <div className="ud-stat-label">Pending</div>
                        <div className="ud-stat-value">{stats.pending}</div>
                    </div>
                    <div className="ud-stat-icon warn">!</div>
                </div>

                <div className="ud-stat">
                    <div>
                        <div className="ud-stat-label">Confirmed</div>
                        <div className="ud-stat-value">{stats.confirmed}</div>
                    </div>
                    <div className="ud-stat-icon ok">✓</div>
                </div>

                <div className="ud-stat">
                    <div>
                        <div className="ud-stat-label">Total Spent</div>
                        <div className="ud-stat-value">${stats.totalSpent}</div>
                    </div>
                    <div className="ud-stat-icon money">$</div>
                </div>
            </div>

            {/* Purple Banner */}
            <div className="ud-banner">
                <div>
                    <h3>Ready to Plan Another Event?</h3>
                    <p>Create a new booking package with our comprehensive services</p>
                </div>

                <Link className="ud-banner-btn" to="/new-booking">
                    + New Booking
                </Link>
            </div>

            {/* Tabs */}
            <div className="ud-tabs">
                <button
                    className={`ud-tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                    type="button"
                >
                    All ({counts.all})
                </button>

                <button
                    className={`ud-tab ${activeTab === "pending" ? "active" : ""}`}
                    onClick={() => setActiveTab("pending")}
                    type="button"
                >
                    Pending ({counts.pending})
                </button>

                <button
                    className={`ud-tab ${activeTab === "accepted" ? "active" : ""}`}
                    onClick={() => setActiveTab("accepted")}
                    type="button"
                >
                    Approved ({counts.approved})
                </button>

                <button
                    className={`ud-tab ${activeTab === "rejected" ? "active" : ""}`}
                    onClick={() => setActiveTab("rejected")}
                    type="button"
                >
                    Declined ({counts.declined})
                </button>
            </div>

            {/* List / Empty */}
            <div className="ud-list">
                {filtered.length === 0 ? (
                    <div className="ud-empty">
                        <div className="ud-empty-icon">▦</div>
                        <div className="ud-empty-title">No bookings found</div>
                        <div className="ud-empty-sub">You haven't created any bookings yet.</div>
                        <Link className="ud-empty-btn" to="/new-booking">
                            + Create Your First Booking
                        </Link>
                    </div>
                ) : (
                    filtered.map((b) => {
                        const status = String(b.status || "pending").toLowerCase();
                        const statusLabel =
                            status === "accepted" ? "Approved" :
                                status === "rejected" ? "Declined" : "Pending";

                        const dateText =
                            b.eventDate?.toDate ? b.eventDate.toDate().toLocaleString() : "";

                        return (
                            <div className="ud-card" key={b.id}>
                                <div className="ud-card-top">
                                    <div className="ud-card-title">{b.eventType || "Booking"}</div>
                                    <span className={`ud-badge ${status}`}>{statusLabel}</span>
                                </div>

                                <div className="ud-card-grid">
                                    <div><b>Date:</b> {dateText || "-"}</div>
                                    <div><b>Guests:</b> {b.numberOfGuests ?? "-"}</div>
                                    <div><b>DJ:</b> {b.djId || "-"}</div>
                                    <div><b>Total:</b> ${b.totalPrice ?? 0}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
