import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Services_Tabs from '../Components/Main/Services/ServicesCategory/Services_Tabs';
import { listenByCategory } from '../Components/Main/Services/ServicesCategory/Services_Category';
import Services_Content from '../Components/Main/Services/ServicesCategory/Services_Content';
import './css/ServicesPage.css'
import { listenDjUsersByRole } from '../Components/Main/Services/ServicesCategory/providers';
export default function ServicesPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("music");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [counts, setCounts] = useState({
        music: 0,
        decoration: 0,
        photography: 0,
        venue: 0,
    });

    useEffect(() => {
        setCounts((prev) => ({
            ...prev,
            [selectedCategory]: items?.length || 0,
        }));
    }, [items, selectedCategory]);

    const categories = useMemo(() => [
        { name: "DJs & Music", icon: "🎵", path: "/music", key: "music", count: counts.music },
        { name: "Decorations", icon: "🪅", path: "/decorations", key: "decoration", count: counts.decoration },
        { name: "Photographers", icon: "📸", path: "/photographers", key: "photography", count: counts.photography },
        { name: "Venues", icon: "🏛️", path: "/venues", key: "venue", count: counts.venue },
    ], [counts]);

    const categoryFromUrl = useMemo(() => {
        const path = location.pathname.replace(/^\//, "");
        const match = categories.find(c => c.path.replace(/^\//, "") === path);
        return match?.key || "music";
    }, [location.pathname, categories]);

    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);



    useEffect(() => {
        if (!selectedCategory) return;

        setLoading(true);
        setError("");
        setItems([]);

        const keysToListen =
            selectedCategory === "music" ? ["music", "DJ"] : [selectedCategory];

        const unsubscribers = keysToListen.map((key) => {
            const subscribeFn =
                String(key).toLowerCase() === "dj"
                    ? listenDjUsersByRole
                    : (cb, errCb) => listenByCategory(key, cb, errCb);

            return subscribeFn(
                (data) => {
                    setItems((prev) => {
                        const map = new Map(prev.map((x) => [x.id, x]));
                        data.forEach((x) => map.set(x.id, x));
                        return Array.from(map.values());
                    });
                    setLoading(false);
                },
                (err) => {
                    setError(err.message || `Failed to load ${key} items`);
                    setLoading(false);
                }
            );
        });

        return () => {
            unsubscribers.forEach((u) => u && u());
        };
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