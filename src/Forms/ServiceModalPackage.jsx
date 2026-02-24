import React from "react";
import "../css/ServiceModal.css";

export default function ServiceModal({ item, category, onClose }) {
    const title = item.title || item.name || "Service";
    const img = item.image || item.photoURL || item.cover || item.thumbnail;
    const price = item.price ?? item.totalPrice ?? item.pricePerHour ?? 0;

    return (
        <div className="mback" onClick={onClose}>
            <div className="mmodal" onClick={(e) => e.stopPropagation()}>
                <div className="mhead">
                    <div>
                        <div className="mtitle">{title}</div>
                        <div className="msub">{category.toUpperCase()}</div>
                    </div>
                    <button className="mclose" onClick={onClose} type="button">✕</button>
                </div>

                <div className="mimg">
                    {img ? <img src={img} alt="" /> : <div className="mimgEmpty">🎉</div>}
                </div>

                <div className="mbody">
                    <div className="minfo">
                        <div><span>Price:</span> <b>₪{Number(price || 0).toLocaleString()}</b></div>
                        <div><span>Location:</span> <b>{item.location || item.city || "—"}</b></div>
                        <div><span>Email:</span> <b>{item.email || "—"}</b></div>
                        <div><span>Phone:</span> <b>{item.phone || "—"}</b></div>
                    </div>

                    <div className="mdesc">
                        <b>Description</b>
                        <p>{item.description || item.bio || "No description yet."}</p>
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