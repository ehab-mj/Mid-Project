import React, { useMemo, useState } from "react";
import ServicesCard from "../../../../Cards/ServicesCard.jsx"
import ServiceModalPackage from "../../../../Forms/ServiceModalPackage.jsx";
import '../css/Services_Content.css'
import BookingForms from "../../../../Forms/BookingForms.jsx";
export default function Services_Content({ selectedCategory, items, error }) {
    const [selected, setSelected] = useState(null);
    const [bookingItem, setBookingItem] = useState(null);

    const handleBook = (item) => {
        console.log("BOOK:", item);
    };

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
                        onBookClick={() => setSelected(item)}
                    />
                ))}
            </div>

            {selected && (
                <ServiceModalPackage
                    item={selected}
                    category={selectedCategory}
                    onClose={() => setSelected(null)}
                    onBook={handleBook}
                />
            )}
        </section>
    );
}