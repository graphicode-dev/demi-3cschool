import type { NavItem } from "@/navigation/nav.types";
import { ClipboardCheck } from "lucide-react";
import { acceptanceTestPaths } from "./paths";

/**
 * Acceptance Test Navigation
 * Shows in sidebar only when user's acceptance exam status !== accepted
 */
export const acceptanceTestNavItem: NavItem = {
    key: "acceptanceTest",
    labelKey: "acceptanceTest:nav.exam",
    label: "Acceptance Exam",
    href: acceptanceTestPaths.main(),
    icon: ClipboardCheck,
    order: -100,
};

export default acceptanceTestNavItem;
