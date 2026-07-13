import React from "react";

/**
 * GroundFooter – rolling hill scene in the brand's blue-purple gradient
 * (matching the logo / login page palette), rendered in normal document
 * flow at the end of the page so it only comes into view once the user
 * actually scrolls to the bottom -- unlike a fixed background, it doesn't
 * stay pinned to the viewport while scrolling through content.
 */
export default function GroundFooter() {
  return (
    <div className="relative w-full pointer-events-none" style={{ height: "150px" }} aria-hidden="true">
      {/* Rolling hill */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "140px" }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C200,90 400,140 600,110 C800,80 1000,130 1200,100 C1300,90 1400,110 1440,100 L1440,200 L0,200 Z"
          fill="#c7b8f0"
        />
        <path
          d="M0,150 C200,170 400,140 600,165 C800,190 1000,150 1200,175 C1300,185 1400,165 1440,170 L1440,200 L0,200 Z"
          fill="#3B1F8E"
        />
      </svg>

      {/* Stylized tree, bottom-left -- teal/pink canopy on a deep purple trunk */}
      <svg
        className="absolute"
        style={{ bottom: "58px", left: "3%" }}
        width="72"
        height="90"
        viewBox="0 0 72 90"
      >
        <rect x="31" y="46" width="10" height="40" rx="2" fill="#2D1B69" />
        <circle cx="24" cy="34" r="20" fill="#4DD9E8" />
        <circle cx="48" cy="34" r="18" fill="#5B2FC9" />
        <circle cx="36" cy="18" r="20" fill="#E91E8C" />
      </svg>

      {/* Flowers near the tree */}
      <svg className="absolute" style={{ bottom: "50px", left: "12%" }} width="24" height="30" viewBox="0 0 24 30">
        <rect x="10" y="14" width="3" height="16" fill="#5B2FC9" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="11.5" cy="8" rx="4" ry="6" fill="#4DD9E8" transform={`rotate(${a} 11.5 8)`} />
        ))}
        <circle cx="11.5" cy="8" r="3" fill="#FFD700" />
      </svg>
      <svg className="absolute" style={{ bottom: "48px", left: "17%" }} width="20" height="26" viewBox="0 0 20 26">
        <rect x="8" y="12" width="3" height="14" fill="#5B2FC9" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="9.5" cy="7" rx="3.4" ry="5" fill="#E91E8C" transform={`rotate(${a} 9.5 7)`} />
        ))}
        <circle cx="9.5" cy="7" r="2.5" fill="#FFD700" />
      </svg>

      {/* Small bushes for texture */}
      <svg className="absolute" style={{ bottom: "44px", left: "35%" }} width="40" height="20" viewBox="0 0 40 20">
        <ellipse cx="10" cy="14" rx="10" ry="8" fill="#6d4fd6" />
        <ellipse cx="24" cy="12" rx="12" ry="9" fill="#3B1F8E" />
      </svg>
      <svg className="absolute" style={{ bottom: "40px", left: "78%" }} width="34" height="18" viewBox="0 0 34 18">
        <ellipse cx="9" cy="12" rx="9" ry="7" fill="#6d4fd6" />
        <ellipse cx="21" cy="10" rx="10" ry="8" fill="#3B1F8E" />
      </svg>
    </div>
  );
}
