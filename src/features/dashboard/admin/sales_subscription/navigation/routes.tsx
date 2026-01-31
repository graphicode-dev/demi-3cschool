/**
 * Sales Subscription Feature - Route Module
 *
 * Defines routes for the sales subscription feature.
 * Registers with the route registry for composition.
 */

import type { FeatureRouteModule } from "@/router/routes.types";
import { routeRegistry } from "@/router/routeRegistry";
import { Navigate } from "react-router-dom";
import { purchaseRoutes } from "../pages/purchases/navigation/routes";
import { couponsRoutes } from "../pages/coupons/navigation";
import { priceListsRoutes } from "../pages/pricelists/navigation";
import { subscriptionRoutes } from "../pages/installments/navigation/routes";

/**
 * Sales Subscription Route Module
 */
export const salesSubscriptionRouteModule: FeatureRouteModule = {
    id: "sales-subscription",
    name: "Sales Subscription",
    basePath: "/dashboard/sales",
    layout: "dashboard",
    routes: {
        children: [
            {
                index: true,
                element: <Navigate to="coupons" replace />,
            },

            // Coupons routes
            ...couponsRoutes,

            // Price Lists routes
            ...priceListsRoutes,

            // Purchases routes (imported from feature)
            ...purchaseRoutes,

            // Subscriptions routes (payments)
            ...subscriptionRoutes,
        ],
    },
};

// Register routes
routeRegistry.register(salesSubscriptionRouteModule);

export default salesSubscriptionRouteModule;
