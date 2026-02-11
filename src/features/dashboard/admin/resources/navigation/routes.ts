import { RouteConfig } from "@/router";

export const resourcesRoutes: RouteConfig[] = [
    // Resources Management (Folders List)
    {
        path: "resources",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/ResourcesManagement"),
        meta: { titleKey: "adminResources:title" },
        handle: { crumb: "adminResources:title" },
    },
    // Folder SiteMap (placeholder for /resources/folder)
    {
        path: "resources/folder",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/site_map/FolderSiteMap"),
        meta: { titleKey: "adminResources:sitemap.folder.title" },
        handle: { crumb: "adminResources:breadcrumb.folder" },
    },
    // Create Folder
    {
        path: "resources/folder/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/CreateFolder"),
        meta: { titleKey: "adminResources:folder.create" },
        handle: { crumb: "adminResources:folder.create" },
    },
    // Folder Details (Resources List)
    {
        path: "resources/folder/:folderId",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/FolderDetails"),
        meta: { titleKey: "adminResources:title" },
        handle: { crumb: "adminResources:folder.title" },
    },
    // Edit Folder
    {
        path: "resources/folder/:folderId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditFolder"),
        meta: { titleKey: "adminResources:folder.edit" },
        handle: { crumb: "adminResources:folder.edit" },
    },
    // Resource SiteMap (placeholder for /resources/folder/:folderId/resource)
    {
        path: "resources/folder/:folderId/resource",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/site_map/ResourceSiteMap"),
        meta: { titleKey: "adminResources:sitemap.resource.title" },
        handle: { crumb: "adminResources:breadcrumb.resource" },
    },
    // Add Resource
    {
        path: "resources/folder/:folderId/resource/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/AddResource"),
        meta: { titleKey: "adminResources:resource.add" },
        handle: { crumb: "adminResources:resource.add" },
    },
    // Edit Resource
    {
        path: "resources/folder/:folderId/resource/:resourceId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditResource"),
        meta: { titleKey: "adminResources:resource.edit" },
        handle: { crumb: "adminResources:resource.edit" },
    },
];
