import React from 'react'

export default function DJProfileEdit_Tags({ form }) {
    return (
        <div>
            <label className="djedit-full">
                Tags (comma separated)
                <input
                    placeholder="Wedding, House, Pop"
                    value={form.tagsText}
                    onChange={(e) => setField("tagsText", e.target.value)}
                />
            </label>
        </div>
    )
}
