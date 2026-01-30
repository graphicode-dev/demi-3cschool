/**
 * Tickets Feature - Domain Types
 *
 * Types for the Tickets domain including:
 * - Ticket entity
 * - Message entity
 * - InternalNote entity
 * - Filter types
 */

// ============================================================================
// Enums - Reuse from overview where applicable
// ============================================================================

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type RequesterType = "student" | "instructor" | "parent";

export type MessageSender = "requester" | "agent";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Requester information
 */
export interface Requester {
    id: string;
    name: string;
    email: string;
    type: RequesterType;
    avatar?: string;
    block?: string;
}

/**
 * Message in a ticket conversation
 */
export interface TicketMessage {
    id: string;
    ticketId: string;
    sender: MessageSender;
    senderName: string;
    senderType?: RequesterType | "agent";
    content: string;
    createdAt: string;
}

/**
 * Internal note on a ticket
 */
export interface InternalNote {
    id: string;
    ticketId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
}

/**
 * Ticket entity
 */
export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    requester: Requester;
    assignedAgentId?: string;
    assignedAgentName?: string;
    category?: string;
    blockId?: string;
    blockName?: string;
    createdAt: string;
    updatedAt: string;
    messages: TicketMessage[];
    internalNotes: InternalNote[];
}

/**
 * Ticket list item (lighter version for list display)
 */
export interface TicketListItem {
    id: string;
    ticketNumber: string;
    subject: string;
    status: TicketStatus;
    priority: TicketPriority;
    requesterName: string;
    requesterType: RequesterType;
    requesterAvatar?: string;
    assignedAgentName?: string;
    createdAt: string;
    messageCount: number;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Ticket list filters
 */
export interface TicketFilters {
    search?: string;
    status?: TicketStatus | "all";
    agentId?: string | "all";
    blockId?: string | "all";
    priority?: TicketPriority | "all";
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Paginated ticket list data
 */
export interface PaginatedTicketData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    total: number;
    items: TicketListItem[];
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Send message payload
 */
export interface SendMessagePayload {
    ticketId: string;
    content: string;
}

/**
 * Add internal note payload
 */
export interface AddNotePayload {
    ticketId: string;
    content: string;
}

/**
 * Update ticket payload
 */
export interface UpdateTicketPayload {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedAgentId?: string;
}
