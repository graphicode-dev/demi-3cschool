import { purchases } from "../pages/purchases/navigation/paths";
import { coupons } from "../pages/coupons/navigation";
import { priceLists } from "../pages/pricelists/navigation";
import { payments } from "../pages/installments/navigation/paths";
import { SALES_BASE_PATH } from "./constants";

export const salesPaths = {
    /**
     * Root sales path
     */
    root: () => SALES_BASE_PATH,

    /**
     * Coupons paths
     */
    coupons,

    /**
     * Price Lists paths
     */
    priceLists,

    /**
     * Purchases paths
     */
    purchases,

    /**
     * Payments paths
     */
    payments,
} as const;
