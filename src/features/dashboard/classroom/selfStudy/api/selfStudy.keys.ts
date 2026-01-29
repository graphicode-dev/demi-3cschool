export const selfStudyKeys = {
    all: ["selfStudy"] as const,

    // Content keys
    content: () => [...selfStudyKeys.all, "content"] as const,
    contentByTerm: (termId: number) =>
        [...selfStudyKeys.all, "content", "term", termId] as const,

    // Course keys
    courses: () => [...selfStudyKeys.all, "courses"] as const,
    course: (courseId: number) =>
        [...selfStudyKeys.courses(), courseId] as const,

    // Session keys
    sessions: () => [...selfStudyKeys.all, "sessions"] as const,
    session: (sessionId: number) =>
        [...selfStudyKeys.sessions(), sessionId] as const,

    // Lesson keys
    lessons: () => [...selfStudyKeys.all, "lessons"] as const,
    lesson: (sessionId: number) =>
        [...selfStudyKeys.lessons(), sessionId] as const,
    lessonVideos: (lessonId: number) =>
        [...selfStudyKeys.lessons(), lessonId, "videos"] as const,

    // Video keys
    videos: () => [...selfStudyKeys.all, "videos"] as const,
    video: (videoId: number) => [...selfStudyKeys.videos(), videoId] as const,
    videoProgress: (videoId: number) =>
        [...selfStudyKeys.videos(), videoId, "progress"] as const,
    lessonProgress: (lessonId: number) =>
        [...selfStudyKeys.lessons(), lessonId, "progress"] as const,

    // Quiz keys
    quizzes: () => [...selfStudyKeys.all, "quizzes"] as const,
    videoQuiz: (videoId: number) =>
        [...selfStudyKeys.quizzes(), "video", videoId] as const,
    quizResult: (quizId: number) =>
        [...selfStudyKeys.quizzes(), quizId, "result"] as const,
};
