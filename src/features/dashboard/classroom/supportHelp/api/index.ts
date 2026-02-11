/**
 * Support Help Feature - API Module
 *
 * Public exports for the support help API layer.
 */

// Types
export type {
    SupportTicketStatus,
    MessageSender,
    SupportMessage,
    SupportTicket,
    SupportTicketListItem,
    SupportTicketFilter,
    CreateSupportTicketPayload,
    SendSupportMessagePayload,
} from "../types";

// Query Keys
export { supportHelpKeys, type SupportHelpQueryKey } from "./supportHelp.keys";

// API Functions
export { supportHelpApi } from "./supportHelp.api";

// Query Hooks
export {
    useSupportTicketsList,
    useSupportTicket,
    useSupportTicketMessages,
} from "./supportHelp.queries";

// Mutation Hooks
export {
    useCreateSupportTicket,
    useSendSupportMessage,
    useMarkSupportMessagesRead,
} from "./supportHelp.mutations";
