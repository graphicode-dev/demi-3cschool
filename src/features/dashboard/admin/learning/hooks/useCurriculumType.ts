import { useLocation } from "react-router-dom";
import { ProgramsCurriculum } from "../types";

export function useCurriculumType(): ProgramsCurriculum {
    const location = useLocation();
    if (location.pathname.includes("secondTerm")) {
        return "second_term";
    }
    if (location.pathname.includes("summer-camp")) {
        return "summer_camp";
    }
    return "first_term";
}
