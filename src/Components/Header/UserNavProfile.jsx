import { Link } from 'react-router-dom'
import './css/UserNavProfile.css'

export default function UserNavProfile({ user, logout }) {
    const profileLink = user.role === "dj" ? "/djprofile" : "/profile";

    return (
        <section className="nav-profile">
            <div className="nav-user">
                <Link
                    id="nav-user-icon"
                    to={profileLink}
                >
                    👤
                </Link>

                <span id="nav-user-name">
                    {user.name || user.email}
                    <span id="nav-user-role">
                        ({user.role})
                    </span>
                </span>
            </div>

            <button
                id="nav-logout"
                type="button"
                onClick={logout}
            >
                <span id="nav-logout-icon">

                </span>
                Logout
            </button>
        </section>
    )
}
