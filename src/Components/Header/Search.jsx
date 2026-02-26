import { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import filterIcon from "./filter.png";
import "./css/Search.css";
import ShowSearch from "./Showsearch";

export default function Search() {
    const navigate = useNavigate();
    const boxRef = useRef(null);

    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");

    const [overlayOpen, setOverlayOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // category enable
    const [enabled, setEnabled] = useState({
        venue: true,
        dj: true,
        decor: true,
    });

    // filters values
    const [f, setF] = useState({
        venue: { city: "", minCap: "", minExp: "", maxPrice: "", minRating: "" },
        dj: { city: "", minExp: "", maxPrice: "", minRating: "" },
        decor: { city: "", minExp: "", maxPrice: "", minRating: "" },
    });

    // ✅ normalize category values from Firestore -> venue / dj / decor
    function normalizeCategory(c) {
        const v = String(c || "").trim().toLowerCase();

        // venues
        if (v === "venue" || v === "venues" || v === "hall" || v === "halls") return "venue";

        // DJs / music
        if (v === "dj" || v === "djs" || v === "music" || v === "music & djs" || v === "music and djs")
            return "dj";

        // decor / decorations
        if (v === "decor" || v === "decoration" || v === "decorations") return "decor";

        return "unknown";
    }

    // fetch all once
    useEffect(() => {
        async function fetchAll() {
            const colRef = collection(db, "Collection");
            const snap = await getDocs(colRef);
            setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        fetchAll();
    }, []);

    // close on outside click (for filter panel)
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

    function routeByCategory(category) {
        if (category === "venue") return "/venues";
        if (category === "decor") return "/decorations";
        if (category === "dj") return "/music";
        return "/services";
    }

    function handleSelect(item) {
        const cat = normalizeCategory(item.category);
        navigate(`${routeByCategory(cat)}?q=${encodeURIComponent(item.name || "")}`);
        setQuery("");
        closeOverlay();
    }

    // helpers
    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        return items
            .map((x) => ({ ...x, _cat: normalizeCategory(x.category) })) // ✅ add normalized cat
            .filter((x) => x._cat !== "unknown") // ignore unknown categories
            .filter((x) => enabled[x._cat] === true) // ✅ checkbox filter works now
            .filter((x) => {
                if (!q) return true;
                return (x.name || "").toLowerCase().includes(q);
            })
            .filter((x) => {
                const cat = x._cat;
                const fc = f[cat];

                // common fields
                const city = (x.city || x.location || "").toLowerCase();
                const exp = toNum(x.experienceYears);
                const price = toNum(x.pricePerHour ?? x.price);
                const rating = toNum(x.rating);

                // city
                if (fc.city && !city.includes(fc.city.toLowerCase())) return false;

                // exp
                if (fc.minExp && (exp === null || exp < toNum(fc.minExp))) return false;

                // price (max)
                if (fc.maxPrice && (price === null || price > toNum(fc.maxPrice))) return false;

                // rating (min)
                if (fc.minRating && (rating === null || rating < toNum(fc.minRating))) return false;

                // venue only: capacity
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
            {/* mini bar in navbar */}
            <div className="nav-search-mini" onClick={() => setOverlayOpen(true)}>
                <span className="nav-search-placeholder">Search…</span>
            </div>

            {/* Full screen overlay */}
            {overlayOpen && (
                <div className="search-overlay">
                    <div className="search-topbar">
                        <div className="search-box" ref={boxRef}>
                            <input
                                className="search-input"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search venue / decor / DJ by name…"
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
                                                    setF((p) => ({ ...p, venue: { ...p.venue, city: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Capacity"
                                                value={f.venue.minCap}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, venue: { ...p.venue, minCap: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.venue.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, venue: { ...p.venue, minExp: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.venue.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, venue: { ...p.venue, maxPrice: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.venue.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, venue: { ...p.venue, minRating: e.target.value } }))
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
                                                    setF((p) => ({ ...p, decor: { ...p.decor, city: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min ExperienceYears"
                                                value={f.decor.minExp}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, decor: { ...p.decor, minExp: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Max Price"
                                                value={f.decor.maxPrice}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, decor: { ...p.decor, maxPrice: e.target.value } }))
                                                }
                                            />
                                            <input
                                                placeholder="Min Rating"
                                                value={f.decor.minRating}
                                                onChange={(e) =>
                                                    setF((p) => ({ ...p, decor: { ...p.decor, minRating: e.target.value } }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="filters-actions">
                                        <button
                                            type="button"
                                            className="reset-btn"
                                            onClick={() => {
                                                setEnabled({ venue: true, dj: true, decor: true });
                                                setF({
                                                    venue: { city: "", minCap: "", minExp: "", maxPrice: "", minRating: "" },
                                                    dj: { city: "", minExp: "", maxPrice: "", minRating: "" },
                                                    decor: { city: "", minExp: "", maxPrice: "", minRating: "" },
                                                });
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* results */}
                            {/* results */}
                            {results.length === 0 ? (
                                <div className="result-empty">No results</div>
                            ) : (
                                <ShowSearch items={results} onSelect={handleSelect} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}