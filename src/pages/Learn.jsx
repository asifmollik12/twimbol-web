import React, { useState } from "react";
import NavBar from "../components/layout/Navbar";
import GroundFooter from "../components/ui/GroundFooter.jsx";
import { Rocket, Search, Sparkles } from "lucide-react";
import ComingSoonModal from "../components/ui/ComingSoonModal.jsx";

const PAGE_SIZE = 20;

const CATEGORIES = [
    { id: "all", label: "সব" },
    { id: "programming", label: "Programming" },
    { id: "design", label: "Design" },
    { id: "academic", label: "Academic" },
    { id: "language", label: "Language" },
    { id: "freelancing", label: "Freelancing" },
];

const COURSES = [
    {
        id: 1,
        title: "Spoken English Course",
        provider: "10 Minute School",
        platformId: "10ms",
        providerColor: "#00a651",
        providerBg: "#f0fdf4",
        category: "language",
        price: "৳ ৯৯৯",
        originalPrice: "৳ ১,৯৯৯",
        rating: 4.9,
        students: "৫০,০০০+",
        description: "ঘরে বসেই Spoken English শিখুন। প্র্যাকটিক্যাল exercises ও live class সহ।",
        link: "https://10minuteschool.com/en/categories/language-learning/",
        badge: "Bestseller",
        badgeColor: "#f59e0b",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=200&fit=crop",
    },
    {
        id: 2,
        title: "HSC Physics Complete Course",
        provider: "10 Minute School",
        platformId: "10ms",
        providerColor: "#00a651",
        providerBg: "#f0fdf4",
        category: "academic",
        price: "৳ ১,৫০০",
        originalPrice: "৳ ৩,০০০",
        rating: 4.8,
        students: "৩০,০০০+",
        description: "HSC Physics পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি। Live class, notes ও model test।",
        link: "https://10minuteschool.com/en/academic/",
        badge: "Popular",
        badgeColor: "#8b5cf6",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    },
    {
        id: 3,
        title: "HSC Biology Foundation Course",
        provider: "10 Minute School",
        platformId: "10ms",
        providerColor: "#00a651",
        providerBg: "#f0fdf4",
        category: "academic",
        price: "Free",
        originalPrice: null,
        rating: 4.7,
        students: "২০,০০০+",
        description: "HSC Biology এর সম্পূর্ণ foundation তৈরি করুন বিনামূল্যে।",
        link: "https://10minuteschool.com/en/product/hsc-biology-foundation-course/",
        badge: "Free",
        badgeColor: "#10b981",
        image: "https://images.unsplash.com/photo-1532094349884-543290e6e5bf?w=400&h=200&fit=crop",
    },
    {
        id: 4,
        title: "Professional Web Design",
        provider: "Creative IT Institute",
        platformId: "creative-it",
        providerColor: "#e11d48",
        providerBg: "#fff1f2",
        category: "design",
        price: "৳ ১৫,০০০",
        originalPrice: "৳ ২০,০০০",
        rating: 4.8,
        students: "১২,০০০+",
        description: "HTML, CSS, Bootstrap দিয়ে professional website design শিখুন। Job placement support সহ।",
        link: "https://www.creativeitinstitute.com/courses/web-design",
        badge: "Job Support",
        badgeColor: "#ef4444",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop",
    },
    {
        id: 5,
        title: "Professional UX/UI Design",
        provider: "Creative IT Institute",
        platformId: "creative-it",
        providerColor: "#e11d48",
        providerBg: "#fff1f2",
        category: "design",
        price: "৳ ১৮,০০০",
        originalPrice: "৳ ২৫,০০০",
        rating: 4.7,
        students: "৮,০০০+",
        description: "Figma দিয়ে UX/UI design শিখুন। User research, wireframing, prototyping সব।",
        link: "https://www.creativeitinstitute.com/courses/professional-uxui-design",
        badge: "Trending",
        badgeColor: "#8b5cf6",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
    },
    {
        id: 6,
        title: "Diploma in Full Stack Web Development",
        provider: "Creative IT Institute",
        platformId: "creative-it",
        providerColor: "#e11d48",
        providerBg: "#fff1f2",
        category: "programming",
        price: "৳ ৩০,০০০",
        originalPrice: "৳ ৪০,০০০",
        rating: 4.9,
        students: "১৫,০০০+",
        description: "HTML থেকে React, Node.js পর্যন্ত সম্পূর্ণ Full Stack Development।",
        link: "https://www.creativeitinstitute.com/courses/diploma-in-full-stack-development",
        badge: "Bestseller",
        badgeColor: "#f59e0b",
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop",
    },
    {
        id: 7,
        title: "SSC/HSC সম্পূর্ণ প্রস্তুতি",
        provider: "Shikho",
        platformId: "shikho",
        providerColor: "#f97316",
        providerBg: "#fff7ed",
        category: "academic",
        price: "৳ ৮৯৯/মাস",
        originalPrice: "৳ ১,৪৯৯/মাস",
        rating: 4.8,
        students: "৪০,০০০+",
        description: "ঘরে বসে SSC/HSC এর A+ প্রস্তুতি। বিশ্বস্ত শিক্ষকদের live class ও notes।",
        link: "https://shikho.com",
        badge: "Popular",
        badgeColor: "#f97316",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
    },
    {
        id: 8,
        title: "Python দিয়ে Machine Learning",
        provider: "Bohubrihi",
        platformId: "bohubrihi",
        providerColor: "#2563eb",
        providerBg: "#eff6ff",
        category: "programming",
        price: "৳ ৩,৫০০",
        originalPrice: "৳ ৫,০০০",
        rating: 4.7,
        students: "৬,০০০+",
        description: "Python ব্যবহার করে Machine Learning এর হাতেকলমে শিক্ষা। বাংলায় সহজ ভাষায়।",
        link: "https://bohubrihi.com",
        badge: "Trending",
        badgeColor: "#2563eb",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    },
    {
        id: 9,
        title: "Freelancing Complete Course",
        provider: "Bohubrihi",
        platformId: "bohubrihi",
        providerColor: "#2563eb",
        providerBg: "#eff6ff",
        category: "freelancing",
        price: "৳ ২,৯৯৯",
        originalPrice: "৳ ৪,৫০০",
        rating: 4.6,
        students: "১০,০০০+",
        description: "Upwork, Fiverr এ ক্যারিয়ার গড়ুন। Profile setup থেকে client পাওয়া পর্যন্ত।",
        link: "https://bohubrihi.com",
        badge: "Bestseller",
        badgeColor: "#f59e0b",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
    },
];

