import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase/config";
import DJCardsAPI from "../../../../../Cards/DJCardsAPI";

export default function DJGrid({ onPickDj }) {
    const [djs, setDjs] = useState([]);

    useEffect(() => {
        async function load() {
            const q = query(collection(db, "Users"), where("role", "==", "dj"));
            const snap = await getDocs(q);
            setDjs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        load();
    }, []);

    return (
        <div style={{ display: "grid", gap: 12 }}>
            {djs.map((dj) => (
                <DJCardsAPI key={dj.id} dj={dj} onSelect={onPickDj} />
            ))}
        </div>
    );
}