/**
 * Academic Details Tab Component
 */

import { useTranslation } from "react-i18next";
import { GraduationCap, Users, Calendar, User } from "lucide-react";
import type { AcademicDetails } from "../types/profile.types";

interface AcademicDetailsTabProps {
    academicDetails: AcademicDetails;
}

function DetailCard({
    icon,
    label,
    value,
    subValue,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
}) {
    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                    {value}
                </p>
                {subValue && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function AcademicDetailsTab({
    academicDetails,
}: AcademicDetailsTabProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t(
                    "account:profile.academic.title",
                    "Current Academic Details"
                )}
            </h2>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailCard
                    icon={<GraduationCap className="w-5 h-5 text-brand-500" />}
                    label={t(
                        "account:profile.academic.programType",
                        "Program Type"
                    )}
                    value={academicDetails.programType}
                />
                <DetailCard
                    icon={<GraduationCap className="w-5 h-5 text-brand-500" />}
                    label={t("account:profile.academic.course", "Course")}
                    value={academicDetails.course}
                />
                <DetailCard
                    icon={<Users className="w-5 h-5 text-brand-500" />}
                    label={t(
                        "account:profile.academic.groupType",
                        "Group Type"
                    )}
                    value={academicDetails.groupType}
                />
                <DetailCard
                    icon={<Users className="w-5 h-5 text-brand-500" />}
                    label={t(
                        "account:profile.academic.groupName",
                        "Group Name"
                    )}
                    value={academicDetails.groupName}
                />
                <DetailCard
                    icon={<User className="w-5 h-5 text-brand-500" />}
                    label={t(
                        "account:profile.academic.instructor",
                        "Instructor"
                    )}
                    value={academicDetails.instructor}
                />
                <DetailCard
                    icon={<Calendar className="w-5 h-5 text-brand-500" />}
                    label={t("account:profile.academic.schedule", "Schedule")}
                    value={academicDetails.schedule}
                />
            </div>
        </div>
    );
}
