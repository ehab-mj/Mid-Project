import { Link, useNavigate } from 'react-router-dom'
import './css/HomePage.css'
import { useContext, useState } from 'react';
import { AuthContext } from '../context/Context';
import UserNavProfile from '../Components/Header/UserNavProfile';
import LoginModal from '../Forms/LoginModal';

export default function HomePage() {
    const navigate = useNavigate();

    const problems = [
        "Searching manually on Facebook & Instagram",
        "No platform that gathers all services",
        "Hard to coordinate between different providers",
        "No clear rating or review system",
        "No available booking calendar",
        "Hard to calculate the total cost",
    ];

    const solutions = [
        "A centralized platform that gathers all providers",
        "Easy comparison of prices and services",
        "Verified and trustworthy reviews",
        "A clear calendar available for each provider",
        "Smart online booking & communication system",
        "Personalized smart recommendations for you",
    ];

    return (
        <div>
            <div className="home-bg" />
            <div className="home-overlay" />

            <div className="welcome-section">
                {/* <h1>Your Complete Event Planning Solution</h1>
                <p>
                    Book DJs, decorations, staff, venues, and more.
                    Create your perfect event package in minutes.
                </p> */}
            </div>

            <section className="services-wrapper">
                <h2 className="services-title"></h2>

                <div className="services-grid">
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
                </div>
            </section >

            {/* PROBLEMS / SOLUTIONS */}
            <section className="ps-wrapper">
                <div className="ps-header">
                    <h2>What We Solve &amp; How SoundBook Helps</h2>
                    <p>From discovery to booking—everything in one place.</p>
                </div>

                <div className="ps-grid">
                    {/* Problems */}
                    <div className="ps-card">
                        <h3 className="ps-title ps-title--problems">The Problems We Solve</h3>
                        <ul className="ps-list">
                            {problems.map((text, i) => (
                                <li key={i} className="ps-item ps-item--problem">
                                    <span className="ps-text">{text}</span>
                                    <span className="ps-bullet ps-bullet--x">✖️</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div className="ps-card">
                        <h3 className="ps-title ps-title--solutions">Solution: SoundBook</h3>
                        <ul className="ps-list">
                            {solutions.map((text, i) => (
                                <li key={i} className="ps-item ps-item--solution">
                                    <span className="ps-text">{text}</span>
                                    <span className="ps-bullet ps-bullet--check">✔️</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <div className="home-social">
                <span>◎</span>
                <span>◉</span>
                <span>♫</span>
                <span>f</span>
                <span>▶</span>
                <span>in</span>
            </div>

            <div className="upcoming-title">Upcoming Events</div>

        </div>
    )
}
