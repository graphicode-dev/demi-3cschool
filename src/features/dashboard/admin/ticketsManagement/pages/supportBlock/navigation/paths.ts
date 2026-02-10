import { TICKETS_BASE_PATH } from "../../../navigation/constants";

/**
 * Support Block paths
 */
export const supportBlock = {
    root: () => `${TICKETS_BASE_PATH}/support-block`,
    // Block-specific manage team (with blockId)
    manageTeam: (blockId: string | number) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage`,
    // Block paths
    addBlock: () => `${TICKETS_BASE_PATH}/support-block/add`,
    editBlock: (id: string | number) =>
        `${TICKETS_BASE_PATH}/support-block/${id}/edit`,
    // Lead paths (block-specific)
    addLead: (blockId: string | number) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/lead/add`,
    editLead: (blockId: string | number, id: string) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/lead/${id}/edit`,
    changeLeadBlock: (blockId: string | number, id: string) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/lead/${id}/change-block`,
    convertLeadToAgent: (blockId: string | number, id: string) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/lead/${id}/convert`,
    // Agent paths (block-specific)
    addAgent: (blockId: string | number) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/agent/add`,
    editAgent: (blockId: string | number, id: string) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/agent/${id}/edit`,
    promoteAgentToLead: (blockId: string | number, id: string) =>
        `${TICKETS_BASE_PATH}/support-block/${blockId}/manage/agent/${id}/promote`,
};

export const supportBlockPaths = {
    supportBlockRoot: supportBlock.root,
    manageTeam: supportBlock.manageTeam,
    addBlock: supportBlock.addBlock,
    editBlock: supportBlock.editBlock,
    addLead: supportBlock.addLead,
    editLead: supportBlock.editLead,
    changeLeadBlock: supportBlock.changeLeadBlock,
    convertLeadToAgent: supportBlock.convertLeadToAgent,
    addAgent: supportBlock.addAgent,
    editAgent: supportBlock.editAgent,
    promoteAgentToLead: supportBlock.promoteAgentToLead,
};
