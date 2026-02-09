/**
 * Tickets Management Feature - Path Builders
 *
 * Centralized, type-safe path builders for Tickets Management.
 *
 * @example
 * ```ts
 * import { ticketsPaths } from '@/features/ticketsManagement/navigation/paths';
 *
 * navigate(ticketsPaths.overview());
 * navigate(ticketsPaths.tickets());
 * ```
 */

import { overview } from "../pages/overview/navigation";
import { teamStructure } from "../pages/teamStructure/navigation";
import { tickets } from "../pages/tickets/navigation";
import { distribution } from "../pages/distribution/navigation";
import { performance } from "../pages/performance/navigation";
import { supportHelp } from "../pages/supportHelp/navigation";
import { TICKETS_BASE_PATH } from "./constants";

// ============================================================================
// Tickets Management Paths
// ============================================================================

export const ticketsPaths = {
    /**
     * Root tickets path
     */
    root: () => TICKETS_BASE_PATH,

    /**
     * Overview paths
     */
    overview: overview.root,

    /**
     * Team Structure path
     */
    teamStructure: teamStructure.root,

    /**
     * Tickets path
     */
    tickets: tickets.root,

    /**
     * Distribution path
     */
    distribution: distribution.root,

    /**
     * Performance path
     */
    performance: performance.root,

    /**
     * Support Help path
     */
    supportHelp: supportHelp.root,

    /**
     * Support Help Create path
     */
    supportHelpCreate: supportHelp.create,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type TicketsPaths = typeof ticketsPaths;
