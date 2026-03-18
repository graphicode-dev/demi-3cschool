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
const CARD_H = 444; // px — fixed card height
const SPEED = 1; // px per rAF frame
const STRIP_W = CARD_W * N;

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

    // Calculate position on circle
    const x = Math.sin(angle) * radius; // horizontal position
    const z = Math.cos(angle) * radius - radius; // depth position (0 at center)

    return { x, z };
}

/**
 * Calculate skew angle based on position for circular movement effect
 * Creates the illusion of circular path using skew transformation
 */
function calcSkew(n: number): number {
    // Skew from -15° to +15° based on position
    // Center = 0°, edges = ±15°
    return 15 * n;
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
        baseX: idx * CARD_W,
    }));

    const stageH = CARD_H;

    return (
        <div
            style={{
                width: "100%",
                height: `${stageH}px`,
                overflow: "hidden",
                // Perspective so rotateY has visible depth effect
                perspective: "1200px",
                perspectiveOrigin: "50% 100%",
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
                const skew = calcSkew(n);

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
                            transformOrigin: "center bottom",
                            transform: `translateX(${position.x}px) translateZ(${position.z}px) skewY(${skew}deg)`,
                            // Smooth position + skew as card moves
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
