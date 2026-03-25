import type { RouteConfig } from "@/router";

// const { levelPrice } = salesPermissions;

/**
 * Price Lists feature routes
 *
 * These are imported and spread into the main sales_subscription routes.
 */
export const priceListsRoutes: RouteConfig[] = [
    {
        path: "price-lists",
        lazy: () =>
            import("../pages/PriceListsList").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:priceLists.title",
        },
        meta: {
            title: "Price Lists",
            titleKey: "sales_subscription:priceLists.title",
            requiresAuth: true,
        },
        // permissions: [levelPrice.viewAny],
    },
    {
        path: "price-lists/create",
        lazy: () =>
            import("../pages/PriceListCreate").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:priceLists.actions.createNew",
        },
        meta: {
            title: "Create Price List",
            titleKey: "sales_subscription:priceLists.actions.createNew",
            requiresAuth: true,
        },
        // permissions: [levelPrice.create],
    },
    {
        path: "price-lists/view/:id",
        lazy: () =>
            import("../pages/PriceListDetail").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Price List Details",
            requiresAuth: true,
        },
        // permissions: [levelPrice.view],
    },
    {
        path: "price-lists/edit/:id",
        lazy: () =>
            import("../pages/PriceListEdit").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:priceLists.actions.edit",
        },
        meta: {
            title: "Edit Price List",
            titleKey: "sales_subscription:priceLists.actions.edit",
            requiresAuth: true,
        },
        // permissions: [levelPrice.update],
    },
];
