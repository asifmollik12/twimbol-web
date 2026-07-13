import React from "react";

// Cute rounded barn-house icon, used as the "Home" nav glyph.
export default function BarnIcon({ size = 24, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Roof */}
            <path
                d="M3 11.5c-.6 0-1-.5-1-1.1 0-.35.16-.68.44-.9L11.2 2.6a1.3 1.3 0 0 1 1.6 0l8.76 6.9c.28.22.44.55.44.9 0 .6-.44 1.1-1 1.1H3z"
                fill="#f5495c"
                stroke="#7a2438"
                strokeWidth="1.1"
                strokeLinejoin="round"
            />
            <path
                d="M4.6 10.2 11.6 4.6"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.75"
            />

            {/* Walls */}
            <rect
                x="4.6"
                y="10.6"
                width="14.8"
                height="9.4"
                rx="1.6"
                fill="#ffe6a0"
                stroke="#7a2438"
                strokeWidth="1.1"
            />

            {/* Window */}
            <rect
                x="9.3"
                y="12.4"
                width="5.4"
                height="4"
                rx="0.6"
                fill="#c7d2e0"
                stroke="#7a2438"
                strokeWidth="1"
            />
            <path d="M9.9 13 12.5 13" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />

            {/* Door */}
            <rect
                x="8.6"
                y="16.7"
                width="6.8"
                height="3.3"
                fill="#f4923a"
                stroke="#7a2438"
                strokeWidth="1"
            />
            <path
                d="M8.9 17 15.1 20M15.1 17 8.9 20"
                stroke="#7a2438"
                strokeWidth="0.9"
                strokeLinecap="round"
            />

            {/* Ground plank */}
            <rect
                x="2.4"
                y="19.8"
                width="19.2"
                height="1.8"
                rx="0.9"
                fill="#d98a4a"
                stroke="#7a2438"
                strokeWidth="1"
            />
        </svg>
    );
}
