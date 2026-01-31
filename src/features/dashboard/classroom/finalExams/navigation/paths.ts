import { CLASSROOM_PATH } from "../../navigation/constant";

export const FINAL_EXAMS_PATH = `${CLASSROOM_PATH}/final-exams`;

export const finalExamsPaths = {
    list: () => FINAL_EXAMS_PATH,
    take: (examId: string | number = ":examId") =>
        `${FINAL_EXAMS_PATH}/${examId}/take`,
    result: (examId: string | number = ":examId") =>
        `${FINAL_EXAMS_PATH}/${examId}/result`,
} as const;
