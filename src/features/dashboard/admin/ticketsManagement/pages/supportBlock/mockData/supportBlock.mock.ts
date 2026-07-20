import type {
    SupportBlock,
    SupportBlockMember,
    SupportAgent,
    SupportBlocksListResponse,
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
    AddLeadPayload,
    AddAgentPayload,
    UpdateAgentStatusPayload,
    ReassignAgentPayload,
} from "../types";
import type { ListQueryParams, PaginatedData } from "@/shared/api";

export const mockSupportBlockMembers: SupportBlockMember[] = [
    { id: 1, userId: 101, name: "Sarah Ahmed", email: "sarah@example.com", status: "available", isLead: true },
    { id: 2, userId: 102, name: "Mohamed Ali", email: "mohamed@example.com", status: "busy", isLead: false },
    { id: 3, userId: 103, name: "Youssef Omar", email: "youssef@example.com", status: "available", isLead: false },
    { id: 4, userId: 104, name: "Nour Hasan", email: "nour@example.com", status: "offline", isLead: false },
    { id: 5, userId: 105, name: "Laila Khaled", email: "laila@example.com", status: "available", isLead: true },
];

export const mockSupportBlocks: SupportBlock[] = [
    {
        id: 1,
        name: "Main Campus",
        slug: "main-campus",
        description: "Handles general issues, portal access, registration, and courses for the main campus.",
        isActive: true,
        totalAgents: 3,
        availableAgents: 2,
        openTickets: 15,
        members: [
            mockSupportBlockMembers[0], // Sarah Ahmed (Lead)
            mockSupportBlockMembers[1], // Mohamed Ali
            mockSupportBlockMembers[2], // Youssef Omar
        ],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-07-18T10:00:00Z",
    },
    {
        id: 2,
        name: "Media Department",
        slug: "media-department",
        description: "Assists with technical issues related to class cameras, zoom, recorded lessons, and media upload.",
        isActive: true,
        totalAgents: 1,
        availableAgents: 0,
        openTickets: 12,
        members: [
            mockSupportBlockMembers[3], // Nour Hasan
        ],
        createdAt: "2026-01-02T00:00:00Z",
        updatedAt: "2026-07-19T09:00:00Z",
    },
    {
        id: 3,
        name: "Career Services",
        slug: "career-services",
        description: "Assists students and alumni with job placement support, internship requests, and resume formatting.",
        isActive: true,
        totalAgents: 1,
        availableAgents: 1,
        openTickets: 8,
        members: [
            mockSupportBlockMembers[4], // Laila Khaled (Lead)
        ],
        createdAt: "2026-01-03T00:00:00Z",
        updatedAt: "2026-07-17T11:00:00Z",
    },
];

export const mockSupportAgents: SupportAgent[] = [
    {
        id: 1,
        userId: 101,
        leadId: null,
        isLead: true,
        status: "available",
        user: { id: 101, name: "Sarah Ahmed", email: "sarah@example.com" },
        supportBlock: { id: 1, name: "Main Campus", slug: "main-campus" },
        lead: null,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-07-18T10:00:00Z",
    },
    {
        id: 2,
        userId: 102,
        leadId: 1,
        isLead: false,
        status: "busy",
        user: { id: 102, name: "Mohamed Ali", email: "mohamed@example.com" },
        supportBlock: { id: 1, name: "Main Campus", slug: "main-campus" },
        lead: { id: 1, userId: 101, name: "Sarah Ahmed", email: "sarah@example.com" },
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-07-18T10:00:00Z",
    },
    {
        id: 3,
        userId: 103,
        leadId: 1,
        isLead: false,
        status: "available",
        user: { id: 103, name: "Youssef Omar", email: "youssef@example.com" },
        supportBlock: { id: 1, name: "Main Campus", slug: "main-campus" },
        lead: { id: 1, userId: 101, name: "Sarah Ahmed", email: "sarah@example.com" },
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-07-18T10:00:00Z",
    },
    {
        id: 4,
        userId: 104,
        leadId: null,
        isLead: false,
        status: "offline",
        user: { id: 104, name: "Nour Hasan", email: "nour@example.com" },
        supportBlock: { id: 2, name: "Media Department", slug: "media-department" },
        lead: null,
        createdAt: "2026-01-02T00:00:00Z",
        updatedAt: "2026-07-19T09:00:00Z",
    },
    {
        id: 5,
        userId: 105,
        leadId: null,
        isLead: true,
        status: "available",
        user: { id: 105, name: "Laila Khaled", email: "laila@example.com" },
        supportBlock: { id: 3, name: "Career Services", slug: "career-services" },
        lead: null,
        createdAt: "2026-01-03T00:00:00Z",
        updatedAt: "2026-07-17T11:00:00Z",
    },
];

