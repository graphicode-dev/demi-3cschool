/**
 * GroupSiteMap Page
 *
 * Placeholder page for group intermediate routes like:
 * - /admin/groups/grades/:gradeId/levels/:levelId/group/view
 * - /admin/groups/grades/:gradeId/levels/:levelId/group/edit
 * - /admin/groups/grades/:gradeId/levels/:levelId/group/:id/attendance/session
 * - /admin/groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management/session
 *
 * Shows available group-related routes to help users navigate.
 */

import { useParams, useLocation } from "react-router-dom";
import {
    Users,
    Eye,
    Pencil,
    UserPlus,
    Calendar,
    GraduationCap,
    ClipboardList,
    List,
} from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function GroupSiteMap() {
    const { gradeId, levelId, id } = useParams<{
        gradeId: string;
        levelId: string;
        id?: string;
    }>();
    const { pathname } = useLocation();

    const isViewPath = pathname.includes("/view");
    const isEditPath = pathname.includes("/edit");
    const isAttendanceSessionPath = pathname.includes("/attendance/session");
    const isTeacherSessionPath = pathname.includes("/teacher-management/session");

    const basePath = `/admin/groups/grades/${gradeId}/levels/${levelId}/group`;

    const routes: SiteMapRoute[] = [
        {
            path: basePath,
            labelKey: "groupsManagement:sitemap.routes.groupsList",
            descriptionKey: "groupsManagement:sitemap.routes.groupsListDesc",
            icon: List,
        },
    ];

    if (id) {
        routes.push(
            {
                path: `${basePath}/view/${id}`,
                labelKey: "groupsManagement:sitemap.routes.viewGroup",
                descriptionKey: "groupsManagement:sitemap.routes.viewGroupDesc",
                icon: Eye,
            },
            {
                path: `${basePath}/edit/${id}`,
                labelKey: "groupsManagement:sitemap.routes.editGroup",
                descriptionKey: "groupsManagement:sitemap.routes.editGroupDesc",
                icon: Pencil,
            },
            {
                path: `${basePath}/${id}/assign`,
                labelKey: "groupsManagement:sitemap.routes.assignStudents",
                descriptionKey: "groupsManagement:sitemap.routes.assignStudentsDesc",
                icon: UserPlus,
            },
            {
                path: `${basePath}/${id}/attendance`,
                labelKey: "groupsManagement:sitemap.routes.attendance",
                descriptionKey: "groupsManagement:sitemap.routes.attendanceDesc",
                icon: Calendar,
            },
            {
                path: `${basePath}/${id}/instructor`,
                labelKey: "groupsManagement:sitemap.routes.instructor",
                descriptionKey: "groupsManagement:sitemap.routes.instructorDesc",
                icon: GraduationCap,
            },
            {
                path: `${basePath}/${id}/sessions`,
                labelKey: "groupsManagement:sitemap.routes.sessions",
                descriptionKey: "groupsManagement:sitemap.routes.sessionsDesc",
                icon: Calendar,
            },
            {
                path: `${basePath}/${id}/final-quiz`,
                labelKey: "groupsManagement:sitemap.routes.finalQuiz",
                descriptionKey: "groupsManagement:sitemap.routes.finalQuizDesc",
                icon: ClipboardList,
            }
        );
    }

    let titleKey = "groupsManagement:sitemap.group.title";
    let descriptionKey = "groupsManagement:sitemap.group.description";

    if (isViewPath) {
        titleKey = "groupsManagement:sitemap.group.viewTitle";
        descriptionKey = "groupsManagement:sitemap.group.viewDescription";
    } else if (isEditPath) {
        titleKey = "groupsManagement:sitemap.group.editTitle";
        descriptionKey = "groupsManagement:sitemap.group.editDescription";
    } else if (isAttendanceSessionPath) {
        titleKey = "groupsManagement:sitemap.group.attendanceSessionTitle";
        descriptionKey = "groupsManagement:sitemap.group.attendanceSessionDescription";
    } else if (isTeacherSessionPath) {
        titleKey = "groupsManagement:sitemap.group.teacherSessionTitle";
        descriptionKey = "groupsManagement:sitemap.group.teacherSessionDescription";
    }

    return (
        <FeatureSiteMap
            featureKey="groupsManagement"
            titleKey={titleKey}
            descriptionKey={descriptionKey}
            routes={routes}
            homePath={id ? `${basePath}/view/${id}` : basePath}
        />
    );
}

export default GroupSiteMap;
