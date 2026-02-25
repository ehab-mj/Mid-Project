import React, { useMemo, useState } from "react";
import ServicesCard from "../../../../Cards/ServicesCard.jsx"
import ServiceModalPackage from "../../../../Forms/ServiceModalPackage.jsx";

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
        <section className="scontent">
            {error && <p className="serr">{error}</p>}

            <div className="cardsgrid">
                {(items || []).map((item) => (
                    <ServicesCard
                        key={item.id}
                        item={item}
                        category={selectedCategory}
                        onClick={() => setSelected(item)}
                    />
                ))}
            </div>

            {selected && (
                <ServiceModalPackage
                    item={selected}
                    category={selectedCategory}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    );
}