import React, { useContext } from 'react'
import { AuthContext } from '../context/Context'
import { Link } from 'react-router-dom'

export default function DJProfilePage() {
    const { AuthUser } = useContext(AuthContext)
    return (
        <div>
            <h3>Manage your booking requests and event packages</h3>
            <p>{`${AuthUser.role} Profile`}</p>
            <Link to="/dj-dashboard">Go to Dashboard</Link>
            
        </div>
    )
}
