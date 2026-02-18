import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function CardsList() {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");

        const fetchBookings = async () => {
            try {
                setError("");

                console.log("Fetching from collection:", "BOOKINGS");

                const colRef = collection(db, "BOOKINGS");
                console.log("Before getDocs...");

                const snapshot = await getDocs(colRef);
                console.log("Snapshot size:", snapshot.size);

                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));

                console.log("Fetched docs:", data);
                setCards(data);
            } catch (err) {
                console.error("Firestore error:", err);
                setError(err.message || "Failed to load bookings");
            }
        };

        fetchBookings();
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h2>Bookings Cards</h2>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <p>Total: {cards.length}</p>

            {cards.map((booking) => {
                const eventDateText =
                    booking.eventDate?.toDate
                        ? booking.eventDate.toDate().toLocaleString()
                        : String(booking.eventDate || "-");

                return (
                    <div key={booking.id} style={{ border: "1px solid #444", padding: 12, marginBottom: 12 }}>
                        <h3>{booking.eventType}</h3>
                        <p><strong>Event Date:</strong> {eventDateText}</p>
                        <p><strong>Location:</strong> {booking.location}</p>
                        <p><strong>People:</strong> {booking.numberOfPeople}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Total Price:</strong> {booking.totalPrice}</p>
                        <p><strong>UserId:</strong> {booking.userId}</p>
                    </div>
                );
            })}
        </div>
    );
}
