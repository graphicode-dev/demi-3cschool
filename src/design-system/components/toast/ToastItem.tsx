import React, { useState, useEffect, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ToastProps } from "@/shared/types";
import { useToast } from "@/design-system/hooks/useToast";

// Toast Icons
const ErrorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 119 121"
        fill="none"
    >
        <g filter="url(#filter0_d_77_1025)">
            <rect
                x="32"
                y="34"
                width="53"
                height="53"
                rx="26.5"
                fill="#FF3232"
            />
            <rect
                x="32"
                y="34"
                width="53"
                height="53"
                rx="26.5"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M51 69L67 53M67 69L51 53"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_77_1025"
                x="-2"
                y="0"
                width="121"
                height="121"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feMorphology
                    radius="3"
                    operator="dilate"
                    in="SourceAlpha"
                    result="effect1_dropShadow_77_1025"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="15" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.196078 0 0 0 0 0.196078 0 0 0 0.75 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_77_1025"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_77_1025"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

const WarningIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 130 129"
        fill="none"
    >
        <g filter="url(#filter0_d_82_1294)">
            <circle
                cx="58.5"
                cy="64.5"
                r="26.5"
                fill="#FFCA6D"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M57.8667 51.779L58.6182 67.7504L59.3683 51.7855C59.3729 51.6835 59.3567 51.5815 59.3206 51.4859C59.2845 51.3904 59.2293 51.3032 59.1583 51.2296C59.0874 51.1561 59.0022 51.0978 58.908 51.0584C58.8138 51.0189 58.7125 50.999 58.6103 51C58.5099 51.001 58.4108 51.0221 58.3187 51.062C58.2266 51.102 58.1434 51.16 58.0741 51.2326C58.0048 51.3052 57.9507 51.3909 57.9151 51.4848C57.8795 51.5786 57.863 51.6787 57.8667 51.779Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M58.6183 78.205C58.1004 78.205 57.5942 78.0515 57.1636 77.7638C56.7331 77.4761 56.3975 77.0672 56.1993 76.5887C56.0011 76.1103 55.9493 75.5839 56.0503 75.076C56.1513 74.5681 56.4007 74.1015 56.7669 73.7354C57.133 73.3692 57.5996 73.1198 58.1075 73.0188C58.6154 72.9178 59.1418 72.9696 59.6202 73.1678C60.0987 73.366 60.5076 73.7016 60.7953 74.1321C61.083 74.5627 61.2365 75.0689 61.2365 75.5868C61.2365 76.2812 60.9607 76.9471 60.4697 77.4382C59.9786 77.9292 59.3127 78.205 58.6183 78.205Z"
                fill="white"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_82_1294"
                x="-12.4"
                y="-6.4"
                width="141.8"
                height="141.8"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="21.7" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.695371 0 0 0 0 0.160833 0 0 0 1 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_82_1294"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_82_1294"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

const SuccessIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 129 129"
        fill="none"
    >
        <g filter="url(#filter0_d_74_3647)">
            <path
                d="M55.2072 39.1496C56.9629 37.8688 59.3449 37.8688 61.1006 39.1496L64.0558 41.3054C64.9141 41.9315 65.9494 42.2679 67.0118 42.266L70.671 42.2592C72.8442 42.2552 74.7711 43.6554 75.4386 45.7236L76.562 49.2046C76.8883 50.2159 77.5283 51.0968 78.3892 51.7197L81.3529 53.8643C83.1135 55.1383 83.8495 57.4036 83.1741 59.4692L82.0371 62.9459C81.7069 63.9556 81.7069 65.0444 82.0371 66.0541L83.1741 69.5308C83.8495 71.5964 83.1135 73.8617 81.3529 75.1357L78.3892 77.2803C77.5283 77.9032 76.8883 78.7842 76.562 79.7954L75.4386 83.2764C74.7711 85.3446 72.8442 86.7448 70.671 86.7408L67.0118 86.734C65.9494 86.7321 64.9141 87.0685 64.0558 87.6946L61.1006 89.8504C59.3449 91.1312 56.9629 91.1312 55.2072 89.8504L52.2519 87.6946C51.3937 87.0685 50.3583 86.7321 49.296 86.734L45.6367 86.7408C43.4636 86.7448 41.5366 85.3446 40.8692 83.2764L39.7458 79.7954C39.4194 78.7841 38.7794 77.9032 37.9186 77.2803L34.9549 75.1357C33.1943 73.8617 32.4582 71.5964 33.1337 69.5308L34.2706 66.0541C34.6009 65.0444 34.6009 63.9556 34.2706 62.9459L33.1337 59.4692C32.4582 57.4036 33.1943 55.1383 34.9549 53.8643L37.9186 51.7197C38.7794 51.0968 39.4194 50.2159 39.7458 49.2046L40.8692 45.7236C41.5366 43.6554 43.4636 42.2552 45.6367 42.2592L49.296 42.266C50.3583 42.2679 51.3937 41.9315 52.2519 41.3054L55.2072 39.1496Z"
                fill="#00A878"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M48.5289 64.5L55.4039 71.375L69.1539 57.625"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_74_3647"
                x="-12.6144"
                y="-7.31104"
                width="141.536"
                height="143.622"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feMorphology
                    radius="8"
                    operator="dilate"
                    in="SourceAlpha"
                    result="effect1_dropShadow_74_3647"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="18.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0.658824 0 0 0 0 0.470588 0 0 0 0.76 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_74_3647"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_74_3647"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

const InfoIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 114 119"
        fill="none"
    >
        <g filter="url(#filter0_d_77_1193)">
            <path
                d="M54.0833 81.5834C41.8867 81.5834 32 71.6967 32 59.5C32 47.3034 41.8867 37.4167 54.0833 37.4167C66.2799 37.4167 76.1666 47.3034 76.1666 59.5C76.1666 71.6967 66.2799 81.5834 54.0833 81.5834Z"
                fill="#4EA3E0"
            />
            <path
                d="M54.0833 50.6667L54.0656 50.6667L54.0833 50.6667ZM54.0833 68.3334L54.0833 57.2917L54.0833 68.3334ZM32 59.5C32 71.6967 41.8867 81.5834 54.0833 81.5834C66.2799 81.5834 76.1666 71.6967 76.1666 59.5C76.1666 47.3034 66.2799 37.4167 54.0833 37.4167C41.8867 37.4167 32 47.3034 32 59.5Z"
                fill="#4EA3E0"
            />
            <path
                d="M54.0833 50.6667L54.0656 50.6667M54.0833 68.3334L54.0833 57.2917M32 59.5C32 71.6967 41.8867 81.5834 54.0833 81.5834C66.2799 81.5834 76.1666 71.6967 76.1666 59.5C76.1666 47.3034 66.2799 37.4167 54.0833 37.4167C41.8867 37.4167 32 47.3034 32 59.5Z"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_77_1193"
                x="-5"
                y="0.416748"
                width="118.167"
                height="118.167"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="18" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.305882 0 0 0 0 0.639216 0 0 0 0 0.878431 0 0 0 0.73 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_77_1193"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_77_1193"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

const toastTypeConfig = {
    error: {
        icon: <ErrorIcon />,
        bgColor: "bg-error-50 dark:bg-error-950/50",
        borderColor: "border-error-300 dark:border-error-500/50",
        titleColor: "text-error-700 dark:text-error-300",
        messageColor: "text-error-600 dark:text-error-400",
        closeColor:
            "text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-200",
    },
    warning: {
        icon: <WarningIcon />,
        bgColor: "bg-warning-50 dark:bg-warning-950/50",
        borderColor: "border-warning-300 dark:border-warning-500/50",
        titleColor: "text-warning-700 dark:text-warning-300",
        messageColor: "text-warning-600 dark:text-warning-400",
        closeColor:
            "text-warning-500 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-200",
    },
    success: {
        icon: <SuccessIcon />,
        bgColor: "bg-success-50 dark:bg-success-950/50",
        borderColor: "border-success-300 dark:border-success-500/50",
        titleColor: "text-success-700 dark:text-success-300",
        messageColor: "text-success-600 dark:text-success-400",
        closeColor:
            "text-success-500 hover:text-success-700 dark:text-success-400 dark:hover:text-success-200",
    },
    info: {
        icon: <InfoIcon />,
        bgColor: "bg-blue-light-50 dark:bg-blue-light-950/50",
        borderColor: "border-blue-light-300 dark:border-blue-light-500/50",
        titleColor: "text-blue-light-700 dark:text-blue-light-300",
        messageColor: "text-blue-light-600 dark:text-blue-light-400",
        closeColor:
            "text-blue-light-500 hover:text-blue-light-700 dark:text-blue-light-400 dark:hover:text-blue-light-200",
    },
    alert: {
        icon: <InfoIcon />,
        bgColor: "bg-brand-50 dark:bg-brand-950/50",
        borderColor: "border-brand-300 dark:border-brand-500/50",
        titleColor: "text-brand-700 dark:text-brand-300",
        messageColor: "text-brand-600 dark:text-brand-400",
        closeColor:
            "text-brand-500 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-200",
    },
};

