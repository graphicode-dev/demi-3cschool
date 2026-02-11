/**
 * FolderSiteMap Page
 *
 * Placeholder page for /admin/resources/folder route.
 * Shows available folder-related routes to help users navigate.
 */

import { useParams } from "react-router-dom";
import { FolderOpen, FolderPlus, Pencil } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function FolderSiteMap() {
    const { folderId } = useParams<{ folderId?: string }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/resources",
            labelKey: "adminResources:sitemap.routes.resourcesList",
            descriptionKey: "adminResources:sitemap.routes.resourcesListDesc",
            icon: FolderOpen,
        },
        {
            path: "/admin/resources/folder/create",
            labelKey: "adminResources:sitemap.routes.createFolder",
            descriptionKey: "adminResources:sitemap.routes.createFolderDesc",
            icon: FolderPlus,
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
                path: `/admin/resources/folder/${folderId}/edit`,
                labelKey: "adminResources:sitemap.routes.editFolder",
                descriptionKey: "adminResources:sitemap.routes.editFolderDesc",
                icon: Pencil,
            }
        );
    }

    return (
        <FeatureSiteMap
            featureKey="resources"
            titleKey="adminResources:sitemap.folder.title"
            descriptionKey="adminResources:sitemap.folder.description"
            routes={routes}
            homePath="/admin/resources"
        />
    );
}

export default FolderSiteMap;
