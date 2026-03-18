/**
 * kids-slider.tsx
 *
 * Full-width CONCAVE (inside-the-cylinder) carousel.
 *
 * ─── How the geometry works ───────────────────────────────────────────────────
 *
 *  We place 5 cards on a 3D cylinder that is WIDE enough to fill the viewport:
 *
 *  1. The cylinder radius is computed so that the 5 card widths together
 *     exactly span the full viewport width (cards touch edge-to-edge).
 *
 *  2. Each card sits at its angular slot on the ring:
 *        rotateY(slotAngle)   → orbit to position
 *        translateZ(radius)   → push outward to circumference
 *        rotateY(180deg)      → flip to face INWARD (toward the viewer)
 *
 *  3. The ring wrapper rotates by  −stepAngle × activeIndex  so the active
 *     card always lands at angle=0 (directly in front of the viewer).
 *
 *  4. translateZ(−radius) on the ring shifts the whole cylinder back so the
 *     front card sits at Z=0 (the viewer's eye plane) — appearing full-size.
 *
 *  5. Cards at larger angular offsets appear naturally smaller / dimmer due
 *     to perspective — exactly the concave "inside the cylinder" feeling.
 *
 * ─── Visual result ────────────────────────────────────────────────────────────
 *  • ALL 5 cards fill the full screen width
 *  • The center card is the largest / closest
 *  • Side cards curve away behind the center card (concave bowl shape)
 *  • Edge cards bleed slightly off-screen — exactly matching Figma
 *  • Auto-spins continuously; pauses on hover
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    type CSSProperties,
} from "react";
import { Images } from "@/constants/images";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KidItem {
    color: string;
    image: string;
}

// ─── Design constants (Figma measurements) ────────────────────────────────────

// Card widths from Figma (Frame 83/84/85/86/87)
const CARD_WIDTH_CENTER = 309; // center and ±1 cards
const CARD_WIDTH_EDGE = 286; // ±2 edge cards

// Photo heights per offset position
const PHOTO_HEIGHT_BY_OFFSET = [372, 340, 310] as const; // [0, 1, 2]
const ARCH_HEIGHT_BY_OFFSET = [90, 82, 72] as const; // [0, 1, 2]

// Total height of the stage = tallest card
const STAGE_HEIGHT = PHOTO_HEIGHT_BY_OFFSET[0] + ARCH_HEIGHT_BY_OFFSET[0] + 16;

// Number of items
const N = 5;

// ─── WaveTop (convex arch matching Figma Vector 9/12/13) ─────────────────────

function WaveTop({
    color,
    width,
    height,
}: {
    color: string;
    width: number;
    height: number;
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            style={{ display: "block" }}
            aria-hidden="true"
        >
            {/* Convex arch: bottom-left → peak center-top → bottom-right */}
            <path
                d={`M0,${height} Q${width / 2},0 ${width},${height} Z`}
                fill={color}
            />
        </svg>
    );
}

// ─── Radius calculation ───────────────────────────────────────────────────────
//
// We want the 5 card widths to span exactly `viewportWidth` pixels when
// projected onto the screen (i.e. at angle=0 each card looks its natural size).
//
// For a card at angular offset θ from front:
//   projected_width = cardWidth × cos(θ)
//
// But we actually want the arc spacing to equal cardWidth so there are no gaps:
//   arc_between_neighbours = cardWidth  →  r × stepAngle_rad = cardWidth
//   r = cardWidth / stepAngle_rad
//
// stepAngle_rad = 2π / N
//   r = cardWidth × N / (2π)
//
// We use the average card width to get a balanced radius.

function computeRadius(viewportWidth: number): number {
    const avgCardWidth = (CARD_WIDTH_CENTER * 3 + CARD_WIDTH_EDGE * 2) / N; // ≈ 299.8

    // Arc spacing equals avgCardWidth
    const stepAngleRad = (2 * Math.PI) / N;
    const r = avgCardWidth / stepAngleRad;

    // Clamp: must be at least wide enough not to overlap
    return Math.max(r, viewportWidth * 0.38);
}

