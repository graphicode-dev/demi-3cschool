/**
 * Permission Constants
 *
 * Type-safe permission names based on API response.
 * Use these constants throughout the application for consistency.
 */

export const PERMISSIONS = {
    // General Dashboard
    DASHBOARD: {
        VIEW: "dashboard_view",
        STATS: "dashboard_stats",
    },

    // Courses
    COURSE: {
        VIEW_ANY: "course.viewAny",
        VIEW: "course.view",
        CREATE: "course.create",
        UPDATE: "course.update",
        DELETE: "course.delete",
        RESTORE: "course.restore",
        FORCE_DELETE: "course.forceDelete",
    },

    // Levels
    LEVEL: {
        VIEW_ANY: "level.viewAny",
        VIEW: "level.view",
        CREATE: "level.create",
        UPDATE: "level.update",
        DELETE: "level.delete",
        RESTORE: "level.restore",
        FORCE_DELETE: "level.forceDelete",
    },

    // Level Quizzes
    LEVEL_QUIZ: {
        VIEW_ANY: "level_quiz.viewAny",
        VIEW: "level_quiz.view",
        CREATE: "level_quiz.create",
        UPDATE: "level_quiz.update",
        DELETE: "level_quiz.delete",
        RESTORE: "level_quiz.restore",
        FORCE_DELETE: "level_quiz.forceDelete",
    },

    // Level Quiz Questions
    LEVEL_QUIZ_QUESTION: {
        VIEW_ANY: "level_quiz_question.viewAny",
        VIEW: "level_quiz_question.view",
        CREATE: "level_quiz_question.create",
        UPDATE: "level_quiz_question.update",
        DELETE: "level_quiz_question.delete",
        RESTORE: "level_quiz_question.restore",
        FORCE_DELETE: "level_quiz_question.forceDelete",
    },

    // Level Quiz Options
    LEVEL_QUIZ_OPTION: {
        VIEW_ANY: "level_quiz_option.viewAny",
        VIEW: "level_quiz_option.view",
        CREATE: "level_quiz_option.create",
        UPDATE: "level_quiz_option.update",
        DELETE: "level_quiz_option.delete",
        RESTORE: "level_quiz_option.restore",
        FORCE_DELETE: "level_quiz_option.forceDelete",
    },

    // Lessons
    LESSON: {
        VIEW_ANY: "lesson.viewAny",
        VIEW: "lesson.view",
        CREATE: "lesson.create",
        UPDATE: "lesson.update",
        DELETE: "lesson.delete",
        RESTORE: "lesson.restore",
        FORCE_DELETE: "lesson.forceDelete",
    },

    // Lesson Quizzes
    LESSON_QUIZ: {
        VIEW_ANY: "lesson_quiz.viewAny",
        VIEW: "lesson_quiz.view",
        CREATE: "lesson_quiz.create",
        UPDATE: "lesson_quiz.update",
        DELETE: "lesson_quiz.delete",
        RESTORE: "lesson_quiz.restore",
        FORCE_DELETE: "lesson_quiz.forceDelete",
    },

    // Lesson Quiz Questions
    LESSON_QUIZ_QUESTION: {
        VIEW_ANY: "lesson_quiz_question.viewAny",
        VIEW: "lesson_quiz_question.view",
        CREATE: "lesson_quiz_question.create",
        UPDATE: "lesson_quiz_question.update",
        DELETE: "lesson_quiz_question.delete",
        RESTORE: "lesson_quiz_question.restore",
        FORCE_DELETE: "lesson_quiz_question.forceDelete",
    },

    // Lesson Quiz Options
    LESSON_QUIZ_OPTION: {
        VIEW_ANY: "lesson_quiz_option.viewAny",
        VIEW: "lesson_quiz_option.view",
        CREATE: "lesson_quiz_option.create",
        UPDATE: "lesson_quiz_option.update",
        DELETE: "lesson_quiz_option.delete",
        RESTORE: "lesson_quiz_option.restore",
        FORCE_DELETE: "lesson_quiz_option.forceDelete",
    },

    // Lesson Videos
    LESSON_VIDEO: {
        VIEW_ANY: "lesson_video.viewAny",
        VIEW: "lesson_video.view",
        CREATE: "lesson_video.create",
        UPDATE: "lesson_video.update",
        DELETE: "lesson_video.delete",
        RESTORE: "lesson_video.restore",
        FORCE_DELETE: "lesson_video.forceDelete",
    },

    // Lesson Assignments
    LESSON_ASSIGNMENT: {
        VIEW_ANY: "lesson_assignment.viewAny",
        VIEW: "lesson_assignment.view",
        CREATE: "lesson_assignment.create",
        UPDATE: "lesson_assignment.update",
        DELETE: "lesson_assignment.delete",
        RESTORE: "lesson_assignment.restore",
        FORCE_DELETE: "lesson_assignment.forceDelete",
    },

    // Lesson Materials
    LESSON_MATERIAL: {
        VIEW_ANY: "lesson_material.viewAny",
        VIEW: "lesson_material.view",
        CREATE: "lesson_material.create",
        UPDATE: "lesson_material.update",
        DELETE: "lesson_material.delete",
        RESTORE: "lesson_material.restore",
        FORCE_DELETE: "lesson_material.forceDelete",
    },

    // Groups
    GROUP: {
        VIEW_ANY: "group.viewAny",
        VIEW: "group.view",
        CREATE: "group.create",
        UPDATE: "group.update",
        DELETE: "group.delete",
        RESTORE: "group.restore",
        FORCE_DELETE: "group.forceDelete",
    },

    // Group Sessions
    GROUP_SESSION: {
        VIEW_ANY: "group_session.viewAny",
        VIEW: "group_session.view",
        CREATE: "group_session.create",
        UPDATE: "group_session.update",
        DELETE: "group_session.delete",
        RESTORE: "group_session.restore",
        FORCE_DELETE: "group_session.forceDelete",
    },

    // Student Attendances
    STUDENT_ATTENDANCE: {
        VIEW_ANY: "student_attendance.viewAny",
        VIEW: "student_attendance.view",
        CREATE: "student_attendance.create",
        UPDATE: "student_attendance.update",
        DELETE: "student_attendance.delete",
        RESTORE: "student_attendance.restore",
        FORCE_DELETE: "student_attendance.forceDelete",
    },

    // Teacher Attendances
    TEACHER_ATTENDANCE: {
        VIEW_ANY: "teacher_attendance.viewAny",
        VIEW: "teacher_attendance.view",
        CREATE: "teacher_attendance.create",
        UPDATE: "teacher_attendance.update",
        DELETE: "teacher_attendance.delete",
        RESTORE: "teacher_attendance.restore",
        FORCE_DELETE: "teacher_attendance.forceDelete",
    },

    // Support Tickets
    SUPPORT_TICKETS: {
        VIEW_ANY: "support_tickets.viewAny",
        VIEW: "support_tickets.view",
        CREATE: "support_tickets.create",
        UPDATE: "support_tickets.update",
        DELETE: "support_tickets.delete",
        RESTORE: "support_tickets.restore",
        FORCE_DELETE: "support_tickets.forceDelete",
    },

    // Support Ticket Replies
    SUPPORT_TICKET_REPLY: {
        VIEW_ANY: "support_ticket_reply.viewAny",
        VIEW: "support_ticket_reply.view",
        CREATE: "support_ticket_reply.create",
        UPDATE: "support_ticket_reply.update",
        DELETE: "support_ticket_reply.delete",
        RESTORE: "support_ticket_reply.restore",
        FORCE_DELETE: "support_ticket_reply.forceDelete",
    },

    // Level Pricing
    LEVEL_PRICE: {
        VIEW_ANY: "level_price.viewAny",
        VIEW: "level_price.view",
        CREATE: "level_price.create",
        UPDATE: "level_price.update",
        DELETE: "level_price.delete",
        RESTORE: "level_price.restore",
        FORCE_DELETE: "level_price.forceDelete",
    },

    // Coupons
    COUPON: {
        VIEW_ANY: "coupon.viewAny",
        VIEW: "coupon.view",
        CREATE: "coupon.create",
        UPDATE: "coupon.update",
        DELETE: "coupon.delete",
        RESTORE: "coupon.restore",
        FORCE_DELETE: "coupon.forceDelete",
    },

    // Subscriptions
    LEVEL_SUBSCRIPTION: {
        VIEW_ANY: "level_subscription.viewAny",
        VIEW: "level_subscription.view",
        CREATE: "level_subscription.create",
        UPDATE: "level_subscription.update",
        DELETE: "level_subscription.delete",
        VIEW_ELIGIBLE_STUDENTS: "level_subscription.viewEligibleStudents",
        VIEW_OVERDUE_STUDENTS: "level_subscription.viewOverdueStudents",
    },

    // Installments
    INSTALLMENT: {
        VIEW_ANY: "installment.viewAny",
        VIEW: "installment.view",
    },

    // Installment Payments
    INSTALLMENT_PAYMENT: {
        VIEW_ANY: "installment_payment.viewAny",
        VIEW: "installment_payment.view",
        CREATE: "installment_payment.create",
        CHANGE_STATUS: "installment_payment.changeStatus",
    },

    // Eligible Students
    ELIGIBLE_STUDENT: {
        VIEW_ANY: "eligible_student.viewAny",
    },

    // Users
    USER: {
        VIEW_ANY: "user.viewAny",
        VIEW: "user.view",
        CREATE: "user.create",
        UPDATE: "user.update",
        DELETE: "user.delete",
        RESTORE: "user.restore",
        FORCE_DELETE: "user.forceDelete",
    },

    // Roles
    ROLE: {
        VIEW_ANY: "role.viewAny",
        VIEW: "role.view",
        CREATE: "role.create",
        UPDATE: "role.update",
        DELETE: "role.delete",
        RESTORE: "role.restore",
        FORCE_DELETE: "role.forceDelete",
    },

    // Permissions
    PERMISSION: {
        VIEW_ANY: "permission.viewAny",
        VIEW: "permission.view",
        CREATE: "permission.create",
        UPDATE: "permission.update",
        DELETE: "permission.delete",
        RESTORE: "permission.restore",
        FORCE_DELETE: "permission.forceDelete",
    },

    // User Roles
    USER_ROLE: {
        VIEW_ANY: "user_role.viewAny",
        VIEW: "user_role.view",
        CREATE: "user_role.create",
        UPDATE: "user_role.update",
        DELETE: "user_role.delete",
    },

    // Role Permissions
    ROLE_PERMISSION: {
        VIEW_ANY: "role_permission.viewAny",
        VIEW: "role_permission.view",
        CREATE: "role_permission.create",
        UPDATE: "role_permission.update",
        DELETE: "role_permission.delete",
    },

    // Staff Management
    STAFF: {
        VIEW_ANY: "staff.viewAny",
        VIEW: "staff.view",
        CREATE: "staff.create",
        UPDATE: "staff.update",
        DELETE: "staff.delete",
        RESTORE: "staff.restore",
        FORCE_DELETE: "staff.forceDelete",
    },

    // FAQs
    FAQ: {
        VIEW_ANY: "faq.viewAny",
        VIEW: "faq.view",
        CREATE: "faq.create",
        UPDATE: "faq.update",
        DELETE: "faq.delete",
        RESTORE: "faq.restore",
        FORCE_DELETE: "faq.forceDelete",
    },

    // Audits
    AUDIT: {
        VIEW_ANY: "audit.viewAny",
        VIEW: "audit.view",
        CREATE: "audit.create",
        UPDATE: "audit.update",
        DELETE: "audit.delete",
        RESTORE: "audit.restore",
        FORCE_DELETE: "audit.forceDelete",
        SECURITY_ALERTS: "audit.securityAlerts",
        CLEANUP: "audit.cleanup",
    },

    // Notifications
    NOTIFICATION: {
        VIEW_ANY: "notification.viewAny",
        VIEW: "notification.view",
        CREATE: "notification.create",
        UPDATE: "notification.update",
        DELETE: "notification.delete",
        RESTORE: "notification.restore",
        FORCE_DELETE: "notification.forceDelete",
    },

    // Settings
    SETTING: {
        VIEW_ANY: "setting.viewAny",
        VIEW: "setting.view",
        CREATE: "setting.create",
        UPDATE: "setting.update",
        DELETE: "setting.delete",
        RESTORE: "setting.restore",
        FORCE_DELETE: "setting.forceDelete",
    },

    // Conversations
    CONVERSATION: {
        VIEW_ANY: "conversation.viewAny",
        VIEW: "conversation.view",
        CREATE: "conversation.create",
        UPDATE: "conversation.update",
        DELETE: "conversation.delete",
        RESTORE: "conversation.restore",
        FORCE_DELETE: "conversation.forceDelete",
    },

    // Messages
    MESSAGE: {
        VIEW_ANY: "message.viewAny",
        VIEW: "message.view",
        CREATE: "message.create",
        UPDATE: "message.update",
        DELETE: "message.delete",
        RESTORE: "message.restore",
        FORCE_DELETE: "message.forceDelete",
    },

    // Channels
    CHANNEL: {
        VIEW_ANY: "channel.viewAny",
        VIEW: "channel.view",
    },

    // Comments
    COMMENT: {
        VIEW_ANY: "comment.viewAny",
        VIEW: "comment.view",
        CREATE: "comment.create",
        UPDATE: "comment.update",
        DELETE: "comment.delete",
        RESTORE: "comment.restore",
        FORCE_DELETE: "comment.forceDelete",
        LIKE: "comment.like",
        REPLY: "comment.reply",
    },

    // Posts
    POST: {
        VIEW_ANY: "post.viewAny",
        VIEW: "post.view",
        CREATE: "post.create",
        UPDATE: "post.update",
        DELETE: "post.delete",
        RESTORE: "post.restore",
        FORCE_DELETE: "post.forceDelete",
        LIKE: "post.like",
    },

    // Terms
    TERM: {
        VIEW_ANY: "term.viewAny",
        VIEW: "term.view",
    },

    // Lesson Contents
    LESSON_CONTENT: {
        VIEW_ANY: "lesson_content.viewAny",
        VIEW: "lesson_content.view",
    },

    // Grades
    GRADE: {
        VIEW_ANY: "grade.viewAny",
        VIEW: "grade.view",
    },

    // Quizzes
    QUIZ: {
        VIEW_ANY: "quiz.viewAny",
        VIEW: "quiz.view",
        CREATE: "quiz.create",
        UPDATE: "quiz.update",
    },

    // Questions
    QUESTION: {
        VIEW_ANY: "question.viewAny",
        VIEW: "question.view",
        CREATE: "question.create",
        UPDATE: "question.update",
    },

    // Enrollments
    ENROLLMENT: {
        VIEW_ANY: "enrollment.viewAny",
        VIEW: "enrollment.view",
    },

    // Certificates
    CERTIFICATE: {
        VIEW_ANY: "certificate.viewAny",
        VIEW: "certificate.view",
        CREATE: "certificate.create",
        UPDATE: "certificate.update",
        DELETE: "certificate.delete",
        RESTORE: "certificate.restore",
        FORCE_DELETE: "certificate.forceDelete",
    },

    // Reports
    REPORT: {
        VIEW_ANY: "report.viewAny",
        VIEW: "report.view",
        CREATE: "report.create",
        UPDATE: "report.update",
        DELETE: "report.delete",
        RESTORE: "report.restore",
        FORCE_DELETE: "report.forceDelete",
    },
} as const;

