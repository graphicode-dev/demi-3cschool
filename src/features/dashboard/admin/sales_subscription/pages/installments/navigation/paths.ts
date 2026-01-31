/**
 * Subscriptions Feature - Path Builders
 */

import { SALES_BASE_PATH } from "@/features/dashboard/admin/sales_subscription/navigation/constants";

/**
 * Payments paths
 */
export const payments = {
    list: () => `${SALES_BASE_PATH}/payments`,
    pay: (id: string | number) => `${SALES_BASE_PATH}/payments/pay/${id}`,
};

export const paymentsSubscriptionPaths = {
    paymentsList: payments.list,
    paymentsPay: payments.pay,
};
