import React from 'react'
import '../css/Pro_Card.css';
import DJProfileEdit from './DJProfileEdit/DJProfileEdit';
export default function Pro_Card({ profile }) {
    return (
        <div>
            <section className="djprofile-card">
                <div className="djprofile-top">
                    <div className="djprofile-avatar">
                        {profile.photoURL ? (
                            <img src={profile.photoURL} alt="DJ Profile" />
                        ) : (
                            <span>🎧</span>
                        )}
                    </div>

                    <div className="djprofile-main">
                        <div className="djprofile-name">
                            {profile.name} <span className="djprofile-badge">DJ</span>
                        </div>
                        <div className="djprofile-sub">
                            <span>📍 {profile.city}</span>
                            <span>✉ {profile.email}</span>
                            <span>☎ {profile.phone}</span>
                        </div>

                        <div className="djprofile-tags">
                            {profile.genres.map((g) => (
                                <span className="djprofile-tag" key={g}>
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="djprofile-price">
                        <div className="djprofile-price-label">Starting at</div>
                        <div className="djprofile-price-value">${profile.pricePerHour}/hr</div>
                    </div>
                </div>

                <div className="djprofile-bio">
                    <div className="djprofile-section-title">About</div>
                    <p>{profile.bio}</p>
                </div>
            </section>
        </div>
    )
}
