import React from 'react'
import Pro_Card from '../Pro_Card'

export default function DJProfileEdit_Photo({ form, setPhotoFile }) {
    return (
        <div>
            <div className="djedit-full">
                <div className="djedit-row">
                    <div className="djedit-title">Profile Photo</div>
                    {form.photoURL ?
                        <img className="djedit-avatar"
                            src={form.photoURL} alt=""
                        /> :
                        <div className="djedit-avatar empty">🎧</div>}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] || null)}
                />
            </div>
        </div>
    )
}
