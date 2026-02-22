import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../../../context/Context';
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from '../../../../firebase/config';
import BookingReq from './BookingReq';
import '../css/DJDashboard.css'
import Stats from './Stats';
import Tabs from './Tabs';
import List from './List';

export default function DJDashboard() {
    const { AuthUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    if (!AuthUser) return <Navigate to="/" replace />;

    const role = String(AuthUser?.role || "").toLowerCase();
    if (role !== "dj") return <Navigate to="/" replace />;

    const djEmail = AuthUser.email;
    console.log(AuthUser.email)

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                setError("");

                if (!djEmail) {
                    setBookings([]);
                    return setError("DJ email is missing in AuthUser.");
                }

                const q = query(
                    collection(db, "BOOKINGS"),
                    where("djId", "==", djEmail)
                );

                const snap = await getDocs(q);
                const data = snap.docs.map((doc) =>
                    ({ id: doc.id, ...doc.data() }));
                setBookings(data);
            } catch (err) {
                setError(err.message || "Failed to load DJ bookings");
            }
        };

        fetchMyBookings();
    }, [AuthUser]);

    async function setStatus(id, status) {
        try {
            setError("");
            await updateDoc(doc(db, "BOOKINGS", id), { status });

            setBookings((prev) => prev.map((b) =>
                (b.id === id ? { ...b, status } : b)));
        } catch (err) {
            setError(err.message || "Failed to update status");
        }
    }

    const counts = useMemo(() => {
        const all = bookings.length;
        const pending = bookings.filter((b) => (b.status || "pending") === "pending").length;
        const approved = bookings.filter((b) => b.status === "accepted").length;
        const declined = bookings.filter((b) => b.status === "rejected").length;
        return { all, pending, approved, declined };
    }, [bookings]);

    const filtered = useMemo(() => {
        if (activeTab === "pending") return bookings.filter((b) => (b.status || "pending") === "pending");
        if (activeTab === "accepted") return bookings.filter((b) => b.status === "accepted");
        if (activeTab === "rejected") return bookings.filter((b) => b.status === "rejected");
        return bookings;
    }, [bookings, activeTab]);

    const formatEventDate = (eventDate) => {
        if (!eventDate) return "-";
        if (eventDate?.toDate)
            return eventDate.toDate().toLocaleDateString();
        return String(eventDate);
    };

    return (
        <div className="dj-page">
            <Stats
                onCounts={counts}
            />

            <Tabs
                counts={counts}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                error={error}
            />

            <h2>DJ Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <List
                bookings={filtered}
                error={error}
                formatEventDate={formatEventDate}
                setStatus={setStatus}
            />
            {/* {bookings.map((b) => (
                    <div key={b.id}>
                        <h3>{b.eventType || "Booking"}</h3>
                        <p><strong>Location:</strong> {b.location}</p>
                        <p><strong>People:</strong> {b.numberOfGuests}</p>
                        <p><strong>Status:</strong> {b.status}</p>
                        <hr />

                        <BookingReq
                            bookingId={b.id}
                            status={b.status}
                            onSetStatus={setStatus}
                        />
                    </div>
                ))} */}
        </div>
    )
}
