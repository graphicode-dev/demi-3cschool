import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { authStore } from "@/auth/auth.store";
import { useProfile } from "@/features/auth/api";
import { acceptanceTest } from "../navigation/paths";
import { USE_MOCK_DATA, MOCK_ACCEPTANCE_STATUS } from "../mocks";

export type AcceptanceExamStatus =
    | "pending"
    | "waiting"
    | "rejected"
    | "accepted";

interface AcceptanceExamGuardProps {
    children: React.ReactNode;
}

export function AcceptanceExamGuard({ children }: AcceptanceExamGuardProps) {
    const user = authStore((state) => state.user);
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const loc = useLocation();
    const hasFetchedRef = useRef(false);

    // Fetch profile to ensure we have latest user data
    const { refetch: fetchProfile } = useProfile({ enabled: false });

    useEffect(() => {
        if (isAuthenticated && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchProfile();
        }
    }, [isAuthenticated, fetchProfile]);

    // If not authenticated, let DashboardLayout handle the redirect
    // (DashboardLayout already has auth check)
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    // Only apply this guard to students
    const userRole = user?.role?.name?.toLowerCase();
    if (userRole !== "student") {
        // Non-students (admin, teacher) bypass this guard
        return <>{children}</>;
    }

    // Get acceptance exam status from user or use mock data for testing
    const acceptanceExamStatus: AcceptanceExamStatus =  (user?.userInformation?.acceptanceExam as AcceptanceExamStatus) ||
          "pending";

    switch (acceptanceExamStatus) {
        case "accepted":
            // Student has passed acceptance exam, allow access to dashboard
            return <>{children}</>;

        case "pending":
            // Student hasn't started the acceptance test yet
            return (
                <Navigate
                    to={acceptanceTest.main()}
                    replace
                    state={{ from: loc }}
                />
            );

        case "waiting":
            // Student submitted test and waiting for result
            return (
                <Navigate
                    to={acceptanceTest.waiting()}
                    replace
                    state={{ from: loc }}
                />
            );

        case "rejected":
            // Student was rejected
            return (
                <Navigate
                    to={acceptanceTest.rejected()}
                    replace
                    state={{ from: loc }}
                />
            );

        default:
            // Default to pending behavior
            return (
                <Navigate
                    to={acceptanceTest.main()}
                    replace
                    state={{ from: loc }}
                />
            );
    }
}
