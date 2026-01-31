import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";
import { Calendar, Trash2 } from "lucide-react";
import { GroupStudent } from "../types";
import { ConfirmDialog } from "@/design-system";
import { useState } from "react";
import { TFunction } from "i18next";

export const StudentListItem = ({
    student,
    handleRemove,
    t,
}: {
    student: GroupStudent;
    handleRemove: (id: string) => void;
    t: TFunction<any, undefined>;
}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const userActions: DropdownAction[] = [
        {
            id: "remove",
            label: "Remove User",
            onClick: () => setShowDeleteDialog(true),
            icon: <Trash2 size={16} />,
            className:
                "text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
            divider: true,
        },
    ];

    const handleConfirmRemove = () => {
        handleRemove(student.id);
        setShowDeleteDialog(false);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-3xl">
            <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white text-sm font-bold shrink-0">
                    {/* {student.initials} */}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        Enrolled: {student.enrolledAt}
                    </p>
                </div>
            </div>
            <ActionsDropdown itemId={student.id} actions={userActions} />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                variant="danger"
                title={t(
                    "groupsManagement:students.deleteDialog.title",
                    "Delete Student"
                )}
                message={t(
                    "groupsManagement:students.deleteDialog.message",
                    "Are you sure you want to delete this student? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleConfirmRemove}
                loading={false}
            />
        </div>
    );
};
