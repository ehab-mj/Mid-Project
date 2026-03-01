import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export default function FastBooking() {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchService() {
            try {
                const snap = await getDoc(doc(db, "Collection", serviceId));
                if (snap.exists()) {
                    setService({ id: snap.id, ...snap.data() });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [serviceId]);

    async function handleSubmit() {
        if (!service) return;

        try {
            await addDoc(collection(db, "Bookings"), {
                serviceId: service.id,
                hostId: service.hostId || service.userId || "",
                serviceTitle: service.title || service.name,
                price: service.price || 0,
                notes,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            alert("Booking submitted successfully!");
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!service) return <p>Service not found</p>;

    const price = service.price ?? service.totalPrice ?? 0;

    return (
        <div className="bback" style={{ position: "static", background: "transparent" }}>
            <div className="bmodal">
                <div className="bhead">
                    <div>
                        <div className="btitle">Your Event Package</div>
                        <div className="bsub">Review and finalize your selections</div>
                    </div>
                </div>

                <div className="bcontent">
                    <div className="bsection">
                        <div className="bsectionTitle">Selected Service</div>

                        <div className="bserviceRow">
                            <div className="bicon">🎧</div>
                            <div className="bserviceInfo">
                                <div className="bserviceName">
                                    {service.title || service.name}
                                </div>
                                <div className="bserviceMeta">
                                    {service.category}
                                </div>
                            </div>
                            <div className="bservicePrice">
                                ₪{Number(price).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="bsection">
                        <div className="bsectionTitle">Additional Notes (Optional)</div>
                        <textarea
                            className="bnotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests or information..."
                        />
                    </div>

                    <div className="btotal">
                        <div>
                            <div className="btotalLabel">Total Package Cost:</div>
                            <div className="btotalHint">
                                Final price subject to service provider confirmation
                            </div>
                        </div>
                        <div className="btotalValue">
                            ₪{Number(price).toLocaleString()}
                        </div>
                    </div>

                    <div className="bactions">
                        <button className="bbtn solid" onClick={handleSubmit}>
                            Submit Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}