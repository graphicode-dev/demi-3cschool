/**
 * Auth Layout
 *
 * Layout for authentication pages (login, signup, password reset).
 * Features a split-screen design with animated slider on desktop.
 */

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeroImage1 from "@/assets/images/auth/auth-1.png";
import HeroImage2 from "@/assets/images/auth/auth-2.png";
import HeroImage3 from "@/assets/images/auth/auth-3.png";
import { AuthSteps } from "@/auth/auth.types";

function AuthLayout({
    children,
    type,
}: {
    children?: React.ReactNode;
    type?: AuthSteps | null;
}) {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: t("auth:auth.slides.interactiveLearning"),
            description: t("auth:auth.slides.interactiveLearningDesc"),
            image: HeroImage1,
        },
        {
            title: t("auth:auth.slides.expertTeachers"),
            description: t("auth:auth.slides.expertTeachersDesc"),
            image: HeroImage2,
        },
        {
            title: t("auth:auth.slides.trackProgress"),
            description: t("auth:auth.slides.trackProgressDesc"),
            image: HeroImage3,
        },
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Slider */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-brand-50 relative overflow-hidden">
                <div className="fixed w-1/2 h-full bg-brand-50">
                    {/* Decorative Elements */}
                    <div className="absolute top-24 left-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 left-24 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                    <div className="absolute top-40 right-24 text-4xl opacity-20">
                        ✨
                    </div>
                    <div className="absolute bottom-24 right-16 text-3xl opacity-20">
                        ⭐
                    </div>

                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center w-full h-full px-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                className="text-center mb-15"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col gap-10">
                                    {/* Hero Image */}
                                    <div className="relative flex items-center justify-center">
                                        <img
                                            src={slides[currentSlide].image}
                                            alt="Child learning to code"
                                            className="w-[500px] h-[500px] object-contain"
                                        />
                                    </div>
                                    {/* Text Content */}
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-800 mb-3">
                                            {slides[currentSlide].title}
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-500 max-w-md">
                                    {slides[currentSlide].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 mt-6">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? "w-10 bg-brand-500"
                                            : "w-3 bg-brand-500/30"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-16 lg:px-20 py-12 bg-white">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
