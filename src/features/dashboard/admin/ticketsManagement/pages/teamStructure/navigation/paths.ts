import { TICKETS_BASE_PATH } from "../../../navigation/constants";

/**
 * Team Structure paths
 */
export const teamStructure = {
    root: () => `${TICKETS_BASE_PATH}/team-structure`,
    manageTeam: () => `${TICKETS_BASE_PATH}/team-structure/manage`,
    // Lead paths
    addLead: () => `${TICKETS_BASE_PATH}/team-structure/manage/lead/add`,
    editLead: (id: string) =>
        `${TICKETS_BASE_PATH}/team-structure/manage/lead/${id}/edit`,
    changeLeadBlock: (id: string) =>
        `${TICKETS_BASE_PATH}/team-structure/manage/lead/${id}/change-block`,
    convertLeadToAgent: (id: string) =>
        `${TICKETS_BASE_PATH}/team-structure/manage/lead/${id}/convert`,
    // Agent paths
    addAgent: () => `${TICKETS_BASE_PATH}/team-structure/manage/agent/add`,
    editAgent: (id: string) =>
        `${TICKETS_BASE_PATH}/team-structure/manage/agent/${id}/edit`,
    promoteAgentToLead: (id: string) =>
        `${TICKETS_BASE_PATH}/team-structure/manage/agent/${id}/promote`,
};

export const teamStructurePaths = {
    teamStructureRoot: teamStructure.root,
    manageTeam: teamStructure.manageTeam,
    addLead: teamStructure.addLead,
    editLead: teamStructure.editLead,
    changeLeadBlock: teamStructure.changeLeadBlock,
    convertLeadToAgent: teamStructure.convertLeadToAgent,
    addAgent: teamStructure.addAgent,
    editAgent: teamStructure.editAgent,
    promoteAgentToLead: teamStructure.promoteAgentToLead,
};
