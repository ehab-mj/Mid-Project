import React from 'react'
import '../css/Pro_Stats.css';

export default function Pro_Stats({ profile }) {
    return (
        <div>
            <section className="djprofile-stats">
                <div className="djprofile-stat">
                    <div className="djprofile-stat-label">Rating</div>
                    <div className="djprofile-stat-value">⭐ {profile.rating}</div>
                </div>
                <div className="djprofile-stat">
                    <div className="djprofile-stat-label">Completed</div>
                    <div className="djprofile-stat-value">{profile.completed}</div>
                </div>
                <div className="djprofile-stat">
                    <div className="djprofile-stat-label">Availability</div>
                    <div className="djprofile-stat-value">Open</div>
                </div>
                <div className="djprofile-stat">
                    <div className="djprofile-stat-label">Response</div>
                    <div className="djprofile-stat-value">~1h</div>
                </div>
            </section>
        </div>
    )
}