/**
 * Permission group names for UI display
 */
export const PERMISSION_GROUPS = {
    GENERAL_DASHBOARD: "General Dashboard",
    COURSES: "Courses",
    LEVELS: "Levels",
    LEVELS_QUIZZES: "Levels Quizzes",
    LEVELS_QUIZ_QUESTIONS: "Levels Quiz Questions",
    LEVELS_QUIZ_OPTIONS: "Levels Quiz Questions Options",
    LESSONS: "Lessons",
    LESSONS_QUIZZES: "Lessons Quizzes",
    LESSONS_QUIZ_QUESTIONS: "Lessons Quiz Questions",
    LESSONS_QUIZ_OPTIONS: "lessons Quiz Questions Options",
    LESSONS_VIDEOS: "Lessons Videos",
    LESSONS_ASSIGNMENTS: "Lessons Assignments",
    LESSONS_MATERIALS: "Lessons Materials",
    GROUPS: "Groups",
    GROUP_SESSIONS: "Group Sessions",
    STUDENT_ATTENDANCES: "Student Attendances",
    TEACHER_ATTENDANCES: "Teacher Attendances",
    SUPPORT_TICKETS: "Support Tickets",
    SUPPORT_TICKET_REPLIES: "Support Ticket Replies",
    LEVEL_PRICING: "Level Pricing",
    COUPONS: "Coupons",
    SUBSCRIPTIONS: "Subscriptions",
    INSTALLMENT: "Installment",
    INSTALLMENT_PAYMENTS: "Installment Payments",
    ELIGIBLE_STUDENTS: "Eligible Students",
    USERS: "Users",
    ROLES: "Roles",
    PERMISSIONS: "Permissions",
    USER_ROLES: "User Roles",
    ROLE_PERMISSIONS: "Role Permissions",
    STAFF_MANAGEMENT: "Staff Management",
    FAQS: "FAQs",
    AUDITS: "Audits",
    NOTIFICATIONS: "Notifications",
    SETTINGS: "Settings",
    CONVERSATIONS: "Conversations",
    MESSAGES: "Messages",
    CHANNELS: "Channels",
    COMMENTS: "Comments",
    POSTS: "Posts",
    TERMS: "Terms",
    LESSON_CONTENTS: "Lesson Contents",
    GRADES: "Grades",
    QUIZZES: "Quizzes",
    QUESTIONS: "Questions",
    ENROLLMENTS: "Enrollments",
} as const;

/**
 * Type for all permission values
 */
export type PermissionValue =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

/**
 * Type for permission group names
 */
export type PermissionGroupName =
    (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS];
