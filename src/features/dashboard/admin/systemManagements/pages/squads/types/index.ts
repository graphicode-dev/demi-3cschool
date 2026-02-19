// ============================================================================
// Squad Types — based on real API responses
// ============================================================================

export type SquadType = "CORE" | "EXECUTION";

export interface Squad {
    id: number;
    name: string;
    caption: string;
    type: SquadType;
    typeLabel: string;
    description: string;
    isActive: boolean;
    membersCount: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Squad Members
// ============================================================================

export interface SquadMemberRole {
    id: number;
    name: string;
    caption: string;
}

export interface SquadMember {
    id: number;
    name: string;
    email: string;
    image: string;
    role: SquadMemberRole;
}

export interface SquadMemberGroup {
    roleGroup: string;
    members: SquadMember[];
}

export interface SquadMembersData {
    squad: Omit<Squad, "createdAt" | "updatedAt">;
    lead: SquadMember | null;
    groups: SquadMemberGroup[];
}

// ============================================================================
// Squad Stats
// ============================================================================

export interface SquadStats {
    totalSquads: number;
    activeSquads: number;
    executionSquads: number;
    coreSquads: number;
    squadsByType: Record<string, number>;
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface CreateSquadPayload {
    name: string;
    caption: string;
    type: SquadType;
    description: string;
    isActive?: boolean;
}

export interface UpdateSquadPayload {
    name?: string;
    caption?: string;
    type?: SquadType;
    description?: string;
    isActive?: boolean;
}

export interface AssignSquadMembersPayload {
    userIds: number[];
}

export interface AssignGroupToSquadPayload {
    squad_id: number;
}
