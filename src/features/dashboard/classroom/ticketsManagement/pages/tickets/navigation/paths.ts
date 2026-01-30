import { TICKETS_BASE_PATH } from "../../../navigation/constants";

/**
 * Tickets paths
 */
export const tickets = {
    root: () => `${TICKETS_BASE_PATH}/tickets`,
};

export const ticketsPagePaths = {
    ticketsRoot: tickets.root,
};
