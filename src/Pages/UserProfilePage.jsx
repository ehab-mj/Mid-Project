import React, { useContext } from 'react'
import { AuthContext } from '../context/Context'

export default function UserProfilePage() {
    const { AuthUser } = useContext(AuthContext)
    return (
        <div>
            <h1>{`${AuthUser.name} Profile`}</h1>
        </div>
    )
}
