import React from 'react'
import ProfilePage from '../../Pages/UserProfilePage'

export default function Header() {
    return (
        <div>
            <NavBar />
            <Login />
            <ProfilePage />
            <Search />
        </div>
    )
}
