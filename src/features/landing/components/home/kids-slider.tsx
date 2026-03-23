/**
 * kids-slider.tsx
 *
 * Infinite scroll slider with BOTH:
 *   1. Cosine HEIGHT arc  — tallest at edges, shortest at center
 *   2. Cosine rotateY arc — +MAX_DEG at left edge, 0° at center, -MAX_DEG at right edge
 *
 * rotateY formula (same cosine approach as height):
 *   norm  = (cardCenterX - vw/2) / (vw/2)   // -1 … 0 … +1
 *   rotY  = MAX_DEG * norm                   // linear: -MAX … 0 … +MAX
 *
 *   Left  side (norm = -1): rotateY = -MAX_DEG  (tilted right → faces right)
 *   Center      (norm =  0): rotateY =  0°       (faces straight at viewer)
 *   Right side  (norm = +1): rotateY = +MAX_DEG  (tilted left  → faces left)
 *
 * Combined with perspective on the container this creates the true
 * "inside the cylinder" look — cards on the sides are angled inward.
 */

import { useEffect, useRef, useState } from "react";
import { Images } from "@/constants/images";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA = [
    { color: "#D0FFD5", image: Images.landing.hero.kids.kid1 },
    { color: "#FFDD9E", image: Images.landing.hero.kids.kid2 },
    { color: "#7AD3FF", image: Images.landing.hero.kids.kid3 },
    { color: "#A7B5FF", image: Images.landing.hero.kids.kid4 },
    { color: "#FFF3DD", image: Images.landing.hero.kids.kid5 },
];

const N = DATA.length;

// ─── Tunable constants ────────────────────────────────────────────────────────

const CARD_W = 286; // px — card width
const CARD_GAP = 24; // px — gap between cards
const CARD_SPACING = CARD_W + CARD_GAP;
const CARD_H = 444; // px — fixed card height
const SPEED = 1; // px per rAF frame
const STRIP_W = CARD_SPACING * N;

// ─── Curve helpers ────────────────────────────────────────────────────────────

/**
 * norm: normalised screen position
 *   -1 = left edge of viewport
 *    0 = center of viewport
 *   +1 = right edge of viewport
 */
function norm(cardCenterX: number, vw: number): number {
    return (cardCenterX - vw / 2) / (vw / 2);
}

/**
 * Calculate 3D position on circular path without self-rotation
 * Cards maintain their orientation while moving along the arc
 */
function calcCircularPosition(n: number, radius: number = 800) {
    // Convert normalized position to angle (-90° to +90°)
    const angle = (n * Math.PI) / 2; // -π/2 to +π/2

    // Calculate position on circle (Concave effect)
    // Let perspective handle entirely the visual separation without crushing cards together
    const x = 0; // horizontal position (no manual offset since Z handles scaling natively)
    // z becomes positive at edges to bring them closer to the viewer
    const DEPTH = 250; // max depth coming forward
    const z = (1 - Math.cos(angle)) * DEPTH; // depth position (0 at center, +DEPTH at edges)

    return { x, z };
}

/**
 * Calculate rotation angle based on position for true 3D cylinder effect
 */
function calcRotY(n: number): number {
    const MAX_DEG = -45; // rotate up to -45 degrees at edges for concave effect
    return MAX_DEG * n;
}

// ─── KidsSlider ───────────────────────────────────────────────────────────────

function KidsSlider() {
    const [offset, setOffset] = useState(0);
    const [vw, setVw] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1440
    );
    const rafRef = useRef<number | null>(null);
    const offRef = useRef(0);

    // Responsive
    useEffect(() => {
        const onResize = () => setVw(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // rAF scroll loop
    useEffect(() => {
        const tick = () => {
            offRef.current += SPEED;
            if (offRef.current >= STRIP_W) offRef.current -= STRIP_W;
            setOffset(offRef.current);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Build enough cards to fill viewport + 1 buffer strip
    const copies = Math.ceil((vw + STRIP_W) / STRIP_W) + 1;
    const allCards = Array.from({ length: copies * N }, (_, idx) => ({
        dataIndex: idx % N,
        baseX: idx * CARD_SPACING,
    }));

    const stageH = CARD_H;

    return (
        <div
            style={{
                width: "100%",
                height: `${stageH}px`,
                overflow: "visible", // so cards coming closer to camera aren't cropped
                // Perspective so rotateY has visible depth effect
                perspective: "1200px",
                perspectiveOrigin: "50% 100%",
                transformStyle: "preserve-3d",
            }}
        >
            {/* Each card is absolutely positioned so we can apply
                individual transforms without fighting flexbox layout */}
            {allCards.map(({ dataIndex, baseX }, idx) => {
                const item = DATA[dataIndex];

                // Card center X position on screen
                const screenX = baseX - offset + CARD_W / 2;

                // Skip cards fully off-screen (left or right)
                if (screenX < -CARD_W || screenX > vw + CARD_W) return null;

                const n = norm(screenX, vw);
                const h = CARD_H;
                const position = calcCircularPosition(n);
                const rotY = calcRotY(n);
                
                // Edges have positive Z, so they are closer to the viewer.
                // Higher zIndex for larger |n| ensures they render on top properly.
                const zIndex = Math.round(Math.abs(n) * 100);

                // Card left edge on screen
                const cardLeft = baseX - offset;

                return (
                    <div
                        key={idx}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: `${cardLeft}px`,
                            width: `${CARD_W}px`,
                            zIndex, // edge cards come forward, so they must be on top
                            transformOrigin: "center bottom",
                            transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${rotY}deg)`,
                            // Smooth position + rotation as card moves
                            transition: "transform 0.05s linear",
                        }}
                    >
                        <div
                            style={{
                                width: `${CARD_W}px`,
                                height: `${h}px`,
                                backgroundColor: item.color,
                                overflow: "hidden",
                                borderRadius: "22px",
                            }}
                        >
                            <img
                                src={item.image}
                                alt=""
                                draggable={false}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "top center",
                                    display: "block",
                                    userSelect: "none",
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default KidsSlider;
