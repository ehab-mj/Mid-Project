import { Link } from 'react-router-dom'
import './css/UserNavProfile.css'
import profile from '../../assets/man.png'
export default function UserNavProfile({ user, logout }) {
    const profileLink = user.role === "dj" ? "/djprofile" : "/profile";


    return (
        <section className="nav-profile">
            <div className="nav-user">
                <Link
                    id="nav-user-icon"
                    to={profileLink}
                >
                    <img
                        src={profile}
                        alt="Profile"
                        className="nav-profile-img"
                    />
                </Link>

                <div className="nav-user-info">
                    <span id="nav-user-name">
                        <strong></strong> {user.name}
                    </span>
                </div>
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
