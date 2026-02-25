import React from 'react'
import '../css/List.css'
import ViewPackage from './ViewPackage';

export default function List({ bookings = [], error, formatEventDate, setStatus }) {
    if (bookings.length === 0 && !error) {
        return <p className="dj-empty">No bookings in this tab.</p>;
    }
    return (
        <div>
            <section className="dj-list">
                {bookings.map((b) => (
                    <ViewPackage
                        key={b.id}
                        b={b}
                        formatEventDate={formatEventDate}
                        setStatus={setStatus}
                    />
                ))}
            </section>
        </div >
    )
}
