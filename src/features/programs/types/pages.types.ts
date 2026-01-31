export interface ProgramStats {
    learningPaths: number;
    totalLevels: number;
    totalLessons: number;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    updatedAt: string;
    stats: ProgramStats;
}
