import { TICKETS_BASE_PATH } from "../../../navigation/constants";

/**
 * Support Block paths
 */
export const supportBlock = {
    root: () => `${TICKETS_BASE_PATH}/support-block`,
    manageTeam: () => `${TICKETS_BASE_PATH}/support-block/manage`,
    // Lead paths
    addLead: () => `${TICKETS_BASE_PATH}/support-block/manage/lead/add`,
    editLead: (id: string) =>
        `${TICKETS_BASE_PATH}/support-block/manage/lead/${id}/edit`,
    changeLeadBlock: (id: string) =>
        `${TICKETS_BASE_PATH}/support-block/manage/lead/${id}/change-block`,
    convertLeadToAgent: (id: string) =>
        `${TICKETS_BASE_PATH}/support-block/manage/lead/${id}/convert`,
    // Agent paths
    addAgent: () => `${TICKETS_BASE_PATH}/support-block/manage/agent/add`,
    editAgent: (id: string) =>
        `${TICKETS_BASE_PATH}/support-block/manage/agent/${id}/edit`,
    promoteAgentToLead: (id: string) =>
        `${TICKETS_BASE_PATH}/support-block/manage/agent/${id}/promote`,
};

export const supportBlockPaths = {
    supportBlockRoot: supportBlock.root,
    manageTeam: supportBlock.manageTeam,
    addLead: supportBlock.addLead,
    editLead: supportBlock.editLead,
    changeLeadBlock: supportBlock.changeLeadBlock,
    convertLeadToAgent: supportBlock.convertLeadToAgent,
    addAgent: supportBlock.addAgent,
    editAgent: supportBlock.editAgent,
    promoteAgentToLead: supportBlock.promoteAgentToLead,
};
