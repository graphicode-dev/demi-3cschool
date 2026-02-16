/**
 * ClassroomAcceptanceGuard
 *
 * Route-level guard that redirects students to the acceptance exam page
 * if they try to navigate to non-allowed routes during the acceptance exam phase.
 *
 * Allowed route prefixes during acceptance exam phase:
 * - /classroom/acceptance-exam (and sub-routes)
 * - /classroom/profile
 * - /classroom/support-help (tickets)
 */

import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { authStore } from "@/auth/auth.store";
import { CLASSROOM_PATH } from "../navigation/constant";
import type { AcceptanceExamStatus } from "../acceptanceTest/types";

// Route path prefixes allowed during acceptance exam phase (must be strings!)
const ALLOWED_ROUTE_PREFIXES = [
    `${CLASSROOM_PATH}/acceptance-exam`,
    `${CLASSROOM_PATH}/profile`,
    `${CLASSROOM_PATH}/support-help`,
];

export function ClassroomAcceptanceGuard() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = authStore((state) => state.user);

    const userRole = user?.role?.name?.toLowerCase();
    const isStudent = userRole === "student";

    const acceptanceExamStatus: AcceptanceExamStatus | null = isStudent
        ? (user?.userInformation?.acceptanceExam as AcceptanceExamStatus) ||
          "pending"
        : "accepted";

    const needsAcceptanceExam =
        isStudent && acceptanceExamStatus !== "accepted";

    useEffect(() => {
        if (!user || !needsAcceptanceExam) return;

        // Check if current path is allowed
        const isAllowed = ALLOWED_ROUTE_PREFIXES.some(
            (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
        );

        // Also allow the exact classroom root (it will redirect to profile anyway)
        const isClassroomRoot =
            pathname === CLASSROOM_PATH || pathname === `${CLASSROOM_PATH}/`;

        if (!isAllowed && !isClassroomRoot) {
            navigate(`${CLASSROOM_PATH}/acceptance-exam`, { replace: true });
        }
    }, [user, needsAcceptanceExam, pathname, navigate]);

    return <Outlet />;
}

export default ClassroomAcceptanceGuard;
