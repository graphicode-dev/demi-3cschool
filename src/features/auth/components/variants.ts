export const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
            },
            opacity: { duration: 0.2 },
        },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        transition: {
            x: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30,
            },
            opacity: { duration: 0.2 },
        },
    }),
};
