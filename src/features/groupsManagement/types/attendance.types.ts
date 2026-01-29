export type StudentAttendance = {
    id: string;
    studentAvatar: string;
    selected: boolean;
    studentName: string;
    status: string;
    attendanceDate: string;
    attendanceTime: string;
    primaryTeacher: {
        name: string;
    };
};
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type CurrentSession = {
    date: string;
    startTime: string;
    endTime: string;
    totalEnrolled: string;
    instructor: {
        name: string;
    };
};

export type AttendanceSummary = {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
};
