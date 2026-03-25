import type { RouteConfig } from "@/router/routes.types";
import { Navigate } from "react-router-dom";
import { purchaseRoutes } from "../pages/purchases/navigation/routes";
import { couponsRoutes } from "../pages/coupons/navigation";
import { priceListsRoutes } from "../pages/pricelists/navigation";
import { subscriptionRoutes } from "../pages/installments/navigation/routes";

export const salesSubscriptionRoutes: RouteConfig[] = [
    {
        path: "sales",
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
];
