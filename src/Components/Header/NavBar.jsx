import { Link } from 'react-router-dom'
import './css/NavBar.css';
import Search from './Search';
import { useContext, useState } from 'react';
import LoginModal from '../../Forms/LoginModal';
import { AuthContext } from '../../context/Context';
import UserNavProfile from './UserNavProfile';

export default function NavBar() {
    const { logout, login, AuthUser } = useContext(AuthContext)
    const [open, setOpen] = useState(false);

    function handleLogout() {
        logout();
    }

    function handleLogin(newUser) {
        login(newUser)
        setOpen(false);
    }
    return (
        <>
            <nav className="nav-bar">
                <Link className="logo" to="/">Logo</Link>

                <div>
                    <Link className="home" to="/">Home</Link>
                    <Link className="services" to="/services">All Services</Link>
                </div>

                {/* <Search /> */}

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
