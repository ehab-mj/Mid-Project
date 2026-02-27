import React from "react";
import '../css/Steps.css'

export default function Steps({ current = 1 }) {
    const steps = [
        { n: 1, label: "Event Info" },
        { n: 2, label: "Music & DJ" },
        { n: 3, label: "Decoration & Theme" },
        { n: 4, label: "Photography" },
        { n: 5, label: "Venue" },
    ];

    return (
        <div className="stepper">
            {steps.map((s, idx) => {
                const active = s.n === current;
                const done = s.n < current;

                return (
                    <div className="stepper-item" key={s.n}>

                        <div
                            className={`stepper-dot ${active ? "active" : ""} ${done ? "done" : ""}`}>
                            {s.n}
                        </div>

                        <div
                            className={`stepper-label ${active ? "active" : ""}`}>{s.label}
                        </div>

                        {idx !== steps.length - 1 && <div className="stepper-line" />}
                    </div>
                );
            })}
        </div>
    );
}
