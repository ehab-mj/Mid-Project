import React from 'react';
import '../Forms/css/HomePage.css';
import ServicesList from "../Components/ServicesList"


export default function HomePage() {
    return (
        
        <>
        
            {/* HERO SECTION */}
            <div className="welcome-section">
                <h1>Your Complete Event Planning Solution</h1>
                <p>
                    Book DJs, decorations, staff, venues, and more.
                    Create your perfect event package in minutes.
                </p>
                
            </div>

            {/* SERVICES SECTION */}
            <div className="services-grid">

    <div className="service-card">
        <span className="icon pink">🎵</span>
        <h3>Music & DJs</h3>
        <p>Professional DJs with custom playlists and default packages</p>
    </div>

    <div className="service-card">
        <span className="icon red">🎉</span>
        <h3>Decoration</h3>
        <p>Floral arrangements, lighting, themes, and more</p>
    </div>

    <div className="service-card">
        <span className="icon blue">🧑‍🤝‍🧑</span>
        <h3>Staff & People</h3>
        <p>Coordinators, catering staff, musicians, and security</p>
    </div>

    <div className="service-card">
        <span className="icon green">🏛️</span>
        <h3>Venues</h3>
        <p>Indoor, outdoor, and hybrid spaces for any event</p>
    </div>

</div>


        </>
    );
}