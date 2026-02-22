import React from 'react'
// import '../css/Services_Tabs.css'
import '../css/ServicesAllPage.css'

export default function Services_Tabs({ items, selectedCategory, handleCategoryClick }) {
    return (
        <div>
            <div className="categories-container">
                {items.map((item) => (
                    <div
                        key={item.key}
                        onClick={() => handleCategoryClick(item)}
                        className={`category-item ${selectedCategory === item.key ? "active" : ""
                            }`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="text">{item.name}</span>
                        {item.count && <span className="count">{item.count}</span>}
                    </div>
                ))}
            </div>
        </div>
    )
}
