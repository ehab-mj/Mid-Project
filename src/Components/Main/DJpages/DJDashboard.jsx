import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/Context';
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from '../../../firebase/config';

export default function DJDashboard() {
    const { AuthUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    // ✅ only DJ can access
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

                // ✅ show bookings assigned to this DJ
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

            // update UI instantly
            setBookings((prev) => prev.map((b) =>
                (b.id === id ? { ...b, status } : b)));
        } catch (err) {
            setError(err.message || "Failed to update status");
        }
    }

    return (
        <div>
            <h2>DJ Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Booking list</h2>
            {bookings.length === 0 && !error && <p>No bookings assigned to you yet.</p>}

            {bookings.map((b) => (
                <div key={b.id}>
                    <h3>{b.eventType || "Booking"}</h3>
                    <p><strong>Location:</strong> {b.location}</p>
                    <p><strong>People:</strong> {b.numberOfGuests}</p>
                    <p><strong>Status:</strong> {b.status}</p>
                    <hr />

                    {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setStatus(b.id, "accepted")}>Accept</button>
                            <button onClick={() => setStatus(b.id, "rejected")}>Deny</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
