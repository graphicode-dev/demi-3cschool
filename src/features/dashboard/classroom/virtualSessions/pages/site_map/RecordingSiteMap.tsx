/**
 * RecordingSiteMap Page
 *
 * Placeholder page for /classroom/virtual-sessions/recording route.
 * Shows available recording-related routes to help users navigate.
 */

import { Video, List } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function RecordingSiteMap() {
    const routes: SiteMapRoute[] = [
        {
            path: "/classroom/virtual-sessions",
            labelKey: "virtualSessions:sitemap.routes.sessionsList",
            descriptionKey: "virtualSessions:sitemap.routes.sessionsListDesc",
            icon: List,
        },
    ];

    return (
        <FeatureSiteMap
            featureKey="virtualSessions"
            titleKey="virtualSessions:sitemap.recording.title"
            descriptionKey="virtualSessions:sitemap.recording.description"
            routes={routes}
            homePath="/classroom/virtual-sessions"
        />
    );
}

export default RecordingSiteMap;
