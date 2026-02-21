import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../../../context/Context';
import Pro_Header from './Pro_Header';
import Pro_Card from './Pro_Card';
import Pro_Stats from './Pro_Stats';
import Pro_Grid from './Pro_Grid';
import '../css/DJProfile.css';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../../../firebase/config';

export default function DJProfile() {
    const { AuthUser } = useContext(AuthContext);
    const [djDoc, setDjDoc] = useState(null);
    const [error, setError] = useState("");

    const role = String(AuthUser?.role || "").toLowerCase();
    if (role !== "dj") return <Navigate to="/" replace />;

    const djEmail = AuthUser.email;

    useEffect(() => {
        async function loadDJ() {
            try {
                setError("");
                if (!djEmail) return;

                const q = query(collection(db, "Users"), where("email", "==", djEmail));
                const snap = await getDocs(q);
                const doc0 = snap.docs[0];

                if (doc0)
                    setDjDoc({ id: doc0.id, ...doc0.data() });
                else
                    setDjDoc(null);

            } catch (e) {
                setError(e.message || "Failed to load DJ profile");
            }
        }
        loadDJ();
    }, [djEmail]);


    const profile = useMemo(() => {
        const name = djDoc?.name || AuthUser?.name || "DJ";
        const email = djDoc?.email || AuthUser?.email || "-";
        const phone = djDoc?.phone || "-";
        const city = djDoc?.city || djDoc?.location || "-";
        const bio = djDoc?.bio || "Add a short bio about your style and experience.";
        const genres = djDoc?.genres || ["Wedding", "House", "Pop"];
        const pricePerHour = djDoc?.pricePerHour ?? 250;
        const rating = djDoc?.rating ?? 4.8;
        const completed = djDoc?.completedBookings ?? 12;

        return { name, email, phone, city, bio, genres, pricePerHour, rating, completed };
    }, [djDoc, AuthUser]);


    return (
        <div>
            <div className="djprofile-page">
                <Pro_Header />

                {error &&
                    <p className="djprofile-error">{error}</p>}

                <Pro_Card
                    profile={profile}
                />
                <Pro_Stats
                    profile={profile}
                />
                <Pro_Grid />
            </div>
        </div>
    )
}
