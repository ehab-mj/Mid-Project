import React, { useMemo, useState } from "react";
import "../css/Services_Content.css";
import ServicesCard from "../../../../Cards/ServicesCard";

export default function Services_Content({ selectedCategory, items, error }) {
    console.log("SERVICES_CONTENT items:", items?.length, "category:", selectedCategory);
    const [selected, setSelected] = useState(null);

    const meta = useMemo(() => {
        if (selectedCategory === "music") {
            return {
                title: "Professional DJs",
                subtitle: "Choose from custom playlists or pre-designed packages",
            };
        }
        if (selectedCategory === "decoration") {
            return { title: "Decorations", subtitle: "Pick themes, flowers, and styling" };
        }
        if (selectedCategory === "photography") {
            return { title: "Photographers", subtitle: "Capture your event with pros" };
        }
        if (selectedCategory === "venue") {
            return { title: "Venues", subtitle: "Find the perfect place for your event" };
        }
        return { title: "Services", subtitle: "" };
    }, [selectedCategory]);

    return (
        <section className="scontent">
            {error && <p className="serr">{error}</p>}

            <p style={{ color: "red" }}>DEBUG items: {items?.length || 0}</p>

            <div className="scontent-header">
                <h2 className="scontent-title">{meta.title}</h2>
                <p className="scontent-subtitle">{meta.subtitle}</p>
            </div>

            <div style={{ padding: 30, border: "6px solid red", fontSize: 24 }}>
                ✅ THIS IS Services_Content.jsx YOU EDITED
            </div>

            {selected && (
                <ServiceModal
                    item={selected}
                    category={selectedCategory}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    );
}