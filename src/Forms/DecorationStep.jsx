import React, { useEffect, useState } from "react";
import './css/Decor&Venue.css'
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebase/config";

const DECORATIONS = [
    // {
    //     id: pkg.id,
    //     name: pkg.name,
    //     category: pkg.category,
    //     desc: pkg.desc,
    //     features: pkg.features,
    //     isAvailable: pkg.isAvailable,
    //     price: pkg.price,
    //     img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=60",
    //     rating: pkg.rating,
    // }, 
    {
        id: "decor_premium",
        name: "Premium Floral",
        price: 850,
        desc: "Full floral theme, lighting accents, premium tables.",
        img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=60",
    },
    {
        id: "decor_luxury",
        name: "Luxury Stage & Lights",
        price: 1400,
        desc: "Stage design, lighting setup, and luxury decoration.",
        img: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1200&q=60",
    },
];


export default function DecorationStep({ selectedId, onSelect }) {
    // const [pkgs, setPkgs] = useState([])

    // useEffect(() => {
    //     const fetchcollection = async () => {
    //         const collection = collection(db, "collection");
    //         const snapshot = await getDocs(collection);

    //         const collectionData = snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }));

    //         setpkgs(collectionData);
    //         console.log("Fetched collection:", collectionData);
    //     };

    //     fetchcollection();
    // }, []);

    return (
        <div className="sc">
            <div className="sc-head">
                <h2 className="sc-title">Select Decoration</h2>
                <p className="sc-sub">Choose a decoration package for your event</p>
            </div>

            <div className="sc-grid">

                {/* {DECORATIONS.map(pkg => (
                    <div key={pkg.id}>
                        <p><strong>Name:</strong> {pkg.name}</p>
                        <p><strong>Email:</strong> {pkg.desc}</p>
                        <p><strong>Phone:</strong> {pkg.rating}</p>
                        <p><strong>Role:</strong> {pkg.price}</p>
                        <hr />
                    </div>
                ))} */}
                {DECORATIONS.map((pkg) => {
                    const active = selectedId === pkg.id;
                    return (
                        <button
                            key={pkg.id}
                            type="button"
                            className={`sc-card ${active ? "active" : ""}`}
                            onClick={() => onSelect(pkg)}
                        >
                            <img
                                className="sc-img"
                                src={pkg.img}
                                alt={pkg.name}
                            />
                            <div className="sc-body">
                                <div className="sc-row">
                                    <div className="sc-name">{pkg.name}</div>
                                    <div className="sc-price">${pkg.price}</div>
                                </div>
                                <div className="sc-desc">{pkg.desc}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
