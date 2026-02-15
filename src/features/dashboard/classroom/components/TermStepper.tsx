import { useEffect, useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import { useProgramsCurriculumList } from "../../admin/programs";
import { Tooltip } from "@/design-system";

export type TermStatus = "completed" | "current" | "locked";

export interface Term {
    id: number;
    name: string;
    caption: string;
    order: number;
    status: TermStatus;
}

interface TermStepperProps {
    terms: Term[];
    selectedTermId: number | undefined;
    onSelectTerm: (termId: number) => void;
    isLoading?: boolean;
    className?: string;
    tipText?: string;
}

export function TermStepper({
    terms,
    selectedTermId,
    onSelectTerm,
    className,
    isLoading,
    tipText,
}: TermStepperProps) {
    const getStepStyles = (status: TermStatus, isSelected: boolean) => {
        switch (status) {
            case "completed":
                return {
                    circle: isSelected
                        ? "bg-success-600 text-white border-success-600 ring-4 ring-success-100"
                        : "bg-success-500 text-white border-success-500",
                    label: isSelected
                        ? "text-success-600 font-semibold"
                        : "text-success-500 font-medium",
                    clickable: true,
                };
            case "current":
                return {
                    circle: isSelected
                        ? "bg-brand-500 text-white border-brand-500 ring-4 ring-brand-100"
                        : "bg-white dark:bg-gray-800 text-brand-500 border-brand-500 border-2",
                    label: isSelected
                        ? "text-brand-600 font-semibold"
                        : "text-brand-500 font-medium",
                    clickable: true,
                };
            case "locked":
                return {
                    circle: "bg-gray-200 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600",
                    label: "text-gray-400 dark:text-gray-500",
                    clickable: false,
                };
        }
    };

    const handleTermClick = (term: Term, termId: number) => {
        if (term.status === "completed" || term.status === "current") {
            const term = terms.find((t) => t.id === termId);
            if (term && term.status !== "locked") {
                onSelectTerm(termId);
            }
        }
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {terms.map((term, index) => {
                const isSelected = term.id === selectedTermId;
                const styles = getStepStyles(term.status, isSelected);
                const isLast = index === terms.length - 1;

                return (
                    <div key={term.id} className="flex items-center">
                        {/* Step */}
                        <Tooltip
                            content={tipText}
                            placement="top"
                            disabled={term.status !== "locked"}
                            childClassName="w-[200px]"
                        >
                            <button
                                type="button"
                                onClick={() => handleTermClick(term, term.id)}
                                disabled={term.status === "locked" || isLoading}
                                className={`flex flex-col items-center ${
                                    styles.clickable
                                        ? "cursor-pointer hover:opacity-80"
                                        : "cursor-not-allowed"
                                } transition-opacity disabled:opacity-50`}
                            >
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${styles.circle}`}
                                >
                                    {term.status === "completed" ? (
                                        <Check className="w-5 h-5" />
                                    ) : term.status === "locked" ? (
                                        <Lock className="w-4 h-4" />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                {/* Label */}
                                <span
                                    className={`mt-2 text-sm whitespace-nowrap transition-colors ${styles.label}`}
                                >
                                    {term.caption}
                                </span>
                            </button>
                        </Tooltip>

                        {/* Connector Line */}
                        {!isLast && (
                            <div
                                className={`w-20 md:w-32 h-0.5 mx-2 ${
                                    term.status === "completed"
                                        ? "bg-success-500"
                                        : "bg-gray-300 dark:bg-gray-600"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export const useCurriculumTerms = () => {
    const { data: curriculumData, isLoading: isLoadingCurriculum } =
        useProgramsCurriculumList();

    const curriculums = curriculumData ?? [];

    const [selectedTermId, setSelectedTermId] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (selectedTermId) return;
        if (curriculums.length === 0) return;

        const activeCurriculum = curriculums.find((c) => c.isActive);
        if (activeCurriculum) {
            setSelectedTermId(activeCurriculum.id);
            return;
        }

        if (curriculums[0]) {
            setSelectedTermId(curriculums[0].id);
        }
    }, [curriculums, selectedTermId]);

    const terms: Term[] = useMemo(() => {
        if (!curriculums.length) return [];

        return curriculums.map((curriculum, index) => {
            const isActive = Boolean(curriculum.isActive);
            const status: TermStatus = isActive ? "current" : "locked";

            return {
                id: curriculum.id,
                name: curriculum.name,
                caption: curriculum.caption || "",
                order: index + 1,
                status,
            };
        });
    }, [curriculums]);

    return {
        curriculums,
        isLoadingCurriculum,
        selectedTermId,
        setSelectedTermId,
        terms,
    };
};

export default TermStepper;
