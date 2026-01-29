import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useEligibleStudentsList } from "../api";
import type { EligibleStudent } from "../types";

const MOCK_STUDENTS: EligibleStudent[] = [
    {
        id: "1",
        name: "Emma Johnson",
        age: 14,
        program: { id: "1", title: "Standard", type: "standard" },
        course: { id: "1", title: "Python" },
        level: { id: "1", title: "Advanced" },
        groupType: "regular",
        registrationDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Emma Johnson",
        age: 16,
        program: { id: "1", title: "Standard", type: "standard" },
        course: { id: "1", title: "Python" },
        level: { id: "1", title: "Advanced" },
        groupType: "semi_private",
        registrationDate: "2024-01-15",
    },
    {
        id: "3",
        name: "Emma Johnson",
        age: 12,
        program: { id: "2", title: "Professional", type: "professional" },
        course: { id: "1", title: "Python" },
        level: { id: "1", title: "Advanced" },
        groupType: "private",
        registrationDate: "2024-01-15",
    },
];

const getGroupTypeLabel = (type: "regular" | "semi_private" | "private") => {
    switch (type) {
        case "regular":
            return "Regular";
        case "semi_private":
            return "Semi Private";
        case "private":
            return "Private";
        default:
            return type;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getGroupTypePath = (type: "regular" | "semi_private" | "private") => {
    switch (type) {
        case "regular":
            return "regular";
        case "semi_private":
            return "semi-private";
        case "private":
            return "private";
        default:
            return "regular";
    }
};

const transformStudentToTableData = (student: EligibleStudent): TableData => ({
    id: student.id,
    avatar: "",
    columns: {
        id: student.id,
        name: student.name,
        age: student.age,
        program: student.program.title,
        course: student.course.title,
        level: student.level.title,
        groupType: getGroupTypeLabel(student.groupType),
        groupTypeRaw: student.groupType,
        registration: formatDate(student.registrationDate),
    },
});

function EligibleStudentsList() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useEligibleStudentsList({
        page: currentPage,
    });

    const students = data?.items || MOCK_STUDENTS;
    const paginationInfo = data
        ? {
              currentPage: data.currentPage,
              lastPage: data.lastPage,
              perPage: data.perPage,
          }
        : null;

    const tableData: TableData[] = useMemo(
        () => students.map(transformStudentToTableData),
        [students]
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleAssignToGroup = useCallback(
        (studentId: string, groupType: string) => {
            const path = getGroupTypePath(
                groupType as "regular" | "semi_private" | "private"
            );
            navigate(`/dashboard/groups/${path}?assignStudent=${studentId}`);
        },
        [navigate]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "id",
                header: t("eligibleStudents.table.id", "ID"),
                accessorKey: "id",
                sortable: true,
            },
            {
                id: "name",
                header: t("eligibleStudents.table.studentName", "Student Name"),
                accessorKey: "name",
                sortable: true,
            },
            {
                id: "age",
                header: t("eligibleStudents.table.age", "Age"),
                accessorKey: "age",
                sortable: true,
            },
            {
                id: "program",
                header: t("eligibleStudents.table.program", "Program"),
                accessorKey: "program",
                sortable: true,
            },
            {
                id: "course",
                header: t("eligibleStudents.table.courseTrack", "Course/Track"),
                accessorKey: "course",
                sortable: true,
            },
            {
                id: "level",
                header: t("eligibleStudents.table.level", "Level"),
                accessorKey: "level",
                sortable: true,
            },
            {
                id: "groupType",
                header: t("eligibleStudents.table.groupType", "Group Type"),
                accessorKey: "groupType",
                sortable: true,
            },
            {
                id: "registration",
                header: t(
                    "eligibleStudents.table.registration",
                    "Registration"
                ),
                accessorKey: "registration",
                sortable: true,
            },
            {
                id: "action",
                header: t("eligibleStudents.table.action", "Action"),
                accessorKey: "action",
                sortable: false,
                cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToGroup(
                                row.id,
                                row.columns.groupTypeRaw as string
                            );
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        {t(
                            "eligibleStudents.actions.assignToGroup",
                            "Assign to group"
                        )}
                    </button>
                ),
            },
        ],
        [t, handleAssignToGroup]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("eligibleStudents.title", "Eligible students"),
                subtitle: t(
                    "eligibleStudents.subtitle",
                    "Students who still have available group slots and can be assigned to a group"
                ),
            }}
        >
            <DynamicTable
                title={t(
                    "eligibleStudents.listTitle",
                    "Eligible Students List"
                )}
                data={tableData}
                columns={columns}
                initialView="grid"
                itemsPerPage={paginationInfo?.perPage ?? 10}
                hideHeader={true}
                disableRowClick={true}
                currentPage={paginationInfo?.currentPage}
                lastPage={paginationInfo?.lastPage}
                totalCount={students.length}
                onPageChange={paginationInfo ? handlePageChange : undefined}
            />

            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            )}

            {isError && (
                <div className="text-center py-8 text-red-500">
                    {t(
                        "eligibleStudents.errors.loadFailed",
                        "Failed to load students"
                    )}
                </div>
            )}
        </PageWrapper>
    );
}

export default EligibleStudentsList;
