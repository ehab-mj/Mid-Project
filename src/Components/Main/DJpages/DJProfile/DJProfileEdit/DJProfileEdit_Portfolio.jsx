import React from 'react'

export default function DJProfileEdit_Portfolio({ form }) {
    return (
        <div>
            <div className="djedit-full">
                <div className="djedit-title">Portfolio</div>
                <input
                    multiple type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setPortfolioFiles(Array.from(e.target.files || []))}
                />

                <div className="djedit-portfolio">
                    {form.portfolio.map((url) => (
                        <div className="djedit-shot" key={url}>
                            <img src={url} alt="" />

                            <button
                                type="button"
                                onClick={() =>
                                    savePortfolioRemove(url)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
