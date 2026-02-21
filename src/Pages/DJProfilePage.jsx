import React, { useContext, useState } from 'react'
import DJProfile from '../Components/Main/DJpages/DJProfile/DJProfile';

export default function DJProfilePage() {
    const [error, setError] = useState("");

    return (
        <div>
            <DJProfile />
            {error && <p className="djprofile-error">{error}</p>}

        </div>
    )
}
