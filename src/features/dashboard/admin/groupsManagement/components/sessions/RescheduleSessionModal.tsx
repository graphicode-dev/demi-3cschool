/**
 * RescheduleSessionModal Component
 *
 * Modal for rescheduling a session with date, time, and reason fields.
 */

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Info } from "lucide-react";
import { Form } from "@/design-system/components/form";

const rescheduleSessionSchema = z.object({
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters"),
});

type RescheduleSessionFormData = z.infer<typeof rescheduleSessionSchema>;

interface RescheduleSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        date: string;
        startTime: string;
        endTime: string;
        reason: string;
    }) => void;
    lessonTitle: string;
    lessonOrder: number;
    currentDate: string;
    currentStartTime: string;
    currentEndTime: string;
    isPending?: boolean;
}

export function RescheduleSessionModal({
    isOpen,
    onClose,
    onSave,
    lessonTitle,
    lessonOrder,
    currentDate,
    currentStartTime,
    currentEndTime,
    isPending = false,
}: RescheduleSessionModalProps) {
    const { t } = useTranslation("groupsManagement");

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<RescheduleSessionFormData>({
        resolver: zodResolver(rescheduleSessionSchema),
        defaultValues: {
            date: currentDate,
            startTime: currentStartTime.slice(0, 5),
            endTime: currentEndTime.slice(0, 5),
            reason: "",
        },
        mode: "onChange",
    });

    const onSubmit = (data: RescheduleSessionFormData) => {
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t(
                                "sessions.rescheduleSession",
                                "Reschedule Session"
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "sessions.rescheduleDescription",
                                "Change the date or time for this group session."
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <Form control={control} onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-6">
                        {/* Lesson Info */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-700 dark:text-amber-400 font-semibold text-sm">
                                L{lessonOrder}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {lessonTitle}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sessions.lessonContentFixed",
                                        "Lesson content is fixed and shared across all groups."
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Session Schedule */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {t(
                                    "sessions.sessionSchedule",
                                    "Session Schedule"
                                )}
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <Form.Input
                                    name="date"
                                    type={{ type: "date" }}
                                    label={{
                                        text: t("sessions.date", "Date"),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                                <Form.Input
                                    name="startTime"
                                    type={{ type: "time" }}
                                    label={{
                                        text: t(
                                            "sessions.startTime",
                                            "Start Time"
                                        ),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                                <Form.Input
                                    name="endTime"
                                    type={{ type: "time" }}
                                    label={{
                                        text: t("sessions.endTime", "End Time"),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <Form.Input
                                name="reason"
                                type={{
                                    type: "textarea",
                                    placeholder: t(
                                        "sessions.reasonPlaceholder",
                                        "Please explain the reason for changing the session schedule."
                                    ),
                                    rows: 3,
                                }}
                                label={{
                                    text: t(
                                        "sessions.reasonForRescheduling",
                                        "Reason for Rescheduling"
                                    ),
                                    required: true,
                                }}
                                style={{ size: "md" }}
                            />
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                                {t(
                                    "sessions.reasonNote",
                                    "This reason will be saved in the system log for administrative review. (Minimum 10 characters)"
                                )}
                            </p>
                        </div>

                        {/* Info Notice */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {t(
                                    "sessions.auditNotice",
                                    "All schedule changes are recorded for transparency and auditing."
                                )}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                {t("common.cancel", "Cancel")}
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || isPending}
                                className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                {isPending
                                    ? t("common.saving", "Saving...")
                                    : t("sessions.saveChanges", "Save Changes")}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default RescheduleSessionModal;
