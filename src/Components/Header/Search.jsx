import { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import filterIcon from "../../assets/filter.png";
import "./css/Search.css";
import ShowSearch from "./ShowSearch";

export default function Search() {
    const boxRef = useRef(null);

    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [enabled, setEnabled] = useState({
        venue: true,
        dj: true,
        music: true,
        decor: true,
    });

    const [f, setF] = useState({
        venue: { city: "", minCap: "", minExp: "", maxPrice: "", minRating: "" },
        dj: { city: "", minExp: "", maxPrice: "", minRating: "" },
        music: { city: "", minExp: "", maxPrice: "", minRating: "" }, // ✅ NEW
        decor: { city: "", minExp: "", maxPrice: "", minRating: "" },
    });

    function normalizeCategory(c) {
        const v = String(c || "").trim().toLowerCase();

        if (v === "venue" || v === "venues" || v === "hall" || v === "halls") return "venue";

        if (v === "dj" || v === "djs") return "dj";

        if (v === "music" || v === "music & djs" || v === "music and djs") return "music";

        if (v === "decor" || v === "decoration" || v === "decorations") return "decor";

        return "unknown";
    }

    useEffect(() => {
        async function fetchAll() {
            const colRef = collection(db, "Collection");
            const snap = await getDocs(colRef);
            setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        fetchAll();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setFiltersOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function closeOverlay() {
        setOverlayOpen(false);
        setFiltersOpen(false);
    }

    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        return items
            .map((x) => ({ ...x, _cat: normalizeCategory(x.category) }))
            .filter((x) => x._cat !== "unknown")
            .filter((x) => enabled[x._cat] === true)
            .filter((x) => {
                if (!q) return true;
                return (x.name || "").toLowerCase().includes(q);
            })
            .filter((x) => {
                const cat = x._cat;
                const fc = f[cat];

                const city = (x.city || x.location || "").toLowerCase();
                const exp = toNum(x.experienceYears);
                const price = toNum(x.pricePerHour ?? x.price);
                const rating = toNum(x.rating);

                if (fc.city && !city.includes(fc.city.toLowerCase())) return false;
                if (fc.minExp && (exp === null || exp < toNum(fc.minExp))) return false;
                if (fc.maxPrice && (price === null || price > toNum(fc.maxPrice))) return false;
                if (fc.minRating && (rating === null || rating < toNum(fc.minRating))) return false;

                if (cat === "venue") {
                    const cap = toNum(x.capacity);
                    if (fc.minCap && (cap === null || cap < toNum(fc.minCap))) return false;
                }

                return true;
            })
            .slice(0, 10);
    }, [items, query, enabled, f]);

    return (
        <>
            <div className="nav-search-mini" onClick={() => setOverlayOpen(true)}>
                <span className="nav-search-placeholder">Search…</span>
            </div>

            {overlayOpen && (
                <div className="search-overlay">
                    <div className="search-topbar">
                        <div className="search-box" ref={boxRef}>
                            <input
                                className="search-input"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search venue / decor / DJ / music by name…"
                            />

                            <button
                                type="button"
                                className="filter-btn"
                                onClick={() => setFiltersOpen((v) => !v)}
                                aria-label="Open filters"
                            >
                                <img src={filterIcon} alt="filter" className="filter-icon" />
                            </button>

                            <button type="button" className="close-btn" onClick={closeOverlay}>
                                ✕
                            </button>

                            {filtersOpen && (
                                <div className="filters-panel">
                                    {/* VENUE */}
                                    <div className="filter-section">
                                        <label className="filter-title">
                                            <input
                                                type="checkbox"
                                                checked={enabled.venue}
                                                onChange={(e) =>
                                                    setEnabled((p) => ({ ...p, venue: e.target.checked }))
                                                }
                                            />
                                            Venues
                                        </label>

                                        <div className="filter-grid">
                                            <input
                                                placeholder="City"
                                                value={f.venue.city}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        venue: { ...p.venue, city: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Capacity"
                                                value={f.venue.minCap}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        venue: { ...p.venue, minCap: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.venue.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        venue: { ...p.venue, minExp: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.venue.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        venue: { ...p.venue, maxPrice: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.venue.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        venue: { ...p.venue, minRating: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* DJ */}
                                    <div className="filter-section">
                                        <label className="filter-title">
                                            <input
                                                type="checkbox"
                                                checked={enabled.dj}
                                                onChange={(e) =>
                                                    setEnabled((p) => ({ ...p, dj: e.target.checked }))
                                                }
                                            />
                                            DJs
                                        </label>

                                        <div className="filter-grid">
                                            <input
                                                placeholder="City"
                                                value={f.dj.city}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, dj: { ...p.dj, city: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.dj.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, dj: { ...p.dj, minExp: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.dj.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, dj: { ...p.dj, maxPrice: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.dj.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, dj: { ...p.dj, minRating: e.target.value } }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* MUSIC */}
                                    <div className="filter-section">
                                        <label className="filter-title">
                                            <input
                                                type="checkbox"
                                                checked={enabled.music}
                                                onChange={(e) =>
                                                    setEnabled((p) => ({ ...p, music: e.target.checked }))
                                                }
                                            />
                                            Music
                                        </label>

                                        <div className="filter-grid">
                                            <input
                                                placeholder="City"
                                                value={f.music.city}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        music: { ...p.music, city: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.music.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        music: { ...p.music, minExp: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.music.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        music: { ...p.music, maxPrice: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.music.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        music: { ...p.music, minRating: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* DECOR */}
                                    <div className="filter-section">
                                        <label className="filter-title">
                                            <input
                                                type="checkbox"
                                                checked={enabled.decor}
                                                onChange={(e) =>
                                                    setEnabled((p) => ({ ...p, decor: e.target.checked }))
                                                }
                                            />
                                            Decor
                                        </label>

                                        <div className="filter-grid">
                                            <input
                                                placeholder="City"
                                                value={f.decor.city}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        decor: { ...p.decor, city: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.decor.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        decor: { ...p.decor, minExp: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.decor.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        decor: { ...p.decor, maxPrice: e.target.value },
                                                    }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.decor.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({
                                                        ...p,
                                                        decor: { ...p.decor, minRating: e.target.value },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="filters-actions">
                                        <button
                                            type="button"
                                            className="reset-btn"
                                            onClick={() => {
                                                setEnabled({ venue: true, dj: true, music: true, decor: true });
                                                setF({
                                                    venue: { city: "", minCap: "", minExp: "", maxPrice: "", minRating: "" },
                                                    dj: { city: "", minExp: "", maxPrice: "", minRating: "" },
                                                    music: { city: "", minExp: "", maxPrice: "", minRating: "" },
                                                    decor: { city: "", minExp: "", maxPrice: "", minRating: "" },
                                                });
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}

                            {results.length === 0 ? (
                                <div className="result-empty">No results</div>
                            ) : (
                                <ShowSearch
                                    items={results}
                                    onCloseOverlay={closeOverlay}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}