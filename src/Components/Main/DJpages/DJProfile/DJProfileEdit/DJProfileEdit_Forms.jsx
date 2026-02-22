import React from 'react'
import DJProfileEdit_Tags from './DJProfileEdit_Tags'
import DJProfileEdit_Photo from './DJProfileEdit_Photo'
import DJProfileEdit_Portfolio from './DJProfileEdit_Portfolio'
import '../../css/DJProfileEdit_Forms.css'
export default function DJProfileEdit_Forms({ setField, handleSave, form, setPhotoFile }) {
    return (
        <div>
            <form className="djedit-card" onSubmit={handleSave}>
                <div className="djedit-grid">
                    <label>
                        Name
                        <input value={form.name} onChange={(e) => setField("name", e.target.value)} />
                    </label>

                    <label>
                        Phone
                        <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                    </label>

                    <label>
                        Location
                        <input value={form.location} onChange={(e) => setField("location", e.target.value)} />
                    </label>

                    <label>
                        Price / hour
                        <input
                            type="number"
                            value={form.pricePerHour}
                            onChange={(e) => setField("pricePerHour", e.target.value)}
                        />
                    </label>

                    <DJProfileEdit_Tags
                        form={form}
                    />

                    <DJProfileEdit_Photo
                        form={form}
                        setPhotoFile={setPhotoFile}
                    />

                    <DJProfileEdit_Portfolio
                        form={form}
                    />
                </div>

                <button className="djedit-save" type="submit">Save Changes</button>
            </form>
        </div>
    )
}