export default function Learn() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [comingSoonOpen, setComingSoonOpen] = useState(false);

    const filtered = COURSES.filter((c) => {
        const matchCat = activeCategory === "all" || c.category === activeCategory;
        const q = search.toLowerCase();
        const matchSearch = c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });
    const visible = filtered.slice(0, visibleCount);

    React.useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [activeCategory, search]);

    return (
        <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "'DM Sans', sans-serif" }}>
            <NavBar activePage="Learn" />
            <ComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
            <style>{`
                @media (max-width: 640px) {
                    .learn-hero { padding: 36px 16px 32px !important; }
                    .learn-hero h1 { font-size: 24px !important; }
                    .learn-container { padding: 24px 12px !important; }
                }
            `}</style>

            {/* Hero */}
            <div className="learn-hero" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0a3e 0%, #2D1B69 45%, #3B1F8E 100%)", padding: "56px 32px 48px", textAlign: "center" }}>
                {/* Decorative rings, matching the login page's brand accent treatment */}
                <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "180px", height: "180px", borderRadius: "50%", border: "2px solid rgba(77,217,232,0.22)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-70px", right: "-40px", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid rgba(233,30,140,0.18)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "18%", right: "9%", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "12%", left: "7%", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(77,217,232,0.1)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#4DD9E8", padding: "5px 14px", borderRadius: "50px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "18px" }}>
                        <Sparkles size={12} style={{ marginRight: "2px" }} />
                        Learning Hub
                    </span>
                    <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "-0.5px" }}>
                        শেখার সেরা জায়গা
                        <Rocket size={26} color="#4DD9E8" strokeWidth={2} />
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", margin: "0 0 28px" }}>
                        10 Minute School, Creative IT সহ দেশের সেরা platforms এর courses এক জায়গায়
                    </p>
                    <div style={{ maxWidth: "500px", margin: "0 auto 28px", position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Course খুঁজুন..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "100%", padding: "15px 20px 15px 48px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.2)", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", backgroundColor: "#fff", color: "#000", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
                        />
                        <Search size={18} color="#6b7280" strokeWidth={2} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                        {[
                            { name: "10 Minute School", color: "#15803d" },
                            { name: "Creative IT", color: "#be123c" },
                            { name: "Shikho", color: "#c2410c" },
                            { name: "Bohubrihi", color: "#1d4ed8" },
                        ].map((p) => (
                            <span key={p.name} style={{ background: "#fff", color: p.color, padding: "5px 14px", borderRadius: "50px", fontSize: "12px", fontWeight: "800", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                                {p.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="learn-container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>

                {/* Category filter */}
                <div style={{ marginBottom: "28px", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#999", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    padding: "7px 16px",
                                    borderRadius: "50px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    fontFamily: "'DM Sans', sans-serif",
                                    background: activeCategory === cat.id ? "linear-gradient(135deg, #2D1B69, #5B2FC9)" : "#fff",
                                    color: activeCategory === cat.id ? "#fff" : "#555",
                                    boxShadow: activeCategory === cat.id ? "0 4px 12px rgba(91,47,201,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
                                    transition: "all 0.2s",
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>{filtered.length}টি course পাওয়া গেছে</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                    {visible.map((course) => (
                        <CourseCard key={course.id} course={course} onSelect={() => setComingSoonOpen(true)} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
                        <p style={{ fontSize: "16px" }}>কোনো course পাওয়া যায়নি।</p>
                    </div>
                )}

                {visibleCount < filtered.length && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 8px" }}>
                        <button
                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            style={{
                                background: "linear-gradient(135deg, #2D1B69, #5B2FC9)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50px",
                                padding: "12px 32px",
                                fontSize: "14px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                boxShadow: "0 4px 16px rgba(91,47,201,0.3)",
                            }}
                        >
                            See More
                        </button>
                    </div>
                )}
            </div>

            <GroundFooter />
        </div>
    );
}

function CourseCard({ course, onSelect }) {
    return (
        <div
            onClick={onSelect}
            style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
        >
            <div style={{ position: "relative" }}>
                <img src={course.image} alt={course.title} style={{ width: "100%", height: "155px", objectFit: "cover", display: "block" }} />
                {course.badge && (
                    <span style={{ position: "absolute", top: "10px", left: "10px", background: course.badgeColor, color: "#fff", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "50px" }}>
                        {course.badge}
                    </span>
                )}
                <span style={{ position: "absolute", bottom: "10px", right: "10px", background: course.providerBg, color: course.providerColor, fontSize: "10px", fontWeight: "800", padding: "3px 10px", borderRadius: "50px" }}>
                    {course.provider}
                </span>
            </div>
            <div style={{ padding: "16px" }}>
                <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: "700", color: "#1a1a2e", lineHeight: "1.4" }}>{course.title}</h3>
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#666", lineHeight: "1.5" }}>{course.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ color: "#f59e0b", fontSize: "13px", fontWeight: "700" }}>★ {course.rating}</span>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>({course.students} জন)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <span style={{ fontSize: "17px", fontWeight: "800", color: "#2D1B69" }}>{course.price}</span>
                        {course.originalPrice && <span style={{ fontSize: "12px", color: "#aaa", textDecoration: "line-through", marginLeft: "6px" }}>{course.originalPrice}</span>}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(); }}
                        style={{ background: "linear-gradient(135deg, #2D1B69, #5B2FC9)", color: "#fff", padding: "8px 18px", borderRadius: "50px", fontSize: "13px", fontWeight: "700", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                    >
                        দেখুন →
                    </button>
                </div>
            </div>
        </div>
    );
}