export const ToastItem: React.FC<ToastProps & { position?: string }> = ({
    id,
    type = "info",
    title,
    message,
    duration = 5000,
    position: toastPosition,
}) => {
    const { onClose, position: providerPosition } = useToast();
    const position = toastPosition || providerPosition;
    const [isVisible, setIsVisible] = useState(true);
    const config = toastTypeConfig[type];

    // For resizing
    const MIN_WIDTH = 200;
    const [width, setWidth] = useState<number>(320); // Default width
    const toastRef = useRef<HTMLDivElement>(null);
    const resizingRef = useRef(false);
    const startPositionRef = useRef(0);
    const startWidthRef = useRef(0);

    // For truncation
    const [isTruncated, setIsTruncated] = useState(true);
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose(id);
        }, 300); // Wait for exit animation to complete
    };

    // Animation variants based on position
    const getAnimationVariants = () => {
        const isTop = position?.startsWith("top");
        const isBottom = position?.startsWith("bottom");

        return {
            initial: {
                opacity: 0,
                y: isTop ? -20 : isBottom ? 20 : 0,
                x: position?.includes("center") ? 0 : 0,
            },
            animate: {
                opacity: 1,
                y: 0,
                x: 0,
            },
            exit: {
                opacity: 0,
                scale: 0.95,
            },
        };
    };

    // Handle resize move
    const handleResizeMove = useCallback(
        (e: MouseEvent) => {
            if (!resizingRef.current) return;

            e.preventDefault();

            const isRightPosition =
                position?.includes("right") || !position?.includes("left");
            const diff = e.clientX - startPositionRef.current;

            // If toast is on the right side, resize in opposite direction
            const newWidth = isRightPosition
                ? Math.max(startWidthRef.current - diff, MIN_WIDTH)
                : Math.max(startWidthRef.current + diff, MIN_WIDTH);

            // Update the toast element width
            if (toastRef.current) {
                toastRef.current.style.width = `${newWidth}px`;
            }

            // Update the state for persistence
            setWidth(newWidth);
        },
        [position]
    );

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
        if (!resizingRef.current) return;

        resizingRef.current = false;

        // Remove event listeners
        document.removeEventListener("mousemove", handleResizeMove, true);
        document.removeEventListener("mouseup", handleResizeEnd, true);

        // Restore text selection
        document.body.style.userSelect = "";
    }, [handleResizeMove]);

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the current width of the toast
        if (!toastRef.current) return;

        const currentWidth = toastRef.current.getBoundingClientRect().width;

        resizingRef.current = true;
        startPositionRef.current = e.clientX;
        startWidthRef.current = currentWidth;

        // Prevent text selection during resize
        document.body.style.userSelect = "none";

        // Add event listeners with capture phase
        document.addEventListener("mousemove", handleResizeMove, true);
        document.addEventListener("mouseup", handleResizeEnd, true);
    };

    // Toggle message truncation
    const toggleTruncation = () => {
        setIsTruncated(!isTruncated);
    };

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            if (resizingRef.current) {
                document.removeEventListener(
                    "mousemove",
                    handleResizeMove,
                    true
                );
                document.removeEventListener("mouseup", handleResizeEnd, true);
                document.body.style.userSelect = "";
            }
        };
    }, [handleResizeMove, handleResizeEnd]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={toastRef}
                    initial={getAnimationVariants().initial}
                    animate={getAnimationVariants().animate}
                    exit={getAnimationVariants().exit}
                    transition={{ duration: 0.2 }}
                    style={{ width: `${width}px` }}
                    className={`${config.bgColor} relative ${
                        message ? "py-3.5" : "py-2"
                    } pl-4 pr-12 rounded-xl shadow-theme-md overflow-hidden flex justify-start items-center gap-3 w-full border-l-4 ${
                        config.borderColor
                    } cursor-default backdrop-blur-sm`}
                    role="alert"
                    aria-live="assertive"
                >
                    {/* Resize handle - left side */}
                    {position?.includes("right") && (
                        <div
                            className="absolute left-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-gray-300/30 dark:hover:bg-white/10 transition-colors"
                            onMouseDown={handleResizeStart}
                        />
                    )}

                    {/* Resize handle - right side */}
                    {(!position?.includes("right") ||
                        position?.includes("left")) && (
                        <div
                            className="absolute right-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-gray-300/30 dark:hover:bg-white/10 transition-colors"
                            onMouseDown={handleResizeStart}
                        />
                    )}

                    {/* Icon */}
                    <div className="shrink-0 flex items-center justify-center drop-shadow-sm">
                        <div className="rounded-full">{config.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="grow min-w-0">
                        {title && (
                            <h3
                                className={`${
                                    message ? "text-base" : "text-sm"
                                } font-semibold text-left ${
                                    config.titleColor
                                } truncate leading-tight`}
                            >
                                {title}
                            </h3>
                        )}
                        {message && (
                            <div className="mt-0.5">
                                <p
                                    ref={messageRef}
                                    className={`text-sm text-left ${
                                        config.messageColor
                                    } ${
                                        isTruncated ? "line-clamp-2" : ""
                                    } cursor-pointer hover:opacity-80 transition-opacity leading-relaxed`}
                                    onClick={toggleTruncation}
                                >
                                    {message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`absolute top-1/2 -translate-y-1/2 right-3 ${config.closeColor} p-1 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400/50 transition-all duration-200`}
                        aria-label="Close notification"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
