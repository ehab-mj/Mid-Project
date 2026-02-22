import React from 'react'
import '../css/Stats.css'

export default function Stats({ onCounts }) {
    return (
        <div>
            <header className="dj-header">
                <h1>Event Services Dashboard</h1>
                <p>Manage your booking requests and event packages</p>
            </header>

            <section className="dj-stats">
                <div className="dj-stat">
                    <div>
                        <div className="dj-stat-label">Total Packages</div>
                        <div className="dj-stat-value">{onCounts.all}</div>
                    </div>
                    <div className="dj-stat-icon blue">▦</div>
                </div>

                <div className="dj-stat">
                    <div>
                        <div className="dj-stat-label">Pending</div>
                        <div className="dj-stat-value">{onCounts.pending}</div>
                    </div>
                    <div className="dj-stat-icon yellow">!</div>
                </div>

                <div className="dj-stat">
                    <div>
                        <div className="dj-stat-label">Approved</div>
                        <div className="dj-stat-value">{onCounts.approved}</div>
                    </div>
                    <div className="dj-stat-icon green">✓</div>
                </div>

                <div className="dj-stat">
                    <div>
                        <div className="dj-stat-label">Declined</div>
                        <div className="dj-stat-value">{onCounts.declined}</div>
                    </div>
                    <div className="dj-stat-icon red">✕</div>
                </div>
            </section>
        </div>
    )
}
