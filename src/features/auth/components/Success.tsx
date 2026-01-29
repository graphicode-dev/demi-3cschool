import { useEffect } from "react";
import { To, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
    text: string;
    href?: To;
};

import type { Variants } from "framer-motion";
import { safeNavigate } from "@/utils";
import { AuthSteps } from "@/auth/auth.types";
import { authStore } from "@/auth/auth.store";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

const cloudVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 0.8,
        scale: 1.1,
        transition: {
            duration: 2,
            ease: "easeOut" as const,
            repeat: Infinity,
            repeatType: "reverse" as const,
        },
    },
};

function Success({ text, href }: Props) {
    const navigate = useNavigate();
    const { setAuthStep } = authStore();

    const handleNavigate = async () => {
        if (href) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            setAuthStep(AuthSteps.Login);
            safeNavigate(navigate, href);
        }
    };

    useEffect(() => {
        handleNavigate();
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative w-full h-full flex flex-col items-center justify-center p-4"
        >
            <motion.div
                className="relative z-20 w-full max-w-2xl px-4"
                variants={itemVariants}
            >
                <motion.p className="text-2xl md:text-4xl lg:text-5xl text-brand-500-300 text-center font-[Playfair_Display]">
                    {text}
                </motion.p>
            </motion.div>

            <motion.div
                className="relative z-20 w-full max-w-md mt-8 md:mt-12"
                variants={
                    {
                        hidden: { opacity: 0, y: 50 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.4,
                                duration: 0.8,
                                type: "spring" as const,
                                stiffness: 100,
                            },
                        },
                    } as Variants
                }
            ></motion.div>
        </motion.div>
    );
}

export default Success;
