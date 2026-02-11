/**
 * Personal Details Tab Component
 */

import { useTranslation } from "react-i18next";
import { Edit } from "lucide-react";
import type { StudentProfile } from "../types/profile.types";

interface PersonalDetailsTabProps {
    profile: StudentProfile;
}

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                {label}
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                {value}
            </div>
        </div>
    );
}

export default function PersonalDetailsTab({
    profile,
}: PersonalDetailsTabProps) {
    const { t } = useTranslation("profile");

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("profile.personal.title", "Personal Details")}
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Edit className="w-4 h-4" />
                    {t("profile.personal.editDetails", "Edit Details")}
                </button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField
                    label={t("profile.personal.fullName", "Full Name")}
                    value={profile.fullName}
                />
                <DetailField
                    label={t("profile.personal.dateOfBirth", "Date of Birth")}
                    value={profile.dateOfBirth}
                />
                <DetailField
                    label={t("profile.personal.age", "Age")}
                    value={`${profile.age} ${t("profile.yearsOld", "years old")}`}
                />
                <DetailField
                    label={t(
                        "profile.personal.parentName",
                        "Parent/Guardian Name"
                    )}
                    value={profile.parentName}
                />
                <DetailField
                    label={t("profile.personal.phone", "Phone")}
                    value={profile.phone}
                />
                <DetailField
                    label={t("profile.personal.email", "Email Address")}
                    value={profile.email}
                />
            </div>

            {/* Registration Date - Full Width */}
            <div className="mt-6">
                <DetailField
                    label={t(
                        "profile.personal.registrationDate",
                        "Registration Date"
                    )}
                    value={profile.registrationDate}
                />
            </div>
        </div>
    );
}
