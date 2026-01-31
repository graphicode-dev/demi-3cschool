/**
 * Primary Teacher Card Component
 *
 * Displays information about the primary teacher
 */

import type { BaseComponentProps } from "@/design-system/types";
import type { Instructor } from "../types/instructor.types";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";
import { Edit, Lock, Trash2 } from "lucide-react";

interface PrimaryTeacherCardProps extends BaseComponentProps {
    instructor: Instructor;
    loading?: boolean;
    onChangeTeacher?: () => void;
}

export function PrimaryTeacherCard({
    instructor,
    loading = false,
    onChangeTeacher,
    className = "",
    testId,
}: PrimaryTeacherCardProps) {
    const handleAction = (action: string, itemId: string) => {
        alert(`${action} clicked for item: ${itemId}`);
    };
    const userActions: DropdownAction[] = [
        {
            id: "edit",
            label: "Edit User",
            onClick: (id) => handleAction("Edit User", id),
            icon: <Edit size={16} />,
        },
        {
            id: "permissions",
            label: "Manage Permissions",
            onClick: (id) => handleAction("Manage Permissions", id),
            icon: <Lock size={16} />,
        },
        {
            id: "delete",
            label: "Delete User",
            onClick: (id) => handleAction("Delete User", id),
            icon: <Trash2 size={16} />,
            className:
                "text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
            divider: true,
        },
    ];

    if (loading) {
        return (
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse ${className}`}
                data-testid={testId}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
            data-testid={testId}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Primary Teacher
                </h2>
                <ActionsDropdown itemId={instructor.id} actions={userActions} />
            </div>

            <div className="w-full flex items-center justify-between space-x-4">
                <div className="flex items-center justify-center gap-5">
                    <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {instructor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {instructor.role}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Assigned since {instructor.assignedSince}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onChangeTeacher}
                    className=" bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Change Primary Teacher
                </button>
            </div>
        </div>
    );
}

export default PrimaryTeacherCard;
