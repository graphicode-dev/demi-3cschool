/**
 * ResourceSiteMap Page
 *
 * Placeholder page for /admin/resources/folder/:folderId/resource route.
 * Shows available resource-related routes to help users navigate.
 */

import { useParams } from "react-router-dom";
import { FolderOpen, FilePlus, Pencil, FileText } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function ResourceSiteMap() {
    const { folderId, resourceId } = useParams<{
        folderId: string;
        resourceId?: string;
    }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/resources",
            labelKey: "adminResources:sitemap.routes.resourcesList",
            descriptionKey: "adminResources:sitemap.routes.resourcesListDesc",
            icon: FolderOpen,
        },
    ];

    if (folderId) {
        routes.push(
            {
                path: `/admin/resources/folder/${folderId}`,
                labelKey: "adminResources:sitemap.routes.folderDetails",
                descriptionKey:
                    "adminResources:sitemap.routes.folderDetailsDesc",
                icon: FolderOpen,
            },
            {
                path: `/admin/resources/folder/${folderId}/resource/create`,
                labelKey: "adminResources:sitemap.routes.addResource",
                descriptionKey: "adminResources:sitemap.routes.addResourceDesc",
                icon: FilePlus,
            }
        );
    }

    if (folderId && resourceId) {
        routes.push({
            path: `/admin/resources/folder/${folderId}/resource/${resourceId}/edit`,
            labelKey: "adminResources:sitemap.routes.editResource",
            descriptionKey: "adminResources:sitemap.routes.editResourceDesc",
            icon: Pencil,
        });
    }

    return (
        <FeatureSiteMap
            featureKey="resources"
            titleKey="adminResources:sitemap.resource.title"
            descriptionKey="adminResources:sitemap.resource.description"
            routes={routes}
            homePath={
                folderId
                    ? `/admin/resources/folder/${folderId}`
                    : "/admin/resources"
            }
        />
    );
}

export default ResourceSiteMap;
