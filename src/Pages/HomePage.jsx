import { Link } from 'react-router-dom'
import DJGrid from '../Components/Main/DJpages/DJProfile/DJCard/DJGrid'
import ServicesList from '../Components/Main/Services/ServicesList'
import UsersList from '../test/Test'
import './css/HomePage.css'

export default function HomePage() {
    return (
        <div>
            <div className="welcome-section">
                <h1>Your Complete Event Planning Solution</h1>
                <p>
                    Book DJs, decorations, staff, venues, and more.
                    Create your perfect event package in minutes.
                </p>
            </div>

            <section className="services-grid">
                <Link to="/music" className="service-card">
                    <span className="icon pink">🎵</span>
                    <h3>Music & DJs</h3>
                    <p>Professional DJs with custom playlists and default packages</p>
                </Link>

                <Link to="/decorations" className="service-card">
                    <span className="icon red">🎉</span>
                    <h3>Decoration</h3>
                    <p>Floral arrangements, lighting, themes, and more</p>
                </Link>

                <Link to="/photographers" className="service-card">
                    <span className="icon blue">🧑‍🤝‍🧑</span>
                    <h3>Staff & People</h3>
                    <p>Coordinators, catering staff, musicians, and security</p>
                </Link>

                <Link to="/venues" className="service-card">
                    <span className="icon green">🏛️</span>
                    <h3>Venues</h3>
                    <p>Indoor, outdoor, and hybrid spaces for any event</p>
                </Link>
            </section>

            <div>Upcoming Events</div>
        </div>
    )
}
