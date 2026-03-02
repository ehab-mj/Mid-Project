import React, { useMemo, useState } from "react";
import ServiceModalPackage from "../../Forms/ServiceModalPackage";
import MusicModal from "../../Forms/MusicModal";

export default function ShowSearch({ items = [], onCloseOverlay }) {
    const [selected, setSelected] = useState(null);

    const closeModal = () => setSelected(null);

    const normalizeCategory = (c) => {
        const v = String(c || "").trim().toLowerCase();
        if (v === "venue" || v === "venues" || v === "hall" || v === "halls") return "venue";
        if (v === "dj" || v === "djs") return "dj";
        if (v === "music") return "music";
        if (v === "decor" || v === "decoration" || v === "decorations") return "decor";
        if (v === "photo" || v === "photography" || v === "photographer" || v === "photographers")
            return "photography";
        return "unknown";
    };

    const getItemId = (item) =>
        item?.id ?? item?.docId ?? item?.serviceId ?? item?._id ?? item?.uid ?? null;

    const openModal = (item) => {
        const id = getItemId(item);
        setSelected({
            ...item,
            id,
            __cardId: id,
            __normCat: normalizeCategory(item?.category),
        });
    };

    const isMusicItem = useMemo(() => selected?.__normCat === "music", [selected]);

    return (
        <>
            <div className="search-grid">
                {items.map((item) => {
                    const img =
                        item.image ||
                        item.imageUrl ||
                        item.photoURL ||
                        "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";

                    const price =
                        typeof item.pricePerHour === "number"
                            ? item.pricePerHour
                            : typeof item.price === "number"
                                ? item.price
                                : typeof item.packagePrice === "number"
                                    ? item.packagePrice
                                    : null;

                    const title = item.name || item.title || "Service";
                    const id = getItemId(item) || item.id;

                    return (
                        <button
                            key={id}
                            type="button"
                            className="search-card"
                            onClick={() => openModal(item)}
                        >
                            <div className="search-media">
                                <img className="search-img" src={img} alt={title} />
                                {typeof item.rating === "number" && (
                                    <span className="search-rating">⭐ {item.rating.toFixed(1)}</span>
                                )}
                            </div>

                            <div className="search-body">
                                <div className="search-title">{title}</div>

                                {!!(item.features || []).length && (
                                    <div className="search-tags">
                                        {(item.features || []).slice(0, 4).map((t, i) => (
                                            <span className="search-tag" key={i}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {item.description && <div className="search-desc">{item.description}</div>}

                                <div className="search-footer">
                                    <div className="search-cat">{item.category}</div>
                                    {price !== null && (
                                        <div className="search-price">₪{Number(price).toLocaleString()}</div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selected ? (
                isMusicItem ? (
                    <MusicModal item={selected} itemId={selected.__cardId} onClose={closeModal} />
                ) : (
                    <ServiceModalPackage
                        item={selected}
                        category={selected.__normCat}
                        onClose={closeModal}
                        onBooked={() => {
                            onCloseOverlay?.();
                        }}
                    />
                )
            ) : null}
        </>
    );
}