import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Services_Tabs from '../Components/Main/Services/ServicesCategory/Services_Tabs';
import Services_Content from '../Components/Main/Services/ServicesCategory/Services_Content';
import { listenProvidersByCategory } from '../Components/Main/Services/providers';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';   // ← make sure this is correctly exported

export default function ServicesPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("music");
    const [providers, setProviders] = useState([]);     // for music, photography, venue...
    const [decorations, setDecorations] = useState([]); // only for decoration
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Category definitions
    const items = useMemo(() => [
        { name: "DJs & Music", icon: "🎵", path: "/music", key: "music", count: 50 },
        { name: "Decorations", icon: "🪅", path: "/decorations", key: "decoration", count: 30 },
        { name: "Photographers", icon: "📸", path: "/photographers", key: "photography", count: 25 },
        { name: "Venues", icon: "🏛️", path: "/venues", key: "venue", count: 20 },
    ], []);

    // Detect category from URL
    const categoryFromUrl = useMemo(() => {
        const path = location.pathname.replace(/^\//, "");
        const matched = items.find(i => i.path.replace(/^\//, "") === path);
        return matched?.key || "music";
    }, [location.pathname, items]);

    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    // ── Data fetching logic ──────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setError("");
        setProviders([]);
        setDecorations([]);

        if (selectedCategory === "decoration") {
            // Special case: load decoration packages
            async function fetchDecorations() {
                try {
                    const colRef = collection(db, "Collection");
                    const snapshot = await getDocs(colRef);
                    const allDocs = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    const decorOnly = allDocs.filter(doc => doc.category === "decoration");
                    setDecorations(decorOnly);
                } catch (err) {
                    console.error(err);
                    setError("Failed to load decoration packages");
                } finally {
                    setLoading(false);
                }
            }

            fetchDecorations();
        } else {
            // Normal providers (music, venue, photography...)
            const unsub = listenProvidersByCategory(
                selectedCategory,
                (arr) => {
                    setProviders(arr);
                    setLoading(false);
                },
                (err) => {
                    setError(err.message || "Error loading providers");
                    setLoading(false);
                }
            );

            return () => unsub();
        }
    }, [selectedCategory]);

    const handleCategoryClick = (item) => {
        setSelectedCategory(item.key);
        navigate(item.path);
    };

    return (
        <div className="categories-wrapper">
            <h1 className="title">All Event Services</h1>
            <p className="subtitle">Browse our complete catalog of event services</p>

            <Services_Tabs
                items={items}
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
            />

            <Services_Content
                // You can pass both — child decides what to render
                providers={providers}
                decorations={decorations}
                selectedCategory={selectedCategory}
                loading={loading}
                error={error}
                // Optional: pass items if you want to show category name/icon in content
                categoryItems={items}
            />
        </div>
    );
}