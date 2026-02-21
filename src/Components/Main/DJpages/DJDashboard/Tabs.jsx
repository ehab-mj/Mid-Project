import React from 'react'
import '../css/Tabs.css'

export default function Tabs({ counts, activeTab, error, setActiveTab }) {
    return (
        <div>
            <nav className="dj-tabs">
                <button className={`dj-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")} type="button">
                    All
                </button>

                <button className={`dj-tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")} type="button">
                    Pending ({counts.pending})
                </button>

                <button className={`dj-tab ${activeTab === "accepted" ? "active" : ""}`} onClick={() => setActiveTab("accepted")} type="button">
                    Approved ({counts.approved})
                </button>

                <button className={`dj-tab ${activeTab === "rejected" ? "active" : ""}`} onClick={() => setActiveTab("rejected")} type="button">
                    Declined ({counts.declined})
                </button>
            </nav>

            {error && <p className="dj-error">{error}</p>}
        </div>
    )
}
