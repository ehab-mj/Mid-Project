import React, { useMemo } from "react";
import "./css/ServiceModalPackage.css";

export default function ServiceModalPackage({ item, category, onClose }) {
    const title = item.title || item.name || "Service";
    const img = item.image || item.photoURL;

    const price =
        item.price ??
        item.totalPrice ??
        item.pricePerHour ??
        item.pricePerPerson ??
        0;

    const desc = item.description || item.bio || "View full package details";
    const cate = item.category;

    const capacity = item.capacity || item.minCapacity

    const eventCompleted = item.eventsCompleted
    const experience = item.experienceYears

    const tags = useMemo(() => {
        const arr = item.tags || item.genres || item.styles || item.categories || item.features || [];
        return Array.isArray(arr) ? arr : [];
    }, [item]);

    const city = item.location || item.city || "—"


    const isAvailable = item.isAvailable
    const rating = Number(item.rating ?? item.stars ?? 4.8);
    return (
        <div className="mback" onClick={onClose}>
            <div
                className="mmodal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="mhead">
                    <div>
                        <div className="mtitle">{title}</div>
                        <div className="msub">{category.toUpperCase()}</div>
                    </div>
                    <button className="mclose" onClick={onClose} type="button">✕</button>
                </div>

                <div className="mimg">
                    {img ? <img src={img} alt="" /> :
                        <div className="mimgEmpty"></div>}
                </div>

                <div className="mbody">
                    <div className="minfo">
                        <div>
                            <span>Price:</span>
                            <b>
                                ₪{Number(price || 0).toLocaleString()}
                            </b>
                        </div>

                        <span className="svcRatingNum">{rating.toFixed(1)}</span>

                        <div>
                            <span>Location:</span>
                            <b>{city}
                            </b>
                        </div>
                        <div><span>Email:</span> <b>{item.email || "—"}</b></div>
                        <div><span>Phone:</span> <b>{item.phone || "—"}</b></div>
                    </div>

                    <div className="mdesc">
                        <b className="svcDesc">Description</b>
                        <p>{desc}</p>
                        <p>Events Count: {eventCompleted}</p>
                        <p>Experience: {experience}</p>
                        <p>Capacity {capacity}</p>
                    </div>

                    <div className="mdesc">
                        {tags.length > 0 && (
                            <div className="svcTags">
                                {tags.slice(0, 4).map((t) => (
                                    <span key={t} className="svcTag">{t}</span>
                                ))}
                            </div>
                        )}

                        <p className="svcCate">Category: {cate}</p>

                        <p className="isAvailable">{isAvailable ? "Available" : "Busy"}
                        </p>
                    </div>
                    <div className="mactions">
                        <button className="mbtn outline" type="button" onClick={onClose}>Close</button>
                        <button className="mbtn solid" type="button">Select / Contact</button>
                    </div>
                </div>
            </div>
        </div>
    );
}