import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import '../../css/DJProfileEdit.css'
import { db } from "../../../../../firebase/config";
import { uploadImage } from "../../../../../firebase/upload";
import DJProfileEdit_Forms from "./DJProfileEdit_Forms";
import { AuthContext } from "../../../../../context/Context";
import Pro_Card from "../Pro_Card";

export default function DJProfileEdit() {
    const { AuthUser } = useContext(AuthContext);

    if (!AuthUser)
        return <Navigate to="/" replace />;

    const role = String(AuthUser?.role || "").toLowerCase();

    if (role !== "dj")
        return <Navigate to="/" replace />;

    const [docId, setDocId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [portfolioFiles, setPortfolioFiles] = useState([]);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        location: "",
        pricePerHour: 250,
        photoURL: "",
        tagsText: "", // comma separated
        portfolio: [],
    });


    // Load DJ doc by email
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setErr("");

                const q = query(collection(db, "Users"),
                    where("email", "==", AuthUser.email));
                const snap = await getDocs(q);

                if (!snap.docs.length) {
                    // create doc if missing
                    const newRef = doc(collection(db, "Users"));
                    await setDoc(newRef, {
                        role: "dj",
                        email: AuthUser.email,
                        name: AuthUser.name || "",
                        phone: "",
                        location: "",
                        pricePerHour: 250,
                        photoURL: "",
                        tags: [],
                        portfolio: [],
                    });
                    setDocId(newRef.id);
                    setForm((p) => ({ ...p, name: AuthUser.name || "" }));
                    setLoading(false);
                    return;
                }

                const d = snap.docs[0];
                const data = d.data();
                setDocId(d.id);

                setForm({
                    name: data.name || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    pricePerHour: data.pricePerHour ?? 250,
                    photoURL: data.photoURL || "",
                    tagsText: (data.tags || []).join(", "),
                    portfolio: data.portfolio || [],
                });
            } catch (e) {
                setErr(e.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [AuthUser.email, AuthUser.name]);

    function setField(key, val) {
        setForm((p) => ({ ...p, [key]: val }));
    }

    async function handleSave(e) {
        e.preventDefault();
        try {
            setErr("");
            setMsg("");

            if (!docId) return setErr("Missing DJ document id.");

            let photoURL = form.photoURL;

            // upload profile photo if selected
            if (photoFile) {
                photoURL = await uploadImage(photoFile, `dj_photos/${docId}/profile_${Date.now()}`);
            }

            // upload portfolio files
            let portfolioUrls = [...(form.portfolio || [])];
            if (portfolioFiles.length) {
                const uploaded = [];
                for (const file of portfolioFiles) {
                    const url = await uploadImage(file, `dj_photos/${docId}/portfolio_${Date.now()}_${file.name}`);
                    uploaded.push(url);
                }
                portfolioUrls = [...uploaded, ...portfolioUrls]; // new first
            }

            const tags = form.tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            await updateDoc(doc(db, "Users", docId), {
                name: form.name,
                phone: form.phone,
                location: form.location,
                pricePerHour: Number(form.pricePerHour || 0),
                photoURL,
                tags,
                portfolio: portfolioUrls,
            });

            setForm((p) => ({ ...p, photoURL }));
            setPhotoFile(null);
            setPortfolioFiles([]);
            setMsg("Profile saved ✅");
        } catch (e) {
            setErr(e.message || "Failed to save");
        }
    }

    function removePortfolio(url) {
        setForm((p) => ({ ...p, portfolio: p.portfolio.filter((x) => x !== url) }));
    }

    async function savePortfolioRemove(url) {
        try {
            setErr("");
            setMsg("");
            if (!docId) return;

            const updated = form.portfolio.filter((x) => x !== url);
            await updateDoc(doc(db, "Users", docId), { portfolio: updated });
            setForm((p) => ({ ...p, portfolio: updated }));
            setMsg("Removed ✅");
        } catch (e) {
            setErr(e.message || "Failed to remove");
        }
    }

    if (loading) return <div className="djedit-page">Loading...</div>;

    return (
        <div className="djedit-page">
            <h1>Edit DJ Profile</h1>
            <p className="djedit-sub">Update your info so users can book you</p>

            {err && <p className="djedit-error">{err}</p>}
            {msg && <p className="djedit-success">{msg}</p>}

            <DJProfileEdit_Forms
                form={form}
                handleSave={handleSave}
                setField={setField}
                setPhotoFile={setPhotoFile}
            />
        </div>
    );
}