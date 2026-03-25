import { salesPaths } from "./paths";
import type { NavItem } from "@/navigation/nav.types";

export const salesSubscriptionNav: NavItem = {
    key: "sales",
    labelKey: "sales_subscription:salesAnalysis.title",
    label: "Sales",
    href: salesPaths.coupons.root(),
    roles: ["admin", "super_admin"],
    children: [
        {
            key: "coupons",
            labelKey: "sales_subscription:coupons.title",
            label: "Coupons",
            href: salesPaths.coupons.root(),
        },
        {
            key: "price-lists",
            labelKey: "sales_subscription:priceLists.title",
            label: "Price Lists",
            href: salesPaths.priceLists.list(),
        },
        {
            key: "purchases",
            labelKey: "sales_subscription:purchases.title",
            label: "Purchases",
            href: salesPaths.purchases.list(),
        },
        {
            key: "installments",
            labelKey: "sales_subscription:installments.title",
            label: "Installments",
            href: salesPaths.payments.list(),
        },
    ],
};

export default salesSubscriptionNav;