// ─── KidCard ─────────────────────────────────────────────────────────────────

function KidCard({
    item,
    offset, // signed: -2…+2
    isDragging,
}: {
    item: KidItem;
    offset: number;
    isDragging: boolean;
}) {
    const absOff = Math.abs(offset);
    const clampedOff = Math.min(absOff, 2) as 0 | 1 | 2;

    const cardWidth = clampedOff === 2 ? CARD_WIDTH_EDGE : CARD_WIDTH_CENTER;
    const photoHeight = PHOTO_HEIGHT_BY_OFFSET[clampedOff];
    const archHeight = ARCH_HEIGHT_BY_OFFSET[clampedOff];

    // Depth cues — cards further round the cylinder are slightly dimmer
    const brightness = [100, 88, 72][clampedOff];
    const shadow =
        absOff === 0 ? "drop-shadow(0 20px 48px rgba(0,0,0,0.18))" : "none";

    return (
        <div
            style={{
                width: `${cardWidth}px`,
                alignSelf: "flex-end",
                // Horizontal centering within the slot
                marginLeft: `${(CARD_WIDTH_CENTER - cardWidth) / 2}px`,
                filter: absOff === 0 ? shadow : `brightness(${brightness}%)`,
                transition: isDragging ? "none" : "filter 0.5s ease",
            }}
        >
            {/* Convex arch top */}
            <WaveTop color={item.color} width={cardWidth} height={archHeight} />

            {/* Photo body */}
            <div
                style={{
                    width: `${cardWidth}px`,
                    height: `${photoHeight}px`,
                    backgroundColor: item.color,
                    overflow: "hidden",
                    borderRadius: "0 0 24px 24px",
                    position: "relative",
                }}
            >
                <img
                    src={item.image}
                    alt={`Kid ${clampedOff + 1}`}
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                        transform: absOff === 0 ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.5s ease",
                    }}
                />
            </div>
        </div>
    );
}

// ─── CylinderStage ────────────────────────────────────────────────────────────
// Handles all the 3D geometry. Rendered once; parent just passes activeIndex.