// Mutatable internal states for mock execution
let mutableSupportBlocks = [...mockSupportBlocks];
let mutableSupportAgents = [...mockSupportAgents];

export const resetSupportMocks = () => {
    mutableSupportBlocks = [...mockSupportBlocks];
    mutableSupportAgents = [...mockSupportAgents];
};

// ============================================================================
// Support Block Mock Operations
// ============================================================================

export const getMockSupportBlocksList = (page: number = 1): SupportBlocksListResponse => {
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const paginated = mutableSupportBlocks.slice(startIndex, startIndex + perPage);

    return {
        perPage,
        currentPage: page,
        lastPage: Math.ceil(mutableSupportBlocks.length / perPage) || 1,
        nextPageUrl: page * perPage < mutableSupportBlocks.length ? `?page=${page + 1}` : null,
        items: paginated,
    };
};

export const getMockSupportBlockById = (id: number | string): SupportBlock => {
    const block = mutableSupportBlocks.find((b) => String(b.id) === String(id));
    if (!block) throw new Error(`Support Block with ID ${id} not found`);

    // Dynamic members update
    const blockMembers = mutableSupportAgents
        .filter((sa) => String(sa.supportBlock.id) === String(id))
        .map((sa) => ({
            id: sa.id,
            userId: sa.userId,
            name: sa.user.name,
            email: sa.user.email,
            status: sa.status,
            isLead: sa.isLead,
        }));

    return {
        ...block,
        members: blockMembers,
        totalAgents: blockMembers.length,
        availableAgents: blockMembers.filter((m) => m.status === "available").length,
    };
};

export const createMockSupportBlock = (payload: CreateSupportBlockPayload): SupportBlock => {
    const newId = mutableSupportBlocks.length + 1;
    const newBlock: SupportBlock = {
        id: newId,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        isActive: payload.is_active === 1,
        totalAgents: 0,
        availableAgents: 0,
        openTickets: 0,
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mutableSupportBlocks.push(newBlock);
    return newBlock;
};

export const updateMockSupportBlock = (id: number | string, payload: UpdateSupportBlockPayload): SupportBlock => {
    const idx = mutableSupportBlocks.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) throw new Error(`Support Block with ID ${id} not found`);

    const original = mutableSupportBlocks[idx];
    const updated: SupportBlock = {
        ...original,
        ...payload,
        isActive: payload.is_active !== undefined ? payload.is_active === 1 : original.isActive,
        updatedAt: new Date().toISOString(),
    };
    mutableSupportBlocks[idx] = updated;
    return updated;
};

export const deleteMockSupportBlock = (id: number | string): void => {
    mutableSupportBlocks = mutableSupportBlocks.filter((b) => String(b.id) !== String(id));
    // Also clear agents associated
    mutableSupportAgents = mutableSupportAgents.filter((sa) => String(sa.supportBlock.id) !== String(id));
};

// ============================================================================
// Support Agent Mock Operations
// ============================================================================

