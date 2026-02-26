import React, { useMemo, useState } from "react";
import ServicesCard from "../../../../Cards/ServicesCard.jsx"
import ServiceModalPackage from "../../../../Forms/ServiceModalPackage.jsx";
import '../css/Services_Content.css'
import BookingForms from "../../../../Forms/BookingForms.jsx";
import MusicModal from "../../../../Forms/MusicModal.jsx";
export default function Services_Content({ selectedCategory, items, error }) {
    const [selected, setSelected] = useState(null);
    const [bookingItem, setBookingItem] = useState(null);

    const handleBook = (item) => {
        console.log("BOOK:", item);
    };

    // const isMusicItem =
    //     String(selected?.category || "").toLowerCase() === "music";
    const isMusicItem = String(selected?.category || "").toLowerCase() === "music";

    return (
        <section className="scontent">
            {error && <p className="serr">{error}</p>}

            <div className="cardsgrid">
                {(items || []).map((item) => (
                    <ServicesCard
                        key={item.id}
                        item={item}
                        category={selectedCategory}
                        // onClick={() => setSelected(item)}
                        onClick={() => setSelected({ ...item, __cardId: item.id })}
                        onBookClick={() => setSelected(item)}
                    />
                ))}
            </div>

            {selected && (
                isMusicItem ? (
                    <MusicModal
                        item={selected}
                        itemId={selected.__cardId}
                        onClose={() => setSelected(null)} />
                ) : (
                    <ServiceModalPackage
                        item={selected}
                        category={selectedCategory}
                        onClose={() => setSelected(null)}
                        onBook={handleBook}
                    />
                ))}
        </section>
    );
}