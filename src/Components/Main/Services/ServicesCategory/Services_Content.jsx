import React, { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import "../css/ServicesContent.css";

export default function Services_Content({ selectedCategory, items, error }) {
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
        <section className="scontentnew">
            {error && <p className="serr">{error}</p>}

            <div className="scontent-header">
                <h2 className="scontent-title">{meta.title}</h2>
                <p className="scontent-subtitle">{meta.subtitle}</p>
            </div>

            <div className="cardsgrid">
                {(items || []).map((item) => (
                    <ServiceCard
                        key={item.id}
                        item={item}
                        category={selectedCategory}
                        onClick={() => setSelected(item)}
                    />
                ))}
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