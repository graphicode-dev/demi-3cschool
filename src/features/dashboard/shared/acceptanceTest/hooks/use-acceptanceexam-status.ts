import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "@/auth/auth.store";
import { AcceptanceExamStatus } from "../types";
import { acceptanceTest } from "../navigation";
import { paths } from "@/router";

interface UseAcceptanceExamStatusOptions {
    expectedStatus: AcceptanceExamStatus;
}

export function useAcceptanceExamStatus({
    expectedStatus,
}: UseAcceptanceExamStatusOptions) {
    const user = authStore((state) => state.user);
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const navigate = useNavigate();
    const hasRedirectedRef = useRef(false);

    const currentStatus = user?.userInformation?.acceptanceExam;

    useEffect(() => {
        if (!isAuthenticated || hasRedirectedRef.current) {
            return;
        }

        // If user's actual status doesn't match expected, redirect to correct page
        if (currentStatus && currentStatus !== expectedStatus) {
            hasRedirectedRef.current = true;
            switch (currentStatus) {
                case "accepted":
                    navigate(paths.dashboard.classroom.profile(), {
                        replace: true,
                    });
                    break;
                case "pending":
                    navigate(acceptanceTest.main(), { replace: true });
                    break;
                case "waiting":
                    navigate(acceptanceTest.waiting(), { replace: true });
                    break;
                case "rejected":
                    navigate(acceptanceTest.rejected(), { replace: true });
                    break;
            }
        }
    }, [currentStatus, expectedStatus, isAuthenticated, navigate]);

    return {
        currentStatus,
        isCorrectPage: currentStatus === expectedStatus,
        isLoading: !isAuthenticated,
    };
}
