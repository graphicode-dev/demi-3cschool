/**
 * Tickets Feature - API Module
 *
 * Public exports for the tickets API layer.
 */

// Types
export type {
    TicketStatus,
    TicketPriority,
    TicketCategory,
    RequesterType,
    MessageSender,
    TicketUser,
    TicketSupportBlock,
    TicketAssignedAgent,
    Requester,
    TicketMessage,
    InternalNote,
    Ticket,
    TicketListItem,
    TicketFilters,
    PaginatedTicketData,
    TicketsStats,
    CreateTicketPayload,
    UpdateTicketPayload,
    AssignTicketPayload,
    UpdateTicketStatusPayload,
    UpdateTicketPriorityPayload,
    SendMessagePayload,
    AddNotePayload,
} from "../types";

// Query Keys
export { ticketsKeys, type TicketsQueryKey } from "./tickets.keys";

// API Functions
export { ticketsApi } from "./tickets.api";

// Query Hooks
export {
    useTicketsList,
    useUnassignedTickets,
    useTicketsStats,
    useTicket,
    useFilterOptions,
} from "./tickets.queries";

// Mutation Hooks
export {
    useCreateTicket,
    useUpdateTicket,
    useDeleteTicket,
    useAssignTicket,
    useUpdateTicketStatus,
    useUpdateTicketPriority,
    useSendMessage,
    useAddNote,
} from "./tickets.mutations";
