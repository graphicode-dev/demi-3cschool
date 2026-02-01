/**
 * ScheduleSessionModal Component
 *
 * Modal for scheduling a new session with date and time fields.
 */

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Info, Monitor, MapPin } from "lucide-react";
import { Form } from "@/design-system/components/form";
import type { LocationType } from "../../types/sessions.types";

const scheduleSessionSchema = z
    .object({
        date: z.string().min(1, "Date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        locationType: z.enum(["online", "offline"]),
        offlineLocation: z.string().optional(),
    })
    .refine(
        (data) =>
            data.locationType === "online" ||
            (data.offlineLocation && data.offlineLocation.trim().length > 0),
        {
            message: "Location address is required for in-person sessions",
            path: ["offlineLocation"],
        }
    );

type ScheduleSessionFormData = z.infer<typeof scheduleSessionSchema>;

interface ScheduleSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        date: string;
        startTime: string;
        endTime: string;
        locationType: LocationType;
        offlineLocation?: string;
    }) => void;
    lessonTitle: string;
    lessonOrder: number;
    isPending?: boolean;
}

export function ScheduleSessionModal({
    isOpen,
    onClose,
    onSave,
    lessonTitle,
    lessonOrder,
    isPending = false,
}: ScheduleSessionModalProps) {
    const { t } = useTranslation("groupsManagement");

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isValid },
    } = useForm<ScheduleSessionFormData>({
        resolver: zodResolver(scheduleSessionSchema),
        defaultValues: {
            date: "",
            startTime: "",
            endTime: "",
            locationType: "offline",
            offlineLocation: "",
        },
        mode: "onChange",
    });

    const locationType = watch("locationType");

    const onSubmit = (data: ScheduleSessionFormData) => {
        onSave({
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            locationType: data.locationType,
            offlineLocation:
                data.locationType === "offline"
                    ? data.offlineLocation
                    : undefined,
        });
    };

    const locationOptions: {
        value: LocationType;
        label: string;
        icon: typeof Monitor;
    }[] = [
        {
            value: "offline",
            label: t("sessions.locationOffline", "In-Person"),
            icon: MapPin,
        },
        {
            value: "online",
            label: t("sessions.locationOnline", "Online"),
            icon: Monitor,
        },
    ];

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
                            {t("sessions.scheduleSession", "Schedule Session")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "sessions.scheduleDescription",
                                "Set the date and time for this session."
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
                            <div className="w-10 h-10 flex items-center justify-center bg-brand-100 dark:bg-brand-900/30 rounded-lg text-brand-700 dark:text-brand-400 font-semibold text-sm">
                                L{lessonOrder}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {lessonTitle}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sessions.lessonSelected",
                                        "Selected lesson for this session"
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
                                    type={{
                                        type: "date",
                                    }}
                                    label={{
                                        text: t("sessions.date", "Date"),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                                <Form.Input
                                    name="startTime"
                                    type={{
                                        type: "time",
                                    }}
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
                                    type={{
                                        type: "time",
                                    }}
                                    label={{
                                        text: t("sessions.endTime", "End Time"),
                                        required: true,
                                    }}
                                    style={{ size: "md" }}
                                />
                            </div>
                        </div>

                        {/* Location Type */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {t("sessions.locationType", "Location Type")}
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {locationOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected =
                                        locationType === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setValue(
                                                    "locationType",
                                                    option.value
                                                )
                                            }
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                                isSelected
                                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${
                                                    isSelected
                                                        ? "text-brand-500"
                                                        : "text-gray-400"
                                                }`}
                                            />
                                            <span
                                                className={`text-sm font-medium ${
                                                    isSelected
                                                        ? "text-brand-700 dark:text-brand-400"
                                                        : "text-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Offline Location Input */}
                            {locationType === "offline" && (
                                <div className="mt-4">
                                    <Form.Input
                                        name="offlineLocation"
                                        type={{
                                            type: "text",
                                            placeholder: t(
                                                "sessions.offlineLocationPlaceholder",
                                                "Enter the session location (e.g., Room 101, Building A)"
                                            ),
                                        }}
                                        label={{
                                            text: t(
                                                "sessions.offlineLocation",
                                                "Location Address"
                                            ),
                                            required: true,
                                        }}
                                        style={{ size: "md" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Info Notice */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {t(
                                    "sessions.scheduleNotice",
                                    "The session will be created with the selected lesson and schedule."
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
                                    : t(
                                          "sessions.scheduleSession",
                                          "Schedule Session"
                                      )}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default ScheduleSessionModal;
