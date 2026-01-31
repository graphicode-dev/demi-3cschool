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

import { registerFeaturePaths } from "@/router/paths.registry";
import { overview, overviewPaths } from "../pages/overview/navigation/paths";
import {
    teamStructure,
    teamStructurePaths,
} from "../pages/teamStructure/navigation/paths";
import { tickets, ticketsPagePaths } from "../pages/tickets/navigation/paths";
import {
    distribution,
    distributionPaths,
} from "../pages/distribution/navigation/paths";
import {
    performance,
    performancePaths,
} from "../pages/performance/navigation/paths";
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
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const ticketsManagementPaths = registerFeaturePaths(
    "ticketsManagement",
    {
        root: ticketsPaths.root,
        // Overview
        ...overviewPaths,
        // Team Structure
        ...teamStructurePaths,
        // Tickets
        ...ticketsPagePaths,
        // Distribution
        ...distributionPaths,
        // Performance
        ...performancePaths,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type TicketsPaths = typeof ticketsPaths;
