import React, { useEffect, useMemo, useState } from 'react'
import ServicesList from '../Components/Main/Services/ServicesList'
import { useLocation, useNavigate } from 'react-router-dom';
import Services_Tabs from '../Components/Main/Services/ServicesCategory/Services_Tabs';
import Services_Content from '../Components/Main/Services/ServicesCategory/Services_Content';
import { listenProvidersByCategory } from '../Components/Main/Services/providers';

export default function ServicesPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("music");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // تعريف العناصر
    const items = useMemo(() => [
        { name: "DJs & Music", icon: "🎵", path: "/music", key: "music", count: 50 },
        { name: "Decorations", icon: "🪅", path: "/decorations", key: "decoration", count: 30 },
        { name: "Photographers", icon: "📸", path: "/photographers", key: "photography", count: 25 },
        { name: "Venues", icon: "🏛️", path: "/venues", key: "venue", count: 20 },
    ], []);

    // تحديد الكاتيجوري من URL
    const categoryFromUrl = useMemo(() => {
        const path = location.pathname.replace("/", "");
        const matched = items.find((i) => i.path.replace("/", "") === path);
        return matched?.key || "music";
    }, [location.pathname, items]);

    // تحديث selectedCategory عند تغيير URL
    useEffect(() => {
        if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [categoryFromUrl]);


    // 🔥 Listen to realtime updates whenever selectedCategory changes
    useEffect(() => {
        if (!selectedCategory) return;

        setLoading(true);

        const unsub = listenProvidersByCategory(
            selectedCategory,
            (arr) => {
                setData(arr);
                setError("");
                setLoading(false);
            },
            (err) => {
                setError(err.message || "Error loading data");
                setLoading(false);
            }
        );

        return () => unsub();
    }, [selectedCategory]);


    const handleCategoryClick = (item) => {
        setSelectedCategory(item.key);
        navigate(item.path);
    };

    return (
        <div className="categories-wrapper">
            <h1 className="title">All Event Services</h1>
            <p className="subtitle">Browse our complete catalog of event services</p>

            {/* Tabs */}
            <Services_Tabs
                items={items}
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
            />

            {/* Content */}
            <Services_Content
                items={items}
                selectedCategory={selectedCategory}
                loading={loading}
                error={error}
            />
        </div>
    )
}
