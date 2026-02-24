import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Services_Tabs from '../Components/Main/Services/ServicesCategory/Services_Tabs';
import { listenByCategory } from '../Components/Main/Services/ServicesCategory/Services_Category';
import Services_Content from '../Components/Main/Services/ServicesCategory/Services_Content';

export default function ServicesPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("music");
    const [items, setItems] = useState([]);          // unified state — music OR decor OR photo ...
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Category definitions (used for tabs)
    const categories = useMemo(() => [
        { name: "DJs & Music", icon: "🎵", path: "/music", key: "music", count: 50 },
        { name: "Decorations", icon: "🪅", path: "/decorations", key: "decoration", count: 30 },
        { name: "Photographers", icon: "📸", path: "/photographers", key: "photography", count: 25 },
        { name: "Venues", icon: "🏛️", path: "/venues", key: "venue", count: 20 },
    ], []);

    // Get category from URL
    const categoryFromUrl = useMemo(() => {
        const path = location.pathname.replace(/^\//, "");
        const match = categories.find(c => c.path.replace(/^\//, "") === path);
        return match?.key || "music";
    }, [location.pathname, categories]);

    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    // ── Realtime listener for ANY category ───────────────────────
    useEffect(() => {
        if (!selectedCategory) return;

        setLoading(true);
        setError("");
        setItems([]);

        const unsubscribe = listenByCategory(
            selectedCategory,
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message || `Failed to load ${selectedCategory} items`);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [selectedCategory]);

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat.key);
        navigate(cat.path);
    };

    return (
        <div className="categories-wrapper">
            <h1 className="title">All Event Services</h1>
            <p className="subtitle">Browse our complete catalog of event services</p>

            <Services_Tabs
                items={categories}
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
            />

            <Services_Content
                selectedCategory={selectedCategory}
                items={items}
                loading={loading}
                error={error}
                categoryItems={categories}
            />
        </div>
    );
}