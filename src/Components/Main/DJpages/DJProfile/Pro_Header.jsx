import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import '../css/Pro_Header.css';
import DJProfileEdit from './DJProfileEdit/DJProfileEdit';
export default function Pro_Header() {
    const navigate = useNavigate()

    function handleEdit() {
        navigate("/edit-djprofile")
    }

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
                    <button
                        className="djprofile-btn solid"
                        type="button"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                </div>
            </header>
        </div>
    )
}
