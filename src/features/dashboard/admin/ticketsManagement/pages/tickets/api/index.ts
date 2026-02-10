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
    RawTicketMessage,
    TicketMessage,
    RawInternalNote,
    InternalNote,
    RawTicket,
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
    DeleteNotePayload,
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
    useTicketMessages,
    useTicketNotes,
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
    useMarkMessagesRead,
    useAddNote,
    useDeleteNote,
} from "./tickets.mutations";
