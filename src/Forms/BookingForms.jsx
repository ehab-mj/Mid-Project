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
                setService(null);

                const snap = await getDoc(doc(db, "Collection", serviceId));
                if (snap.exists()) {
                    setService({ id: snap.id, ...snap.data() });
                    return;
                }

                const userSnap = await getDoc(doc(db, "Users", serviceId));
                if (userSnap.exists()) {
                    const u = userSnap.data() || {};

                    setService({
                        id: userSnap.id,
                        ...u,
                        category: "dj",
                        title: u.title || u.name || "DJ",
                        name: u.name || u.title || "DJ",
                        image: u.profileImage || u.image || u.photoURL || "",
                        isAvailable: typeof u.isAvailable === "boolean" ? u.isAvailable : true,
                    });
                    return;
                }

                setError("Service not found.");
            } catch (e) {
                console.error(e);
                setError(e?.message || "Failed to load service.");
            }
        }

        if (serviceId) fetchService();
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

            const hostId = service.id;

            const bookingData = stripUndefinedDeep({
                eventType: form.eventType || "",
                eventDate: Timestamp.fromDate(dateObj),
                durationHours: Number(form.durationHours || 0),
                numberOfGuests: Number(form.numberOfGuests || 0),
                notes: form.notes || "",

                service: {
                    id: service.id,
                    title: service.title || service.name || "Service",
                    category: service.category || "",
                    price: Number(servicePrice || 0),
                },

                totalPrice: Number(total || 0),
                status: "pending",
                hostId: hostId,

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