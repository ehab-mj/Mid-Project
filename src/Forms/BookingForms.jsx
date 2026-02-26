import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { AuthContext } from "../context/Context";
import PackageCardSingle from "../Cards/PackageCardSingle";

export default function BookingForms() {
    const { serviceId } = useParams();
    const { AuthUser } = useContext(AuthContext);

    const [service, setService] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // booking form fields (same style)
    const [form, setForm] = useState({
        eventType: "",
        eventDate: "",      // yyyy-mm-dd
        startTime: "",      // hh:mm
        durationHours: 4,
        numberOfGuests: 50,
        notes: "",
    });

    const update = (patch) => setForm((p) => ({ ...p, ...patch }));

    useEffect(() => {
        async function fetchService() {
            try {
                setError("");
                const snap = await getDoc(doc(db, "Collection", serviceId));
                if (!snap.exists()) {
                    setError("Service not found.");
                    return;
                }
                setService({ id: snap.id, ...snap.data() });
            } catch (e) {
                console.error(e);
                setError(e?.message || "Failed to load service.");
            }
        }
        fetchService();
    }, [serviceId]);

    const servicePrice = useMemo(() => {
        if (!service) return 0;
        return (
            service.price ??
            service.totalPrice ??
            service.pricePerHour ??
            service.packagePrice ??
            service.pricePerPerson ??
            0
        );
    }, [service]);

    const total = useMemo(() => Number(servicePrice || 0), [servicePrice]);

    const stripUndefinedDeep = (value) => {
        if (Array.isArray(value)) return value.map(stripUndefinedDeep);
        if (value && typeof value === "object") {
            const out = {};
            for (const [k, v] of Object.entries(value)) {
                if (v === undefined) continue;
                out[k] = stripUndefinedDeep(v);
            }
            return out;
        }
        return value;
    };

    async function submitBooking() {
        try {
            setError("");
            setSuccess("");

            if (!AuthUser?.email) return setError("Please login first.");
            if (!service) return setError("Service missing.");

            if (!form.eventType) return setError("Choose event type.");
            if (!form.eventDate) return setError("Choose event date.");
            if (!form.startTime) return setError("Choose start time.");

            const dateTimeISO = `${form.eventDate}T${form.startTime}`;
            const dateObj = new Date(dateTimeISO);
            if (Number.isNaN(dateObj.getTime())) return setError("Invalid date/time.");

            // ✅ host id (you said: "sent it to the card id")
            const hostId = service.id;

            const bookingData = stripUndefinedDeep({
                // event info
                eventType: form.eventType || "",
                eventDate: Timestamp.fromDate(dateObj),
                durationHours: Number(form.durationHours || 0),
                numberOfGuests: Number(form.numberOfGuests || 0),
                notes: form.notes || "",

                // ✅ chosen service
                service: {
                    id: service.id,
                    title: service.title || service.name || "Service",
                    category: service.category || "",
                    price: Number(servicePrice || 0),
                },

                totalPrice: Number(total || 0),

                // status
                status: "pending",

                // ✅ routing to provider/host
                hostId: hostId,

                // user
                userId: AuthUser?.email || "",
                userEmail: AuthUser?.email || "",

                createdAt: Timestamp.now(),
            });

            const docRef = await addDoc(collection(db, "BOOKINGS"), bookingData);
            setSuccess(`Booking sent! ID: ${docRef.id}`);
        } catch (e) {
            console.error(e);
            setSuccess("");
            setError(e?.message || "Failed to create booking");
        }
    }

    if (!AuthUser) {
        return (
            <div style={{ padding: 20 }}>
                <h2>Please login first.</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <PackageCardSingle
                form={form}
                update={update}
                service={service}
                total={total}
                onNotesChange={(notes) => update({ notes })}
                onSubmit={submitBooking}
            />
        </div>
    );
}