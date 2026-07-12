import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// simple array of banner data; add/adjust as necessary
const bannerItems = [
  // {
  //   id: 1,
  //   title: "erqw",
  //   description: "rqw",
  //   img: "https://res.cloudinary.com/ducr0o0wa/image/upload/v1772301372/jr-startup_qkqt81.png",
  //   route: "",
  // },
  {
    id: 1,
    title: "",
    description: "",
    img: "https://res.cloudinary.com/ducr0o0wa/image/upload/v1772301374/jr-talent_oj4xml.png",
    route: "/outgoing/",
    param: "https://docs.google.com/forms/d/e/1FAIpQLSc0B5tZee_81l2a2IGmVbs3bHyD8FPkb0gaby6l6lNtqYWA6g/viewform",
  },
//   {
//     id: 3,
//     title: "Become a Creator",
//     description: "Apply to join our creator program today.",
//     img: "/assets/boy-laptop.png",
//     route: "/creator/apply",
//   },
];

export const HomeBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // cycle banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  const handleClick = (route, param) => {

    navigate(route, { state: { link: param } });

  };

  const { title, description, img, route, param } = bannerItems[current];

  return (
    <>
    <div
      className="home-banner"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        marginBottom: "24px",
        cursor: "pointer",
        boxShadow: "0 8px 32px rgba(91,47,201,0.2)",
        border: "1.5px solid rgba(91,47,201,0.1)",
      }}
      onClick={() => handleClick(route, param)}
    >
      <img
        src={img}
        alt={title}
        style={{
          width: "100%",
          display: "block",
          objectFit: "cover",
          height: "280px",
          transition: "transform 0.4s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      />
      {/* Purple gradient overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(45,27,105,0.15) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      {/* dots */}
      <div style={{
        position: "absolute",
        bottom: "14px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
      }}>
        {bannerItems.map((_, idx) => (
          <span
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            style={{
              width: idx === current ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: idx === current ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default HomeBanner;

