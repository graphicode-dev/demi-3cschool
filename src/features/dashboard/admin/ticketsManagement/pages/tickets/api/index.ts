/**
 * Tickets Feature - API Module
 *
 * Public exports for the tickets API layer.
 */

// Types
export type {
    TicketStatus,
    TicketPriority,
    RequesterType,
    MessageSender,
    Requester,
    TicketMessage,
    InternalNote,
    Ticket,
    TicketListItem,
    TicketFilters,
    PaginatedTicketData,
    SendMessagePayload,
    AddNotePayload,
    UpdateTicketPayload,
} from "../types";

// Query Keys
export { ticketsKeys, type TicketsQueryKey } from "./tickets.keys";

// API Functions
export { ticketsApi } from "./tickets.api";

// Query Hooks
export { useTicketsList, useTicket, useFilterOptions } from "./tickets.queries";

// Mutation Hooks
export {
    useSendMessage,
    useAddNote,
    useUpdateTicket,
} from "./tickets.mutations";
