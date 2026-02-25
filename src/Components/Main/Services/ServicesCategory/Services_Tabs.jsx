import React from "react";
import "../css/Services_Tabs.css";

export default function Services_Tabs({ items, selectedCategory, handleCategoryClick }) {
    return (
        <div className="st-wrap">
            <div className="st-row">
                {items.map((cat) => {
                    const active = cat.key === selectedCategory;
                    return (
                        <button
                            key={cat.key}
                            type="button"
                            className={active ? "st-tab active" : "st-tab"}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            <span className="st-icon">{cat.icon}</span>
                            <span className="st-text">{cat.name}</span>
                            <span className="st-count">{cat.count}</span>
                        </button>
                    );
                })}
            </div>
            <div className="st-line" />
        </div>
    );
}