export const getMockSupportAgentsByBlockId = (
    blockId: number | string,
    params: ListQueryParams
): PaginatedData<SupportAgent> => {
    const filtered = mutableSupportAgents.filter((sa) => String(sa.supportBlock.id) === String(blockId));
    const perPage = params.perPage ? Number(params.perPage) : 10;
    const page = params.page ? Number(params.page) : 1;
    const startIndex = (page - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    return {
        perPage,
        currentPage: page,
        lastPage: Math.ceil(filtered.length / perPage) || 1,
        nextPageUrl: page * perPage < filtered.length ? `?page=${page + 1}` : null,
        items: paginated,
    };
};

export const addMockLead = (payload: AddLeadPayload): SupportAgent => {
    const block = mutableSupportBlocks.find((b) => String(b.id) === String(payload.support_block_id));
    if (!block) throw new Error(`Support Block not found`);

    const newId = mutableSupportAgents.length + 1;
    const newAgent: SupportAgent = {
        id: newId,
        userId: Number(payload.user_id),
        leadId: null,
        isLead: true,
        status: "available",
        user: { id: Number(payload.user_id), name: `Lead Agent ${payload.user_id}`, email: `lead.${payload.user_id}@example.com` },
        supportBlock: { id: block.id, name: block.name, slug: block.slug },
        lead: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mutableSupportAgents.push(newAgent);
    return newAgent;
};

export const addMockAgent = (payload: AddAgentPayload): SupportAgent => {
    const block = mutableSupportBlocks.find((b) => String(b.id) === String(payload.support_block_id));
    if (!block) throw new Error(`Support Block not found`);

    const leadAgent = mutableSupportAgents.find((sa) => String(sa.id) === String(payload.lead_id));
    const leadInfo = leadAgent ? {
        id: leadAgent.id,
        userId: leadAgent.userId,
        name: leadAgent.user.name,
        email: leadAgent.user.email,
    } : null;

    const newId = mutableSupportAgents.length + 1;
    const newAgent: SupportAgent = {
        id: newId,
        userId: Number(payload.user_id),
        leadId: payload.lead_id ? Number(payload.lead_id) : null,
        isLead: false,
        status: "available",
        user: { id: Number(payload.user_id), name: `Support Agent ${payload.user_id}`, email: `agent.${payload.user_id}@example.com` },
        supportBlock: { id: block.id, name: block.name, slug: block.slug },
        lead: leadInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mutableSupportAgents.push(newAgent);
    return newAgent;
};

export const updateMockAgentStatus = (id: number | string, payload: UpdateAgentStatusPayload): SupportAgent => {
    const idx = mutableSupportAgents.findIndex((sa) => String(sa.id) === String(id));
    if (idx === -1) throw new Error(`Support Agent with ID ${id} not found`);

    const original = mutableSupportAgents[idx];
    const updated: SupportAgent = {
        ...original,
        status: payload.status,
        updatedAt: new Date().toISOString(),
    };
    mutableSupportAgents[idx] = updated;
    return updated;
};

export const reassignMockAgent = (id: number | string, payload: ReassignAgentPayload): SupportAgent => {
    const idx = mutableSupportAgents.findIndex((sa) => String(sa.id) === String(id));
    if (idx === -1) throw new Error(`Support Agent with ID ${id} not found`);

    const original = mutableSupportAgents[idx];
    const block = mutableSupportBlocks.find((b) => String(b.id) === String(payload.support_block_id));
    if (!block) throw new Error(`Support Block not found`);

    const leadAgent = payload.lead_id ? mutableSupportAgents.find((sa) => String(sa.id) === String(payload.lead_id)) : null;
    const leadInfo = leadAgent ? {
        id: leadAgent.id,
        userId: leadAgent.userId,
        name: leadAgent.user.name,
        email: leadAgent.user.email,
    } : null;

    const updated: SupportAgent = {
        ...original,
        supportBlock: { id: block.id, name: block.name, slug: block.slug },
        leadId: payload.lead_id ? Number(payload.lead_id) : null,
        lead: leadInfo,
        updatedAt: new Date().toISOString(),
    };
    mutableSupportAgents[idx] = updated;
    return updated;
};

export const removeMockAgent = (id: number | string): void => {
    mutableSupportAgents = mutableSupportAgents.filter((sa) => String(sa.id) !== String(id));
};
