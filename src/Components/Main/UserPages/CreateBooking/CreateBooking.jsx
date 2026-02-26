import React, { useContext, useMemo, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { AuthContext } from "../../../../context/Context";

import Steps from "./Steps";
import EventInfoStep from "./EventInfoStep";

import DjSelectStep from "../../../../Forms/DjSelectStep";
import DecorationStep from "../../../../Forms/DecorationStep";
import VenueStep from "../../../../Forms/VenueStep";
import PackageCard from "../../../../Cards/PackageCard";

import "../css/CreateBooking.css";

export default function CreateBooking() {
    const { AuthUser } = useContext(AuthContext);

    const role = String(AuthUser?.role || "").toLowerCase();
    const isRegular = role === "regular" || role === "user";

    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        // step 1
        eventType: "",
        eventDate: "", // yyyy-mm-dd
        startTime: "", // hh:mm
        durationHours: 4,
        numberOfGuests: 50,
        notes: "",

        // step 2 DJ (single)
        djId: "",
        djName: "",
        djEmail: "",
        djPricePerHour: 0,
        djLocation: "",

        // step 3 Decorations (MULTI)
        decorationIds: [],               // ["id1","id2"]
        decorations: [],                 // [{id,name,price,image,...}]
        decorationsTotal: 0,             // sum of prices

        // step 4 Venue (single)
        venueId: "",
        venueName: "",
        venueLocation: "",
        venueCapacity: 0,
        venueAmenities: [],
        venuePricePerHour: 0,
    });

    const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

    const venueCost = useMemo(() => {
        return Number(form.venuePricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.venuePricePerHour, form.durationHours]);

    const djCost = useMemo(() => {
        return Number(form.djPricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.djPricePerHour, form.durationHours]);

    const decorCost = useMemo(() => {
        return Number(form.decorationsTotal || 0);
    }, [form.decorationsTotal]);

    const total = useMemo(() => venueCost + djCost + decorCost, [venueCost, djCost, decorCost]);

    function next() {
        setError("");
        setSuccess("");

        if (step === 1) {
            if (!form.eventType) return setError("Choose event type.");
            if (!form.eventDate) return setError("Choose event date.");
            if (!form.startTime) return setError("Choose start time.");
        }

        if (step === 2) {
            if (!form.djId) return setError("Choose a DJ.");
        }

        if (step === 3) {
            if (!form.decorationIds.length) return setError("Choose at least 1 decoration.");
        }

        if (step === 4) {
            if (!form.venueId) return setError("Choose a venue.");
        }

        setStep((s) => Math.min(s + 1, 5));
    }

    function back() {
        setError("");
        setSuccess("");
        setStep((s) => Math.max(s - 1, 1));
    }

    function editServices() {
        setStep(2);
    }

    function removeService(type, id) {
        setError("");
        setSuccess("");

        if (type === "dj") {
            update({
                djId: "",
                djName: "",
                djEmail: "",
                djPricePerHour: 0,
                djLocation: "",
            });
        }

        if (type === "venue") {
            update({
                venueId: "",
                venueName: "",
                venueLocation: "",
                venueCapacity: 0,
                venueAmenities: [],
                venuePricePerHour: 0,
            });
        }

        // remove ONE decoration by id
        if (type === "decor" && id) {
            const nextDecorations = form.decorations.filter((d) => d.id !== id);
            const nextIds = nextDecorations.map((d) => d.id);
            const nextTotal = nextDecorations.reduce((sum, d) => sum + Number(d.price || 0), 0);

            update({
                decorations: nextDecorations,
                decorationIds: nextIds,
                decorationsTotal: nextTotal,
            });
        }
    }

    async function submitBooking() {
        try {
            setError("");
            setSuccess("");

            if (!form.djId) return setError("Choose a DJ.");
            if (!form.decorationIds.length) return setError("Choose at least 1 decoration.");
            if (!form.venueId) return setError("Choose a venue.");

            const dateTimeISO = `${form.eventDate}T${form.startTime}`;
            const dateObj = new Date(dateTimeISO);
            if (Number.isNaN(dateObj.getTime())) return setError("Invalid date/time.");

            const bookingData = {
                // event
                eventType: form.eventType,
                eventDate: Timestamp.fromDate(dateObj),
                startTime: form.startTime,
                durationHours: Number(form.durationHours),
                numberOfGuests: Number(form.numberOfGuests),
                notes: form.notes,
                status: "pending",

                // user
                userId: AuthUser?.email || "unknown",
                userEmail: AuthUser?.email || "",

                // DJ (single)
                djId: form.djId,
                djEmail: form.djEmail,
                dj: {
                    id: form.djId,
                    name: form.djName,
                    email: form.djEmail,
                    pricePerHour: Number(form.djPricePerHour || 0),
                    location: form.djLocation,
                },

                // Decorations (multi)
                decorations: form.decorations.map((d) => ({
                    id: d.id,
                    name: d.name || d.title || "",
                    price: Number(d.price || 0),
                    image: d.image || d.photoURL || "",
                })),
                decorationsTotal: Number(form.decorationsTotal || 0),

                // Venue (single)
                venue: {
                    id: form.venueId,
                    name: form.venueName,
                    location: form.venueLocation,
                    capacity: Number(form.venueCapacity || 0),
                    amenities: form.venueAmenities || [],
                    pricePerHour: Number(form.venuePricePerHour || 0),
                },

                // totals
                costs: {
                    djCost,
                    venueCost,
                    decorCost,
                },
                totalPrice: total,
            };

            const docRef = await addDoc(collection(db, "BOOKINGS"), bookingData);
            setSuccess(`Booking sent ✅ ID: ${docRef.id}`);
        } catch (e) {
            setSuccess("");
            setError(e.message || "Failed to create booking");
        }
    }

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
                        selectedId={form.djId}
                        onSelect={(dj) =>
                            update({
                                djId: dj?.id || "",
                                djName: dj?.name || dj?.title || "",
                                djEmail: dj?.email || "",
                                djPricePerHour: dj?.pricePerHour || dj?.price || 0,
                                djLocation: dj?.city || dj?.location || dj?.area || dj?.address || "",
                            })
                        }
                    />
                )}

                {/* ✅ Decoration MULTI */}
                {step === 3 && (
                    <DecorationStep
                        selectedIds={form.decorationIds}
                        onChange={(selectedPkgs) => {
                            const ids = selectedPkgs.map((p) => p.id);
                            const sum = selectedPkgs.reduce((s, p) => s + Number(p.price || 0), 0);

                            update({
                                decorationIds: ids,
                                decorations: selectedPkgs,
                                decorationsTotal: sum,
                            });
                        }}
                    />
                )}

                {step === 4 && (
                    <VenueStep
                        selectedId={form.venueId}
                        onSelect={(v) =>
                            update({
                                venueId: v?.id || "",
                                venueName: v?.name || v?.title || "",
                                venueLocation: v?.location || v?.city || "",
                                venueCapacity: v?.capacity || 0,
                                venueAmenities: v?.amenities || [],
                                venuePricePerHour: v?.pricePerHour || v?.price || 0,
                            })
                        }
                    />
                )}

                {step === 5 && (
                    <PackageCard
                        form={form}
                        total={total}
                        onRemove={removeService}
                        onNotesChange={(notes) => update({ notes })}
                    />
                )}
            </div>

            {error && <p className="cb-error">{error}</p>}
            {success && <p className="cb-success">{success}</p>}

            <div className="cb-actions">
                <button className="cb-back" onClick={back} type="button" disabled={step === 1}>
                    Back
                </button>

                {step < 5 ? (
                    <button className="cb-continue" onClick={next} type="button">
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