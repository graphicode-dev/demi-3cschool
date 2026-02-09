import { RouteConfig } from "@/router";

export const resourcesRoutes: RouteConfig[] = [
    // Resources Management (Folders List)
    {
        path: "resources",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/ResourcesManagement"),
        meta: { titleKey: "resources:title" },
        handle: { crumb: "resources:title" },
    },
    // Folder SiteMap (placeholder for /resources/folder)
    {
        path: "resources/folder",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/site_map/FolderSiteMap"),
        meta: { titleKey: "resources:sitemap.folder.title" },
        handle: { crumb: "resources:breadcrumb.folder" },
    },
    // Create Folder
    {
        path: "resources/folder/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/CreateFolder"),
        meta: { titleKey: "resources:folder.create" },
        handle: { crumb: "resources:folder.create" },
    },
    // Folder Details (Resources List)
    {
        path: "resources/folder/:folderId",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/FolderDetails"),
        meta: { titleKey: "resources:title" },
        handle: { crumb: "resources:folder.title" },
    },
    // Edit Folder
    {
        path: "resources/folder/:folderId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditFolder"),
        meta: { titleKey: "resources:folder.edit" },
        handle: { crumb: "resources:folder.edit" },
    },
    // Resource SiteMap (placeholder for /resources/folder/:folderId/resource)
    {
        path: "resources/folder/:folderId/resource",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/site_map/ResourceSiteMap"),
        meta: { titleKey: "resources:sitemap.resource.title" },
        handle: { crumb: "resources:breadcrumb.resource" },
    },
    // Add Resource
    {
        path: "resources/folder/:folderId/resource/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/AddResource"),
        meta: { titleKey: "resources:resource.add" },
        handle: { crumb: "resources:resource.add" },
    },
    // Edit Resource
    {
        path: "resources/folder/:folderId/resource/:resourceId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditResource"),
        meta: { titleKey: "resources:resource.edit" },
        handle: { crumb: "resources:resource.edit" },
    },
];
