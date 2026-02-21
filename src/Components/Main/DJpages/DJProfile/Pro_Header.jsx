import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Pro_Header.css';
export default function Pro_Header() {
    return (
        <div>
            <header className="djprofile-hero">
                <div>
                    <h1>DJ Profile</h1>
                    <p>Manage your public profile and service details</p>
                </div>

                <div className="djprofile-hero-actions">
                    <Link className="djprofile-btn outline" to="/dj-dashboard">
                        Go to Dashboard
                    </Link>
                    <button className="djprofile-btn solid" type="button">
                        Edit Profile
                    </button>
                </div>
            </header>
        </div>
    )
}
