import { useState } from "react";
import ThemedText from "@/design-system/components/ThemedText";
import { useLanguage } from "@/shared/hooks";
import { useScrollAnimation } from "../../hooks";
import { Images } from "@/constants/images";

interface FormField {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    multiline?: boolean;
}

function LabeledInput({
    field,
    value,
    onChange,
}: {
    field: FormField;
    value: string;
    onChange: (val: string) => void;
}) {
    if (field.multiline) {
        return (
            <div className="relative w-full z-50">
                {/* Label (always above) */}
                <div className="absolute -top-3 left-5 bg-white px-1.5 py-0.5 rounded-full z-10">
                    <ThemedText
                        as="span"
                        weight="medium"
                        className="text-[16px] md:text-[20px] text-brand-500 capitalize leading-[normal]"
                    >
                        {field.label}
                    </ThemedText>
                </div>
                <textarea
                    name={field.name}
                    value={value}
                    placeholder={field.placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-[120px] md:h-[135px] bg-white border border-gray-200 rounded-[21px] px-7 pt-7 pb-4 text-[16px] md:text-[20px] text-gray-700 placeholder-gray-300 outline-none focus:border-brand-500 transition-colors duration-200 resize-none"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full z-50">
            {/* Label (always above) */}
            <div className="absolute -top-3 left-5 bg-white px-1.5 py-0.5 rounded-full z-10">
                <ThemedText
                    as="span"
                    weight="medium"
                    className="text-[16px] md:text-[20px] text-brand-500 capitalize leading-[normal]"
                >
                    {field.label}
                </ThemedText>
            </div>
            <input
                type={field.type}
                name={field.name}
                value={value}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-[72px] md:h-[82px] bg-white border border-gray-200 rounded-[21px] px-7 text-[16px] md:text-[20px] text-gray-700 placeholder-gray-300 outline-none focus:border-brand-500 transition-colors duration-200"
            />
        </div>
    );
}

export default function Register() {
    const { t, isRTL } = useLanguage();

    const { ref: sectionRef, isVisible: isSectionVisible } = useScrollAnimation(
        { threshold: 0.1 }
    );
    const { ref: formRef, isVisible: isFormVisible } = useScrollAnimation({
        threshold: 0.1,
    });

    const [formData, setFormData] = useState({
        parentName: "",
        studentAge: "",
        parentPhone: "",
        parentEmail: "",
        message: "",
    });

    const fields: FormField[] = [
        {
            name: "parentName",
            label: t("register.fields.parentName.label"),
            placeholder: t("register.fields.parentName.placeholder"),
            type: "text",
            required: true,
        },
        {
            name: "studentAge",
            label: t("register.fields.studentAge.label"),
            placeholder: t("register.fields.studentAge.placeholder"),
            type: "number",
            required: true,
        },
        {
            name: "parentPhone",
            label: t("register.fields.parentPhone.label"),
            placeholder: t("register.fields.parentPhone.placeholder"),
            type: "tel",
            required: true,
        },
        {
            name: "parentEmail",
            label: t("register.fields.parentEmail.label"),
            placeholder: t("register.fields.parentEmail.placeholder"),
            type: "email",
            required: true,
        },
        {
            name: "message",
            label: t("register.fields.message.label"),
            placeholder: t("register.fields.message.placeholder"),
            type: "text",
            required: false,
            multiline: true,
        },
    ];

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire up form submission
        console.log("Form submitted:", formData);
    };

    return (
        <section
            id="register"
            className="relative w-full py-20 lg:py-32 z-50 overflow-hidden"
        >
            <div className="w-full relative max-w-7xl mx-auto px-4 lg:px-8 z-50">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Left Side - Decorative */}
                    <div
                        ref={sectionRef}
                        className={`w-full lg:w-1/2 flex flex-col items-stretch justify-start gap-5 transition-all duration-700 transform ${
                            isSectionVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-10"
                        }`}
                    >
                        {/* Banner Card */}
                        <div className="relative w-full aspect-689/294 rounded-tl-[44px] rounded-tr-[98px] rounded-bl-[93px] rounded-br-[44px] overflow-hidden z-50">
                            {/* Background */}
                            <img
                                src={Images.landing.register.card}
                                className="absolute inset-0 w-full h-full object-fill"
                                alt=""
                            />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <div className="-rotate-6 -translate-y-4">
                                    <div className="flex items-center justify-center gap-2 mb-[-5px] md:mb-[-10px]">
                                        <ThemedText
                                            as="span"
                                            weight="bold"
                                            className="text-brand-500 text-[36px] md:text-[64px] capitalize"
                                        >
                                            3c
                                        </ThemedText>
                                        <ThemedText
                                            as="span"
                                            weight="semibold"
                                            className="text-gray-700 text-[28px] md:text-[48px]"
                                        >
                                            {t("register.banner.line1")}
                                        </ThemedText>
                                    </div>
                                    <ThemedText
                                        as="p"
                                        weight="semibold"
                                        className="text-gray-700 text-[28px] md:text-[48px] leading-tight"
                                    >
                                        {t("register.banner.line2")}
                                    </ThemedText>
                                    {t("register.banner.line3") && (
                                        <ThemedText
                                            as="p"
                                            weight="semibold"
                                            className="text-gray-700 text-[28px] md:text-[48px] leading-tight"
                                        >
                                            {t("register.banner.line3")}
                                        </ThemedText>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kids Photo */}
                        <div className="relative w-full h-full rounded-tl-[44px] rounded-tr-[98px] rounded-bl-[93px] rounded-br-[44px] overflow-hidden z-50">
                            <img
                                src={Images.landing.register.students}
                                className="w-full h-full object-cover rounded-tl-[44px] rounded-tr-[98px] rounded-bl-[93px] rounded-br-[44px]"
                                alt={t("register.imageAlt")}
                            />
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div
                        ref={formRef}
                        className={`w-full lg:w-1/2 bg-white transition-all duration-700 transform ${
                            isFormVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-10"
                        }`}
                    >
                        {/* Title */}
                        <div className="mb-10 md:mb-16">
                            <h2 className="m-0 mb-3">
                                <ThemedText
                                    as="span"
                                    variant="heading"
                                    weight="semibold"
                                    className="text-[30px] md:text-[40px] leading-[normal] text-gray-700 capitalize"
                                >
                                    {t("register.title")}{" "}
                                </ThemedText>
                                <ThemedText
                                    as="span"
                                    variant="heading"
                                    weight="bold"
                                    className="text-[30px] md:text-[40px] leading-[normal] text-brand-500 capitalize"
                                >
                                    {t("register.titleHighlight")}
                                </ThemedText>
                            </h2>
                            <ThemedText
                                as="p"
                                weight="medium"
                                className="text-[18px] md:text-[26px] text-landing-text-secondary lowercase leading-[normal]"
                            >
                                {t("register.subtitle")}
                            </ThemedText>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-9"
                        >
                            {fields.map((field) => (
                                <LabeledInput
                                    key={field.name}
                                    field={field}
                                    value={
                                        formData[
                                            field.name as keyof typeof formData
                                        ]
                                    }
                                    onChange={(val) =>
                                        handleChange(field.name, val)
                                    }
                                />
                            ))}

                            {/* Buttons */}
                            <div className="flex flex-col gap-3.5 w-full">
                                <button
                                    type="submit"
                                    className="w-full bg-brand-500 border-2 border-brand-500 lg:border-gray-700 text-brand-50 py-4 lg:py-5 rounded-[52px] hover:bg-brand-600 transition-colors duration-300"
                                >
                                    <ThemedText
                                        as="span"
                                        weight="semibold"
                                        className="text-[20px] md:text-[24px] capitalize leading-[normal]"
                                    >
                                        {t("register.submit")}
                                    </ThemedText>
                                </button>
                                <a
                                    href="https://wa.me/201023168167"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-3 border-2 border-brand-500 text-brand-500 py-4 lg:py-5 rounded-[52px] hover:bg-brand-50 transition-colors duration-300"
                                >
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 34 34"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M17 1.5C8.44 1.5 1.5 8.44 1.5 17C1.5 19.74 2.24 22.36 3.56 24.6L1.5 32.5L9.6 30.48C11.78 31.7 14.3 32.5 17 32.5C25.56 32.5 32.5 25.56 32.5 17C32.5 8.44 25.56 1.5 17 1.5ZM17 29.5C14.56 29.5 12.26 28.78 10.3 27.5L9.9 27.26L5.14 28.5L6.4 23.86L6.14 23.44C4.74 21.4 4 18.96 4 16.5C4 9.32 9.82 3.5 17 3.5C24.18 3.5 30 9.32 30 16.5C30 23.68 24.18 29.5 17 29.5ZM24.06 20.34C23.72 20.16 22.04 19.34 21.74 19.22C21.44 19.1 21.22 19.04 21 19.38C20.78 19.72 20.12 20.48 19.94 20.7C19.76 20.92 19.58 20.96 19.24 20.78C18.9 20.6 17.78 20.24 16.46 19.06C15.42 18.14 14.72 17.02 14.54 16.68C14.36 16.34 14.52 16.16 14.7 15.98C14.86 15.82 15.04 15.56 15.22 15.38C15.4 15.2 15.46 15.06 15.58 14.84C15.7 14.62 15.64 14.44 15.56 14.26C15.48 14.08 14.78 12.38 14.5 11.7C14.24 11.04 13.96 11.14 13.76 11.12C13.58 11.1 13.36 11.1 13.14 11.1C12.92 11.1 12.56 11.18 12.26 11.52C11.96 11.86 11.08 12.68 11.08 14.36C11.08 16.04 12.3 17.66 12.48 17.88C12.66 18.1 14.72 21.36 17.82 22.82C20.92 24.28 20.92 23.78 21.52 23.72C22.12 23.66 23.54 22.86 23.8 22.04C24.06 21.22 24.06 20.52 23.98 20.38C23.9 20.24 23.4 20.52 24.06 20.34Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <ThemedText
                                        as="span"
                                        weight="semibold"
                                        className="text-[20px] md:text-[24px] capitalize leading-[normal]"
                                    >
                                        {t("register.whatsapp")}
                                    </ThemedText>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
