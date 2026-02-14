import { Link } from 'react-router-dom'
import './css/NavBar.css';
import Search from './Search';
import { useContext, useState } from 'react';
import LoginModal from '../../Forms/LoginModal';
import { AuthContext } from '../../context/Context';

export default function NavBar() {
    const { user, logout } = useContext(AuthContext)
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="nav-bar">
                <Link className="logo" to="/">Logo</Link>

                <div>
                    <Link className="home" to="/">Home</Link>
                    <Link className="services" to="/services">All Services</Link>
                </div>

                <Search />

                <button
                    className='login'
                    onClick={() => setOpen(true)}
                >
                    Login
                </button>
            </nav>


            {open && (
                <LoginModal
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    )
}
