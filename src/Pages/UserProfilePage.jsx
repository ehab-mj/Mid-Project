import React, { useContext } from 'react'
import { AuthContext } from '../context/Context'
import '../Forms/css/HomePage.css'

export default function UserProfilePage() {
    const { AuthUser } = useContext(AuthContext)
    return (
        <div>
            <h1>My Event Bookings</h1>
           
        
        </div>
    )
}