function CylinderStage({
    data,
    activeIndex,
    isDragging,
    onItemClick,
    viewportWidth,
}: {
    data: KidItem[];
    activeIndex: number;
    isDragging: boolean;
    onItemClick: (i: number) => void;
    viewportWidth: number;
}) {
    const radius = computeRadius(viewportWidth);
    const stepAngle = 360 / N;
    // How much to rotate the ring so activeIndex faces the viewer
    const ringRotation = -stepAngle * activeIndex;

    // Perspective: deep enough to see the curvature but not fish-eye
    // Sweet spot: 1.8 × radius
    const perspective = Math.round(radius * 1.8);

    return (
        <div
            style={{
                width: "100%",
                height: `${STAGE_HEIGHT}px`,
                position: "relative",
                // Perspective applied at the stage level
                perspective: `${perspective}px`,
                // perspectiveOrigin at horizontal center, vertical bottom —
                // this makes the cards "sit on a floor" rather than floating
                perspectiveOrigin: `50% ${STAGE_HEIGHT + radius * 0.2}px`,
                overflow: "visible",
            }}
        >
            {/* ── Ring ──────────────────────────────────────────────────── */}
            <div
                style={{
                    // Slot-width: use center card width; edge cards center inside
                    width: `${CARD_WIDTH_CENTER}px`,
                    height: `${STAGE_HEIGHT}px`,
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transformStyle: "preserve-3d",
                    /*
                     * translateX(-50%)     → center the ring on the viewport
                     * translateZ(-radius)  → push cylinder back so front card
                     *                        sits at Z=0 (eye plane = full size)
                     * rotateY(ringRot)     → spin active card to front (angle=0)
                     */
                    transform: `translateX(-50%) translateZ(${-radius}px) rotateY(${ringRotation}deg)`,
                    transition: isDragging
                        ? "none"
                        : "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
            >
                {data.map((item, i) => {
                    // Add 90-degree offset so cards start from the left side
                    const slotAngle = stepAngle * i + 5;
                    const rawOffset = (i - activeIndex + N) % N;
                    // Normalise to -N/2…N/2 so we know left vs right side
                    const offset =
                        rawOffset > N / 2 ? rawOffset - N : rawOffset;
                    const absOff = Math.abs(offset);

                    return (
                        <div
                            key={i}
                            onClick={() => onItemClick(i)}
                            style={{
                                position: "absolute",
                                width: `${CARD_WIDTH_CENTER}px`,
                                height: `${STAGE_HEIGHT}px`,
                                bottom: 0,
                                left: 0,
                                /*
                                 * Fixed angle calculation with 90° offset:
                                 * 1. rotateY(slotAngle)   → orbit to angular slot
                                 * 2. translateZ(radius)   → push to ring circumference
                                 * 3. rotateY(180deg)      → face INWARD toward viewer
                                 */
                                transform: `rotateY(${slotAngle}deg) translateZ(${radius}px) rotateY(180deg)`,
                                backfaceVisibility: "hidden",
                                cursor: absOff === 0 ? "default" : "pointer",
                                display: "flex",
                                alignItems: "flex-end",
                            }}
                        >
                            <KidCard
                                item={item}
                                offset={offset}
                                isDragging={isDragging}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── KidsSlider ───────────────────────────────────────────────────────────────

const DATA: KidItem[] = [
    { color: "#D0FFD5", image: Images.landing.hero.kids.kid1 },
    { color: "#FFDD9E", image: Images.landing.hero.kids.kid2 },
    { color: "#7AD3FF", image: Images.landing.hero.kids.kid3 },
    { color: "#A7B5FF", image: Images.landing.hero.kids.kid4 },
    { color: "#FFF3DD", image: Images.landing.hero.kids.kid5 },
];

function KidsSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1440
    );
    const dragStart = useRef(0);
    const dragCurrent = useRef(0);

    // Track viewport width for responsive radius
    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Auto-advance
    useEffect(() => {
        if (isHovered || isDragging) return;
        const id = setInterval(() => setActiveIndex((p) => (p + 1) % N), 2000);
        return () => clearInterval(id);
    }, [isHovered, isDragging]);

    // Drag / swipe handlers
    const onDragStart = useCallback((x: number) => {
        setIsDragging(true);
        dragStart.current = x;
        dragCurrent.current = x;
    }, []);

    const onDragMove = useCallback((x: number) => {
        dragCurrent.current = x;
    }, []);

    const onDragEnd = useCallback(() => {
        if (!isDragging) return;
        const delta = dragStart.current - dragCurrent.current;
        if (Math.abs(delta) > 50) {
            setActiveIndex((p) =>
                delta > 0 ? (p + 1) % N : p === 0 ? N - 1 : p - 1
            );
        }
        setIsDragging(false);
    }, [isDragging]);

    return (
        <div
            className="absolute bottom-0 left-0 right-0 w-full"
            style={{
                height: `${STAGE_HEIGHT}px`,
                overflow: "hidden",
                cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                onDragEnd();
            }}
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseMove={(e) => {
                if (isDragging) onDragMove(e.clientX);
            }}
            onMouseUp={onDragEnd}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => {
                if (isDragging) onDragMove(e.touches[0].clientX);
            }}
            onTouchEnd={onDragEnd}
        >
            <CylinderStage
                data={DATA}
                activeIndex={activeIndex}
                isDragging={isDragging}
                onItemClick={setActiveIndex}
                viewportWidth={viewportWidth}
            />
        </div>
    );
}

export default KidsSlider;
