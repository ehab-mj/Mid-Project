import { Link, useNavigate } from 'react-router-dom'
import './css/NavBar.css';
import Search from './Search';
import { useContext, useState } from 'react';
import LoginModal from '../../Forms/LoginModal';
import { AuthContext } from '../../context/Context';
import UserNavProfile from './UserNavProfile';

export default function NavBar() {
    const { logout, login, AuthUser } = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const goHome = useNavigate();

    const role = String(AuthUser?.role || "").toLowerCase();
    const isRegular = role === "regular" || role === "user";

    function handleLogout() {
        logout();
        goHome("/");
    }

    function handleLogin(newUser) {
        login(newUser)
        setOpen(false);
    }
    return (
        <>
            <nav className="nav-bar">
                <Link className="logo" to="/">DJ PULSE</Link>

                <div className='nav-menu'>
                    <Link className="home" to="/">Home</Link>
                    <Link className="services" to="/services">All Services</Link>
                </div>


                {isRegular && (
                    <Link
                        className="nav-new-booking"
                        to="/new-booking">
                        <span className="nav-new-booking-icon"></span>
                        New Booking
                    </Link>
                )}

                <Search />

                <div>
                    {AuthUser ? (
                        <UserNavProfile
                            user={AuthUser}
                            logout={handleLogout}
                        />
                    ) : (
                        <button
                            className='login'
                            onClick={() =>
                                setOpen(true)}
                        >
                            Login
                        </button>
                    )}
                </div >
            </nav>


            {open && (
                <LoginModal
                    onClose={() => setOpen(false)}
                    onLogin={handleLogin}
                />
            )}
        </>
    )
}
