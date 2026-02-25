import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Pro_Grid.css';
export default function Pro_Grid() {
    return (
        <div>
            <section className="djprofile-grid">
                <div className="djprofile-box">
                    <div className="djprofile-section-title">Services</div>
                    <ul className="djprofile-list">
                        <li>🎵 DJ + Sound System</li>
                        <li>🎤 MC / Hosting</li>
                        <li>💡 Lighting Package</li>
                        <li>📋 Playlist customization</li>
                    </ul>
                </div>

                <div className="djprofile-box">
                    <div className="djprofile-section-title">Equipment</div>
                    <ul className="djprofile-list">
                        <li>Speakers: 2× 1500W</li>
                        <li>Controllers: Pioneer / Denon</li>
                        <li>Microphones: Wireless</li>
                        <li>Lights: LED + Moving heads</li>
                    </ul>
                </div>

                <div className="djprofile-box">
                    <div className="djprofile-section-title">Portfolio</div>
                    <div className="djprofile-portfolio">
                        <div className="djprofile-shot">Photo</div>
                        <div className="djprofile-shot">Photo</div>
                        <div className="djprofile-shot">Photo</div>
                    </div>
                    <p className="djprofile-note">You can replace these with real images later.</p>
                </div>

                <div className="djprofile-box">
                    <div className="djprofile-section-title">Quick Actions</div>
                    <div className="djprofile-actions">
                        <Link className="djprofile-mini-btn" to="/dj-dashboard">📦 View Requests</Link>
                        <Link className="djprofile-mini-btn" to="/dj-dashboard">✅ Approved</Link>
                        <Link className="djprofile-mini-btn" to="/dj-dashboard">⛔ Declined</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
