import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    X,
    UserPlus,
    Briefcase,
    GraduationCap,
    Users,
    Check,
    Mail,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { useToast } from "@/design-system";
import { useRolesList } from "../../roles/api";
import { useCreateStaff } from "../api/staff";
import { useCreateTeacher } from "../api/teachers";
import { useCreateStudent } from "../api/students";

type UserType = "staff" | "teacher" | "student";

interface UserOnboardingDrawerProps {
    onClose: () => void;
}

const COUNTRY_CODES = [
    { code: "+20", label: "EG", name: "Egypt" },
    { code: "+966", label: "SA", name: "Saudi Arabia" },
    { code: "+971", label: "AE", name: "UAE" },
    { code: "+1", label: "US", name: "USA" },
    { code: "+44", label: "UK", name: "UK" },
];

export default function UserOnboardingDrawer({
    onClose,
}: UserOnboardingDrawerProps) {
    const { t } = useTranslation("systemManagements");
    const { addToast } = useToast();

    const [userType, setUserType] = useState<UserType>("staff");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

    // Student-specific fields
    const [phoneCode, setPhoneCode] = useState(COUNTRY_CODES[0].code);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [governorateId, setGovernorateId] = useState("");
    const [gradeId, setGradeId] = useState("");

    const { data: rolesData } = useRolesList();
    const createStaff = useCreateStaff();
    const createTeacher = useCreateTeacher();
    const createStudent = useCreateStudent();

    const isSubmitting =
        createStaff.isPending ||
        createTeacher.isPending ||
        createStudent.isPending;

    const validateEmail = (val: string) => {
        setEmail(val);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(val ? regex.test(val) : null);
    };

    const handleSubmit = async () => {
        if (!name || !email || !password) return;

        try {
            if (userType === "staff") {
                await createStaff.mutateAsync({
                    name,
                    email,
                    password,
                    roleId,
                });
            } else if (userType === "teacher") {
                await createTeacher.mutateAsync({ name, email, password });
            } else {
                await createStudent.mutateAsync({
                    name,
                    email,
                    password,
                    user_information: {
                        phone_code: phoneCode,
                        phone_number: phoneNumber || undefined,
                        gender: gender || undefined,
                        date_of_birth: dateOfBirth || undefined,
                        governorate_id: governorateId
                            ? Number(governorateId)
                            : undefined,
                        grade_id: gradeId ? Number(gradeId) : undefined,
                    },
                });
            }
            addToast({
                type: "success",
                message: t("users.onboarding.created"),
            });
            onClose();
        } catch {
            addToast({
                type: "error",
                message: t("users.onboarding.createError"),
            });
        }
    };

    const USER_TYPES: {
        id: UserType;
        labelKey: string;
        descKey: string;
        icon: typeof Briefcase;
    }[] = [
        {
            id: "staff",
            labelKey: "users.onboarding.staff",
            descKey: "users.onboarding.staffDesc",
            icon: Briefcase,
        },
        {
            id: "teacher",
            labelKey: "users.onboarding.teacher",
            descKey: "users.onboarding.teacherDesc",
            icon: Users,
        },
        {
            id: "student",
            labelKey: "users.onboarding.student",
            descKey: "users.onboarding.studentDesc",
            icon: GraduationCap,
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex h-[85vh] border border-gray-200 dark:border-gray-700">
                {/* Left Sidebar */}
                <div className="w-1/4 bg-brand-500 dark:bg-gray-950 p-8 text-white flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                            <UserPlus size={36} className="text-white" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-center mb-2">
                            {t("users.onboarding.title")}
                        </h3>
                        <p className="text-xs text-white/60 text-center">
                            {t("users.onboarding.subtitle")}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 p-10 overflow-y-auto relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 end-6 p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all z-50"
                    >
                        <X size={20} />
                    </button>

                    <div className="max-w-2xl mx-auto space-y-10">
                        {/* User Type Selection */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t("users.onboarding.selectType")}
                                </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {USER_TYPES.map((ut) => (
                                    <button
                                        key={ut.id}
                                        onClick={() => setUserType(ut.id)}
                                        className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center ${
                                            userType === ut.id
                                                ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 shadow-lg"
                                                : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                                userType === ut.id
                                                    ? "bg-brand-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                            }`}
                                        >
                                            <ut.icon size={22} />
                                        </div>
                                        <div>
                                            <span
                                                className={`block font-black text-sm tracking-tight ${
                                                    userType === ut.id
                                                        ? "text-brand-500"
                                                        : "text-gray-800 dark:text-gray-200"
                                                }`}
                                            >
                                                {t(ut.labelKey)}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {t(ut.descKey)}
                                            </span>
                                        </div>
                                        {userType === ut.id && (
                                            <div className="absolute top-3 end-3 text-brand-500">
                                                <Check
                                                    size={16}
                                                    strokeWidth={4}
                                                />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Identity Fields */}
                        <section className="space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t("users.onboarding.name")}
                                </h3>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                    {t("users.onboarding.name")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t(
                                        "users.onboarding.namePlaceholder"
                                    )}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                    {t("users.onboarding.email")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder={t(
                                            "users.onboarding.emailPlaceholder"
                                        )}
                                        value={email}
                                        onChange={(e) =>
                                            validateEmail(e.target.value)
                                        }
                                        className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-xl px-5 py-4 pe-12 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white ${
                                            isEmailValid === true
                                                ? "border-emerald-500"
                                                : isEmailValid === false
                                                  ? "border-red-500"
                                                  : "border-gray-100 dark:border-gray-700 focus:border-brand-500"
                                        }`}
                                    />
                                    <div className="absolute end-4 top-1/2 -translate-y-1/2">
                                        {isEmailValid === true && (
                                            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                                                <Check
                                                    size={14}
                                                    strokeWidth={4}
                                                />
                                            </div>
                                        )}
                                        {isEmailValid === false && (
                                            <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                                <X size={14} strokeWidth={4} />
                                            </div>
                                        )}
                                        {isEmailValid === null && (
                                            <Mail
                                                size={18}
                                                className="text-gray-300"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                    {t("users.onboarding.password")}
                                </label>
                                <input
                                    type="password"
                                    placeholder={t(
                                        "users.onboarding.passwordPlaceholder"
                                    )}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Role (staff only) */}
                            {userType === "staff" && (
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                        {t("users.onboarding.role")}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={roleId}
                                            onChange={(e) =>
                                                setRoleId(e.target.value)
                                            }
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all appearance-none text-gray-900 dark:text-white cursor-pointer"
                                        >
                                            <option value="">
                                                {t(
                                                    "users.onboarding.selectRole"
                                                )}
                                            </option>
                                            {rolesData?.items?.map((role) => (
                                                <option
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.caption}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            size={18}
                                            className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Student-specific fields */}
                            {userType === "student" && (
                                <>
                                    {/* Phone */}
                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                            {t("users.onboarding.phone")}
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="relative min-w-[120px]">
                                                <select
                                                    value={phoneCode}
                                                    onChange={(e) =>
                                                        setPhoneCode(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-4 py-4 text-sm font-bold outline-none transition-all appearance-none cursor-pointer text-gray-900 dark:text-white"
                                                >
                                                    {COUNTRY_CODES.map((c) => (
                                                        <option
                                                            key={c.code}
                                                            value={c.code}
                                                        >
                                                            {c.label} {c.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={16}
                                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder={t(
                                                    "users.onboarding.phonePlaceholder"
                                                )}
                                                value={phoneNumber}
                                                onChange={(e) =>
                                                    setPhoneNumber(
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender & DOB */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                                {t("users.onboarding.gender")}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={gender}
                                                    onChange={(e) =>
                                                        setGender(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all appearance-none cursor-pointer text-gray-900 dark:text-white"
                                                >
                                                    <option value="">
                                                        {t(
                                                            "users.onboarding.selectGender"
                                                        )}
                                                    </option>
                                                    <option value="male">
                                                        {t(
                                                            "users.onboarding.male"
                                                        )}
                                                    </option>
                                                    <option value="female">
                                                        {t(
                                                            "users.onboarding.female"
                                                        )}
                                                    </option>
                                                </select>
                                                <ChevronDown
                                                    size={16}
                                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                                {t(
                                                    "users.onboarding.dateOfBirth"
                                                )}
                                            </label>
                                            <input
                                                type="date"
                                                value={dateOfBirth}
                                                onChange={(e) =>
                                                    setDateOfBirth(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Governorate & Grade */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                                {t(
                                                    "users.onboarding.governorate"
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder={t(
                                                    "users.onboarding.selectGovernorate"
                                                )}
                                                value={governorateId}
                                                onChange={(e) =>
                                                    setGovernorateId(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ms-1">
                                                {t("users.onboarding.grade")}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder={t(
                                                    "users.onboarding.selectGrade"
                                                )}
                                                value={gradeId}
                                                onChange={(e) =>
                                                    setGradeId(e.target.value)
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>

                        {/* Submit */}
                        <div className="pt-4 pb-8">
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting || !name || !email || !password
                                }
                                className="w-full py-5 bg-brand-500 dark:bg-white text-white dark:text-brand-500 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        {t("users.onboarding.creating")}
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        {t("users.onboarding.submit")}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
