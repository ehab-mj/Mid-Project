import { Link } from 'react-router-dom'
import './css/NavBar.css';

export default function NavBar() {
    return (
        <div className="nav-bar">
            <Link className="logo" to="/">Logo</Link>

            <div>
                <Link className="home" to="/">Home</Link>
                <Link className="services" to="/services">All Services</Link>
            </div>

            <Link className="login" to="/login">Login</Link>
        </div>
    )
}
