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
// Enums
// ============================================================================

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketCategory =
    | "access"
    | "technical"
    | "billing"
    | "account"
    | "certificate"
    | "general";

export type RequesterType = "student" | "instructor" | "parent";

export type MessageSender = "requester" | "agent";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * User info within ticket
 */
export interface TicketUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Support block info within ticket
 */
export interface TicketSupportBlock {
    id: number;
    name: string;
    slug: string;
}

/**
 * Assigned agent info within ticket
 */
export interface TicketAssignedAgent {
    id: number;
    userId: number;
    name: string;
    email: string;
}

/**
 * Raw ticket entity from API (internal use)
 */
export interface RawTicket {
    id: number;
    ticketNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    userId: number;
    supportBlockId: number;
    assignedAgentId: number | null;
    user: TicketUser;
    supportBlock: TicketSupportBlock;
    assignedAgent: TicketAssignedAgent | null;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Ticket entity with UI compatibility fields
 * Used throughout the application
 */
export interface Ticket extends Omit<RawTicket, "id"> {
    // Override id to be string for UI compatibility
    id: string;
    // UI compatibility fields (derived from user object)
    requesterName: string;
    requesterType: RequesterType;
    requesterAvatar?: string;
    assignedAgentName?: string;
    messageCount: number;
    // Requester object for UI components
    requester: Requester;
    // For full ticket detail view
    messages: TicketMessage[];
    internalNotes: InternalNote[];
}

/**
 * Ticket list item (same as Ticket)
 */
export type TicketListItem = Ticket;

// ============================================================================
// Legacy Types (for UI compatibility)
// ============================================================================

/**
 * @deprecated Use TicketUser instead
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
 * TODO: Update when messages API is provided
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
 * TODO: Update when notes API is provided
 */
export interface InternalNote {
    id: string;
    ticketId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
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
    items: TicketListItem[];
    total: number; // Computed from lastPage * perPage for UI compatibility
}

/**
 * Tickets stats response
 */
export interface TicketsStats {
    totalOpen: number;
    byStatus: {
        closed: number;
        inProgress: number;
        open: number;
        resolved: number;
    };
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create ticket payload
 */
export interface CreateTicketPayload {
    support_block_id: string;
    subject: string;
    description: string;
    priority: string;
    category: string;
}

/**
 * Update ticket payload (PUT)
 */
export interface UpdateTicketPayload {
    support_block_id?: string;
    subject?: string;
    description?: string;
    priority?: string;
    category?: string;
}

/**
 * Assign ticket payload
 */
export interface AssignTicketPayload {
    agentId: number;
}

/**
 * Update ticket status payload
 */
export interface UpdateTicketStatusPayload {
    status: TicketStatus;
}

/**
 * Update ticket priority payload
 */
export interface UpdateTicketPriorityPayload {
    priority: TicketPriority;
}

/**
 * Send message payload
 * TODO: Update when messages API is provided
 */
export interface SendMessagePayload {
    ticketId: string;
    content: string;
}

/**
 * Add internal note payload
 * TODO: Update when notes API is provided
 */
export interface AddNotePayload {
    ticketId: string;
    content: string;
}
