export const resourcesPaths = {
    main: "/admin/resources",
    folder: {
        sitemap: "/admin/resources/folder",
        create: "/admin/resources/folder/create",
        details: (folderId: string) => `/admin/resources/folder/${folderId}`,
        edit: (folderId: string) => `/admin/resources/folder/${folderId}/edit`,
    },
    resource: {
        sitemap: (folderId: string) =>
            `/admin/resources/folder/${folderId}/resource`,
        create: (folderId: string) =>
            `/admin/resources/folder/${folderId}/resource/create`,
        edit: (folderId: string, resourceId: string) =>
            `/admin/resources/folder/${folderId}/resource/${resourceId}/edit`,
    },
} as const;
