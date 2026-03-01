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
import PhotographerStep from "../../../../Forms/PhotographerStep";

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

        photoId: "",
        photoName: "",
        photoEmail: "",
        photoPricePerHour: 0,
        photoLocation: "",

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

    const photoCost = useMemo(() => {
        return Number(form.photoPricePerHour || 0) * Number(form.durationHours || 0);
    }, [form.photoPricePerHour, form.durationHours]);

    const total = useMemo(
        () => venueCost + djCost + decorCost + photoCost,
        [venueCost, djCost, decorCost, photoCost]
    );

    function next() {
        setError("");
        setSuccess("");

        if (step === 1) {
            if (!form.eventType) return setError("Choose event type.");
            if (!form.eventDate) return setError("Choose event date.");
            if (!form.startTime) return setError("Choose start time.");
        }


        if (step === 3) {
            if (!form.decorationIds.length) return setError("Choose at least 1 decoration.");
        }

        if (step === 4) {
            if (!form.photoId) return setError("Choose a photographer.");
        }

        if (step === 5) {
            if (!form.venueId) return setError("Choose a venue.");
        }

        setStep((s) => Math.min(s + 1, 6));
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

        if (type === "photo") {
            update({
                photoId: "",
                photoName: "",
                photoEmail: "",
                photoPricePerHour: 0,
                photoLocation: "",
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

            // if (!form.djId) return setError("Choose a DJ.");
            if (!form.decorationIds.length) return setError("Choose at least 1 decoration.");

            if (!form.photoId) return setError("Choose a photographer.");

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

                photographyId: form.photoId,
                photographyEmail: form.photoEmail,
                photography: {
                    id: form.photoId,
                    name: form.photoName,
                    email: form.photoEmail,
                    pricePerHour: Number(form.photoPricePerHour || 0),
                    location: form.photoLocation,
                },

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
                    photoCost,
                },
                totalPrice: total,
            };

            const docRef = await addDoc(collection(db, "BOOKINGS"), bookingData);
            setSuccess(`Booking sent ID: ${docRef.id}`);
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
                    <PhotographerStep
                        selectedId={form.photoId}
                        onSelect={(p) =>
                            update({
                                photoId: p?.id || "",
                                photoName: p?.name || p?.title || "",
                                photoEmail: p?.email || "",
                                photoPricePerHour: p?.pricePerHour || p?.price || 0,
                                photoLocation: p?.city || p?.location || p?.area || p?.address || "",
                            })
                        }
                    />
                )}

                {step === 5 && (
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

                {step === 6 && (
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

                {step === 2 && (
                    <button
                        type="button"
                        className="cb-skip"
                        onClick={() => {
                            update({
                                djId: "",
                                djName: "",
                                djEmail: "",
                                djPricePerHour: 0,
                                djLocation: "",
                            });

                            setError("");
                            setSuccess("");
                            setStep((s) => Math.min(s + 1, 6));
                        }}
                    >
                        Skip - choose later
                    </button>
                )}

                {step < 6 ? (
                    <button className="cb-continue" onClick={next} type="button">
                        {step === 5 ? "Review Package →" : "Next →"}
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