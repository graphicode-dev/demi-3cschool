import { useTranslation } from "react-i18next";
import {
    Clock,
    List,
    AlertTriangle,
    Calendar,
    CheckCircle,
    XCircle,
    Timer,
    Wifi,
    ArrowRight,
    Loader2,
} from "lucide-react";
import type { FinalExam } from "../types";
import PageWrapper from "@/design-system/components/PageWrapper";

interface PreExamProps {
    exam: FinalExam;
    onStartExam: () => void;
    isStarting: boolean;
    isAgreed: boolean;
    onAgreeChange: (agreed: boolean) => void;
}

export function PreExam({
    exam,
    onStartExam,
    isStarting,
    isAgreed,
    onAgreeChange,
}: PreExamProps) {
    const { t } = useTranslation("finalExams");

    const rules = [
        {
            icon: CheckCircle,
            text: t("preExam.rules.readCarefully"),
        },
        {
            icon: XCircle,
            text: t("preExam.rules.noRefresh"),
        },
        {
            icon: Timer,
            text: t("preExam.rules.timerCantPause"),
        },
        {
            icon: Wifi,
            text: t("preExam.rules.stableConnection"),
        },
    ];

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {exam.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t("preExam.readInstructions")}
                </p>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Duration */}
                    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-brand-100 dark:bg-brand-500/20">
                                <Clock className="size-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("preExam.duration")}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {exam.duration} {t("minutes")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-brand-100 dark:bg-brand-500/20">
                                <List className="size-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("preExam.questionsLabel")}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {exam.questionsCount} {t("questions")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Attempts */}
                    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-brand-100 dark:bg-brand-500/20">
                                <AlertTriangle className="size-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("preExam.attempts")}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t("preExam.oneAttemptOnly")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-brand-100 dark:bg-brand-500/20">
                                <Calendar className="size-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t("preExam.availability")}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {exam.availableUntil || t("preExam.availableNow")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Rules */}
                <div className="bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-2 rounded-full bg-warning-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t("preExam.importantRules")}
                        </h3>
                    </div>
                    <ul className="space-y-3">
                        {rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <rule.icon className="size-5 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {rule.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Agreement Checkbox */}
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => onAgreeChange(e.target.checked)}
                        className="size-5 rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t("preExam.agreeToStart")}
                    </span>
                </label>

                {/* Start Button */}
                <button
                    onClick={onStartExam}
                    disabled={!isAgreed || isStarting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isStarting ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            {t("preExam.starting")}
                        </>
                    ) : (
                        <>
                            {t("preExam.startExamNow")}
                            <ArrowRight className="size-5" />
                        </>
                    )}
                </button>

                {/* Timer Warning */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-2">
                    <Clock className="size-4" />
                    {t("preExam.timerWarning")}
                </p>
            </div>
        </PageWrapper>
    );
}

export default PreExam;
