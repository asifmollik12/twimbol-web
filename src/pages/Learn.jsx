import React, { useState } from "react";
import NavBar from "../components/layout/Navbar";

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "programming", label: "Programming" },
    { id: "design", label: "Design" },
    { id: "math", label: "Math" },
    { id: "science", label: "Science" },
    { id: "language", label: "Language" },
    { id: "arts", label: "Arts & Crafts" },
];

const COURSES = [
    {
        id: 1,
        title: "Python for Kids",
        provider: "Udemy",
        providerLogo: "🎓",
        category: "programming",
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=220&fit=crop",
        price: "$12.99",
        originalPrice: "$49.99",
        rating: 4.8,
        students: "12,400",
        description: "Learn Python programming in a fun and interactive way designed for children aged 8-14.",
        affiliate: "https://udemy.com",
        badge: "Bestseller",
        badgeColor: "#f59e0b",
    },
    {
        id: 2,
        title: "Creative Drawing for Beginners",
        provider: "Skillshare",
        providerLogo: "🎨",
        category: "arts",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=220&fit=crop",
        price: "$9.99",
        originalPrice: "$29.99",
        rating: 4.7,
        students: "8,200",
        description: "Develop your artistic skills with fun drawing lessons perfect for young learners.",
        affiliate: "https://skillshare.com",
        badge: "Popular",
        badgeColor: "#8b5cf6",
    },
    {
        id: 3,
        title: "Math Made Easy — Grade 3-6",
        provider: "Khan Academy",
        providerLogo: "➕",
        category: "math",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=220&fit=crop",
        price: "Free",
        originalPrice: null,
        rating: 4.9,
        students: "50,000+",
        description: "Master mathematics with interactive lessons, quizzes and practice problems.",
        affiliate: "https://khanacademy.org",
        badge: "Free",
        badgeColor: "#10b981",
    },
    {
        id: 4,
        title: "Web Design for Young Creators",
        provider: "Coursera",
        providerLogo: "💻",
        category: "design",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=220&fit=crop",
        price: "$14.99",
        originalPrice: "$59.99",
        rating: 4.6,
        students: "6,800",
        description: "Build your first website using HTML, CSS and basic design principles.",
        affiliate: "https://coursera.org",
        badge: "New",
        badgeColor: "#3b82f6",
    },
    {
        id: 5,
        title: "English Speaking Confidence",
        provider: "Duolingo",
        providerLogo: "🗣️",
        category: "language",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=220&fit=crop",
        price: "Free",
        originalPrice: null,
        rating: 4.8,
        students: "100,000+",
        description: "Build confidence in English speaking through daily interactive exercises.",
        affiliate: "https://duolingo.com",
        badge: "Free",
        badgeColor: "#10b981",
    },
    {
        id: 6,
        title: "Introduction to Science Experiments",
        provider: "Udemy",
        providerLogo: "🔬",
        category: "science",
        image: "https://images.unsplash.com/photo-1532094349884-543290e6e5bf?w=400&h=220&fit=crop",
        price: "$11.99",
        originalPrice: "$39.99",
        rating: 4.7,
        students: "9,500",
        description: "Fun science experiments you can do at home to learn about the world around you.",
        affiliate: "https://udemy.com",
        badge: "Trending",
        badgeColor: "#ef4444",
    },
];

export default function Learn() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = COURSES.filter((c) => {
        const matchCat = activeCategory === "all" || c.category === activeCategory;
        const matchSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.provider.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f8f7fc", fontFamily: "'DM Sans', sans-serif" }}>
            <NavBar activePage="Learn" />

            {/* Hero */}
            <div
                style={{
                    background: "linear-gradient(135deg, #2D1B69 0%, #3B1F8E 50%, #5B2FC9 100%)",
                    padding: "48px 32px 40px",
                    textAlign: "center",
                }}
            >
                <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", margin: "0 0 8px" }}>
                    Learn Something New Today 🚀
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", margin: "0 0 24px" }}>
                    Explore courses from top platforms — all curated for young learners
                </p>

                {/* Search */}
                <div style={{ maxWidth: "480px", margin: "0 auto", position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 20px 14px 48px",
                            borderRadius: "50px",
                            border: "none",
                            fontSize: "14px",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>
                        🔍
                    </span>
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>

                {/* Category tabs */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                padding: "8px 18px",
                                borderRadius: "50px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600",
                                fontFamily: "'DM Sans', sans-serif",
                                background: activeCategory === cat.id ? "#FF6B35" : "#fff",
                                color: activeCategory === cat.id ? "#fff" : "#555",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                transition: "all 0.2s",
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>
                    {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
                </p>

                {/* Course grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {filtered.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
                        <p style={{ fontSize: "16px" }}>No courses found. Try a different search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CourseCard({ course }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
            }}
        >
            {/* Thumbnail */}
            <div style={{ position: "relative" }}>
                <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                />
                {course.badge && (
                    <span
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: course.badgeColor,
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 10px",
                            borderRadius: "50px",
                        }}
                    >
                        {course.badge}
                    </span>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: "16px" }}>
                {/* Provider */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{course.providerLogo}</span>
                    <span style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>{course.provider}</span>
                </div>

                {/* Title */}
                <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: "700", color: "#1a1a2e", lineHeight: "1.4" }}>
                    {course.title}
                </h3>

                {/* Description */}
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
                    {course.description}
                </p>

                {/* Rating + students */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ color: "#f59e0b", fontSize: "13px", fontWeight: "700" }}>★ {course.rating}</span>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>({course.students} students)</span>
                </div>

                {/* Price + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <span style={{ fontSize: "17px", fontWeight: "800", color: "#2D1B69" }}>
                            {course.price}
                        </span>
                        {course.originalPrice && (
                            <span style={{ fontSize: "12px", color: "#aaa", textDecoration: "line-through", marginLeft: "6px" }}>
                                {course.originalPrice}
                            </span>
                        )}
                    </div>
                    <a
                        href={course.affiliate}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: "linear-gradient(135deg, #FF6B35, #ff8c5a)",
                            color: "#fff",
                            padding: "8px 18px",
                            borderRadius: "50px",
                            fontSize: "13px",
                            fontWeight: "700",
                            textDecoration: "none",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                        Enroll →
                    </a>
                </div>
            </div>
        </div>
    );
}
