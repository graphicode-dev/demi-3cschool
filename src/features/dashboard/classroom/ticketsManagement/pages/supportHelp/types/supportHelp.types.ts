/**
 * Support Help Feature - Domain Types
 *
 * Types for the student-facing Support & Help feature.
 */

// ============================================================================
// Enums
// ============================================================================

export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type MessageSender = "student" | "support";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Message in a support ticket conversation
 */
export interface SupportMessage {
    id: string;
    ticketId: string;
    sender: MessageSender;
    senderName: string;
    content: string;
    createdAt: string;
}

/**
 * Support ticket entity for students
 */
export interface SupportTicket {
    id: string;
    ticketNumber: string;
    subject: string;
    description?: string;
    status: SupportTicketStatus;
    category?: string;
    createdAt: string;
    updatedAt: string;
    messages: SupportMessage[];
    attachmentUrl?: string;
}

/**
 * Support ticket list item (lighter version for list display)
 */
export interface SupportTicketListItem {
    id: string;
    ticketNumber: string;
    subject: string;
    status: SupportTicketStatus;
    createdAt: string;
    messageCount: number;
}

// ============================================================================
// Filter Types
// ============================================================================

export type SupportTicketFilter = "all" | SupportTicketStatus;

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create support ticket payload
 */
export interface CreateSupportTicketPayload {
    subject: string;
    description: string;
    attachmentUrl?: string;
}

/**
 * Send message payload
 */
export interface SendSupportMessagePayload {
    ticketId: string;
    content: string;
}
