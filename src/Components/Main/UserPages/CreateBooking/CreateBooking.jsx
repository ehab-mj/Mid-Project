import React, { useContext, useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { AuthContext } from "../../../../context/Context";
import Steps from "./Steps";
import EventInfoStep from "./EventInfoStep";
import "../css/CreateBooking.css";
import DjSelectStep from "../../../../Forms/DjSelectStep";
import DecorationStep from "../../../../Forms/DecorationStep";
import VenueStep from "../../../../Forms/VenueStep";
import PackageCard from "../../../../Cards/PackageCard";

export default function CreateBooking() {
    const { AuthUser } = useContext(AuthContext);

    const role = String(AuthUser?.role || "").toLowerCase();
    const isRegular = role === "regular" || role === "user";

    const [djs, setDjs] = useState([]);
    const [djEmail, setDjEmail] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        eventType: "",
        eventDate: "", // yyyy-mm-dd
        startTime: "", // hh:mm
        durationHours: 4,
        numberOfGuests: 50,
        notes: "",

        decorationId: "",
        decorationName: "",
        decorationPrice: 0,

        venueId: "",
        venueName: "",
        venueLocation: "",
        venueCapacity: 0,
        venueAmenities: [],
        venuePricePerHour: 0,
    });

    const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

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

    useEffect(() => {
        async function fetchDJs() {
            try {
                const q = query(collection(db, "Users"), where("role", "==", "dj"));
                const snap = await getDocs(q);
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

                setDjs(list);

                if (!djEmail && list[0]?.email) setDjEmail(list[0].email);
            } catch (e) {
                console.error(e);
            }
        }

        if (AuthUser && isRegular) fetchDJs();
    }, [AuthUser, isRegular]);

    const computedTotal = useMemo(() => {
        const venueCost = Number(form.venuePricePerHour || 0) * Number(form.durationHours || 0);
        const decorCost = Number(form.decorationPrice || 0);
        return venueCost + decorCost;
    }, [form.venuePricePerHour, form.durationHours, form.decorationPrice]);

    function nextFromStep1() {
        setError("");
        setSuccess("");

        if (step === 1) {
            if (!form.eventType) return setError("Choose event type.");
            if (!form.eventDate) return setError("Choose event date.");
            if (!form.startTime) return setError("Choose start time.");
        }

        if (step === 2) {
            if (!djEmail) return setError("Choose a DJ.");
        }

        if (step === 3) {
            if (!form.decorationId) return setError("Choose a decoration package.");
        }

        if (step === 4) {
            if (!form.venueId) return setError("Choose a venue.");
        }

        setStep((s) => Math.min(s + 1, 5));
    }

    function editServices() {
        setStep(2);
    }

    function goBack() {
        setError("");
        setSuccess("");
        setStep((s) => Math.max(s - 1, 1));
    }

    function removeService(type) {
        setError("");
        setSuccess("");

        if (type === "dj") setDjEmail("");

        if (type === "decor")
            update({
                decorationId: "",
                decorationName: "",
                decorationPrice: 0,
            });

        if (type === "venue")
            update({
                venueId: "",
                venueName: "",
                venueLocation: "",
                venueCapacity: 0,
                venueAmenities: [],
                venuePricePerHour: 0,
            });
    }

    const submitBooking = async () => {
        try {
            setError("");
            setSuccess("");

            if (!djEmail) return setError("Choose a DJ.");
            if (!form.venueId) return setError("Choose a venue.");
            if (!form.decorationId) return setError("Choose a decoration package.");

            const dateTimeISO = `${form.eventDate}T${form.startTime}`;
            const dateObj = new Date(dateTimeISO);

            if (Number.isNaN(dateObj.getTime())) {
                return setError("Invalid date/time.");
            }

            const bookingData = stripUndefinedDeep({
                eventType: form.eventType || "",
                eventDate: Timestamp.fromDate(dateObj),
                durationHours: Number(form.durationHours || 0),
                numberOfGuests: Number(form.numberOfGuests || 0),
                notes: form.notes || "",

                djId: djEmail || "",

                decoration: {
                    id: form.decorationId || "",
                    name: form.decorationName || "",
                    price: Number(form.decorationPrice || 0),
                },

                venue: {
                    id: form.venueId || "",
                    name: form.venueName || "",
                    location: form.venueLocation ?? "", 
                    capacity: Number(form.venueCapacity || 0),
                    amenities: Array.isArray(form.venueAmenities) ? form.venueAmenities : [],
                    pricePerHour: Number(form.venuePricePerHour || 0),
                },

                totalPrice: Number(computedTotal || 0),
                status: "pending",

                userId: AuthUser?.email || "",
                userEmail: AuthUser?.email || "",
                createdAt: Timestamp.now(),
            });

            const docRef = await addDoc(collection(db, "BOOKINGS"), bookingData);
            setSuccess(`Saved Event Info. Booking ID: ${docRef.id}`);
        } catch (e) {
            console.error(e);
            setSuccess("");
            setError(e?.message || "Failed to create booking");
        }
    };

    if (!AuthUser) {
        return (
            <div className="cb-page">
                <h1>Create Event Booking</h1>
                <p className="cb-sub">Please login first.</p>
            </div>
        );
    }

    if (!isRegular) {
        return (
            <div className="cb-page">
                <h1>Create Event Booking</h1>
                <p className="cb-sub">
                    Only regular users can create bookings. Your role: <b>{role || "missing"}</b>
                </p>
            </div>
        );
    }

    return (
        <div className="cb-page">
            <h1 className="cb-title">Create Event Booking</h1>
            <p className="cb-sub">Build your custom event package step by step</p>

            <div className="cb-stepper-wrap">
                <Steps current={step} />
            </div>

            <div className="cb-card">
                {step === 1 && <EventInfoStep form={form} update={update} />}

                {step === 2 && (
                    <DjSelectStep
                        djs={djs}
                        selectedDjEmail={djEmail}
                        onSelectDjEmail={setDjEmail}
                        onSkip={() => setDjEmail("")}
                    />
                )}

                {step === 3 && (
                    <DecorationStep
                        selectedId={form.decorationId}
                        onSelect={(pkg) =>
                            update({
                                decorationId: pkg?.id ?? "",
                                decorationName: pkg?.name ?? "",
                                decorationPrice: Number(pkg?.price ?? 0),
                            })
                        }
                    />
                )}

                {step === 4 && (
                    <VenueStep
                        selectedId={form.venueId}
                        onSelect={(v) =>
                            update({
                                venueId: v?.id ?? "",
                                venueName: v?.name ?? "",
                                venueLocation: v?.location ?? "", // ✅ prevent undefined
                                venueCapacity: Number(v?.capacity ?? 0),
                                venueAmenities: Array.isArray(v?.amenities) ? v.amenities : [],
                                venuePricePerHour: Number(v?.pricePerHour ?? 0),
                            })
                        }
                    />
                )}

                {step === 5 && (
                    <PackageCard
                        form={form}
                        djEmail={djEmail}
                        total={computedTotal}
                        onRemove={removeService}
                        onNotesChange={(notes) => update({ notes: notes ?? "" })}
                    />
                )}
            </div>

            {error && <p className="cb-error">{error}</p>}
            {success && <p className="cb-success">{success}</p>}

            <div className="cb-actions">
                <button className="cb-back" onClick={goBack} type="button" disabled={step === 1}>
                    Back
                </button>

                {step < 5 ? (
                    <button className="cb-continue" onClick={nextFromStep1} type="button">
                        {step === 4 ? "Review Package →" : "Next →"}
                    </button>
                ) : (
                    <>
                        <button className="cb-edit" onClick={editServices} type="button">
                            Edit Services
                        </button>

                        <button className="cb-continue" onClick={submitBooking} type="button">
                            Send Booking →
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}