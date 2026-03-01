import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Footer.css";
import { AuthContext } from "../../context/Context";

export default function Footer() {
    const { logout, login, AuthUser } = useContext(AuthContext)
    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const role = String(AuthUser?.role || "").toLowerCase();
    const isRegular = role === "regular" || role === "user";

    return (
        <footer className="ft">
            <div className="ft-inner">

                <div className="ft-actions">
                    <button type="button" className="ft-top" onClick={handleBackToTop}>
                        ↑ Back to top
                    </button>


                    {isRegular && (
                        <Link
                            className="ft-book"
                            to="/new-booking">
                            <span className="nav-new-booking-icon"></span>
                            New Booking
                        </Link>
                    )}

                    <div className="ft-spacer" />
                </div>

                <p className="ft-cats">
                    &nbsp;
                    <Link className="ft-link" to="/dj">Dj</Link>
                    <span className="ft-dot">•</span>
                    <Link className="ft-link" to="/music">Music</Link>
                    <span className="ft-dot">•</span>
                    <Link className="ft-link" to="/photographers">Photography</Link>
                    <span className="ft-dot">•</span>
                    <Link className="ft-link" to="/venues">Venues</Link>
                    <span className="ft-dot">•</span>
                    <Link className="ft-link" to="/decorations">Decorations</Link>
                </p>

                <div className="ft-copy">
                    Copyright © {new Date().getFullYear()} SoundBook. All rights reserved.
                </div>
            </div>
        </footer>
    );
}