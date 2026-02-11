/**
 * Support Help Feature - Mock Data
 *
 * Mock data for development and testing.
 */

import type {
    SupportTicket,
    SupportTicketListItem,
} from "../types";

export const mockSupportTickets: SupportTicketListItem[] = [
    {
        id: "1",
        ticketNumber: "TKT-1001",
        subject: "Cannot access Lesson 3 video",
        status: "open",
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        messageCount: 3,
    },
    {
        id: "2",
        ticketNumber: "TKT-1002",
        subject: "Cannot access Lesson 3 video",
        status: "in_progress",
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        messageCount: 2,
    },
    {
        id: "3",
        ticketNumber: "TKT-1003",
        subject: "Login password reset",
        status: "closed",
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        messageCount: 4,
    },
];

export const mockSupportTicketDetail: SupportTicket = {
    id: "1",
    ticketNumber: "TKT-1001",
    subject: "Cannot access Lesson 3 video",
    description: "I am trying to open the video for Lesson 3 but it shows a black screen.",
    status: "resolved",
    category: "Technical Issue",
    createdAt: "2025-01-22T08:15:00.000Z",
    updatedAt: "2025-01-22T10:30:00.000Z",
    messages: [
        {
            id: "m1",
            ticketId: "1",
            sender: "student",
            senderName: "Student",
            content: "Hi, I am trying to open the video for Lesson 3 but it shows a black screen.",
            createdAt: "2025-01-20T09:30:00.000Z",
        },
        {
            id: "m2",
            ticketId: "1",
            sender: "support",
            senderName: "Support Team",
            content: "Hello! We are checking this issue for you. Are you using Chrome or Safari?",
            createdAt: "2025-01-20T10:15:00.000Z",
        },
        {
            id: "m3",
            ticketId: "1",
            sender: "student",
            senderName: "Student",
            content: "I am using Chrome on my iPad.",
            createdAt: "2025-01-20T09:30:00.000Z",
        },
    ],
};
