/**
 * AcceptanceExamRouteGuard
 *
 * Protects acceptance exam routes based on user's acceptanceExam status.
 * - If status is "accepted", redirect to classroom profile (user already passed)
 * - If status is "pending", show main exam page
 * - If status is "waiting", show waiting page
 * - If status is "rejected", show rejected page
 */

import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { authStore } from "@/auth/auth.store";
import { acceptanceTest } from "../navigation";
import { CLASSROOM_PATH } from "../../navigation/constant";
import type { AcceptanceExamStatus } from "../types";

export function AcceptanceExamRouteGuard() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authStore((state) => state.user);

    const userRole = user?.role?.name?.toLowerCase();
    const isStudent = userRole === "student";

    // Only students have acceptance exam requirement
    // Non-students bypass with "accepted" status
    const rawStatus = user?.userInformation?.acceptanceExam as
        | AcceptanceExamStatus
        | null
        | undefined;

    // TEMPORARY: Bypassed until backend is ready - uncomment when ready
    // console.log("AcceptanceExamRouteGuard Debug:", {
    //     userRole,
    //     isStudent,
    //     rawStatus,
    //     userInformation: user?.userInformation,
    // });

    // TODO: Uncomment when backend is ready
    // const acceptanceExamStatus: AcceptanceExamStatus = isStudent
    //     ? rawStatus || "pending" // Students: null/undefined defaults to "pending"
    //     : "accepted"; // Non-students: bypass
    const acceptanceExamStatus: AcceptanceExamStatus = "accepted"; // TEMPORARY: Bypass

    useEffect(() => {
        if (!user) return;

        const { pathname } = location;

        // If user has already passed the exam (or is non-student), redirect to profile
        if (acceptanceExamStatus === "accepted") {
            navigate(`${CLASSROOM_PATH}/profile`, { replace: true });
            return;
        }

        // Route user to correct page based on their status
        const isMainPage =
            pathname === acceptanceTest.main() ||
            pathname === `${acceptanceTest.main()}/`;
        const isWaitingPage = pathname.includes("/waiting");
        const isRejectedPage = pathname.includes("/rejected");

        console.log("acceptanceExamStatus", acceptanceExamStatus);

        switch (acceptanceExamStatus) {
            case "pending":
                // User should be on main exam page
                if (!isMainPage) {
                    navigate(acceptanceTest.main(), { replace: true });
                }
                break;
            case "waiting":
                // User should be on waiting page
                if (!isWaitingPage) {
                    navigate(acceptanceTest.waiting(), { replace: true });
                }
                break;
            case "rejected":
                // User should be on rejected page
                if (!isRejectedPage) {
                    navigate(acceptanceTest.rejected(), { replace: true });
                }
                break;
        }
    }, [acceptanceExamStatus, user, location, navigate]);

    // If accepted (or non-student), don't render anything (redirect will happen)
    if (acceptanceExamStatus === "accepted") {
        return null;
    }

    return <Outlet />;
}

export default AcceptanceExamRouteGuard;
