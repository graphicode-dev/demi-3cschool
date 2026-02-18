import { useTranslation } from "react-i18next";
import {
    X,
    Mail,
    Phone,
    Shield,
    Globe,
    Calendar,
    Users,
    MapPin,
    GraduationCap,
} from "lucide-react";
import type { User } from "../types";

interface UserDetailDrawerProps {
    user: User;
    onClose: () => void;
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-750 transition-all">
            <div className="flex items-center gap-2 mb-1.5">{icon}</div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white break-all">
                {value}
            </p>
        </div>
    );
}

export default function UserDetailDrawer({
    user,
    onClose,
}: UserDetailDrawerProps) {
    const { t } = useTranslation("systemManagements");
    const info = user.userInformation;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xl h-full shadow-2xl overflow-y-auto relative flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h3 className="text-lg font-black text-brand-500 dark:text-white tracking-tight flex items-center gap-3">
                        <Shield size={20} className="text-brand-500" />
                        {t("users.detail.title")}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* User Identity */}
                    <div className="flex items-center gap-6">
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl object-cover ring-1 ring-gray-100 dark:ring-gray-700"
                        />
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                                {user.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-brand-500 dark:bg-white text-white dark:text-brand-500 shadow-sm">
                                    {user.role.caption}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {user.scope}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <InfoCard
                            icon={<Mail size={14} className="text-blue-500" />}
                            label={t("users.detail.email")}
                            value={user.email}
                        />
                        <InfoCard
                            icon={
                                <Globe
                                    size={14}
                                    className="text-emerald-500"
                                />
                            }
                            label={t("users.detail.scope")}
                            value={user.scope}
                        />
                        <InfoCard
                            icon={
                                <Shield
                                    size={14}
                                    className="text-purple-500"
                                />
                            }
                            label={t("users.detail.emailVerified")}
                            value={
                                user.emailVerified
                                    ? t("users.detail.yes")
                                    : t("users.detail.no")
                            }
                        />
                        <InfoCard
                            icon={
                                <Phone size={14} className="text-amber-500" />
                            }
                            label={t("users.detail.phoneVerified")}
                            value={
                                user.phoneVerified
                                    ? t("users.detail.yes")
                                    : t("users.detail.no")
                            }
                        />
                        {user.squad && (
                            <InfoCard
                                icon={
                                    <Users
                                        size={14}
                                        className="text-cyan-500"
                                    />
                                }
                                label={t("users.detail.squad")}
                                value={user.squad.name}
                            />
                        )}
                        <InfoCard
                            icon={
                                <Calendar
                                    size={14}
                                    className="text-gray-400"
                                />
                            }
                            label={t("users.detail.createdAt")}
                            value={user.createdAt}
                        />
                    </div>

                    {/* User Information Section */}
                    {info && (
                        <div>
                            <h4 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <GraduationCap size={14} />
                                {t("users.detail.userInfo")}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {info.gender && (
                                    <InfoCard
                                        icon={
                                            <Users
                                                size={14}
                                                className="text-pink-500"
                                            />
                                        }
                                        label={t("users.detail.gender")}
                                        value={info.gender}
                                    />
                                )}
                                {info.dateOfBirth && (
                                    <InfoCard
                                        icon={
                                            <Calendar
                                                size={14}
                                                className="text-orange-500"
                                            />
                                        }
                                        label={t("users.detail.dateOfBirth")}
                                        value={info.dateOfBirth}
                                    />
                                )}
                                {info.grade?.name && (
                                    <InfoCard
                                        icon={
                                            <GraduationCap
                                                size={14}
                                                className="text-indigo-500"
                                            />
                                        }
                                        label={t("users.detail.grade")}
                                        value={info.grade.name}
                                    />
                                )}
                                {info.governorate?.name && (
                                    <InfoCard
                                        icon={
                                            <MapPin
                                                size={14}
                                                className="text-red-500"
                                            />
                                        }
                                        label={t("users.detail.governorate")}
                                        value={info.governorate.name}
                                    />
                                )}
                                {info.country?.name && (
                                    <InfoCard
                                        icon={
                                            <Globe
                                                size={14}
                                                className="text-teal-500"
                                            />
                                        }
                                        label={t("users.detail.country")}
                                        value={info.country.name}
                                    />
                                )}
                                {info.schoolName && (
                                    <InfoCard
                                        icon={
                                            <GraduationCap
                                                size={14}
                                                className="text-blue-500"
                                            />
                                        }
                                        label={t("users.detail.school")}
                                        value={info.schoolName}
                                    />
                                )}
                                {info.address && (
                                    <InfoCard
                                        icon={
                                            <MapPin
                                                size={14}
                                                className="text-gray-500"
                                            />
                                        }
                                        label={t("users.detail.address")}
                                        value={info.address}
                                    />
                                )}
                                {info.parentEmail && (
                                    <InfoCard
                                        icon={
                                            <Mail
                                                size={14}
                                                className="text-violet-500"
                                            />
                                        }
                                        label={t("users.detail.parentEmail")}
                                        value={info.parentEmail}
                                    />
                                )}
                                {info.parentPhoneNumber && (
                                    <InfoCard
                                        icon={
                                            <Phone
                                                size={14}
                                                className="text-green-500"
                                            />
                                        }
                                        label={t("users.detail.parentPhone")}
                                        value={`${info.parentPhoneCode || ""} ${info.parentPhoneNumber}`}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
