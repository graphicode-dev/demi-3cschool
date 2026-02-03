import { useMemo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { StatCard } from "../components";
import { GroupCard } from "../components/GroupCard";
import { useGroupsByLevel, type Group, type PaginatedData } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useDebounce } from "@/shared/observability";

const TotalGroupsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
    </svg>
);

const ActiveGroupsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const InactiveGroupsIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

/**
 * Format schedules to display days and times
 */
const formatSchedules = (schedules: Group["schedules"]): string => {
    if (!schedules || schedules.length === 0) return "-";
    return schedules
        .map(
            (s) =>
                `${s.dayOfWeek.charAt(0).toUpperCase() + s.dayOfWeek.slice(1)}`
        )
        .join(", ");
};

const formatScheduleTimes = (schedules: Group["schedules"]): string => {
    if (!schedules || schedules.length === 0) return "-";
    const schedule = schedules[0];
    const startTime = schedule.startTime.slice(0, 5);
    const endTime = schedule.endTime.slice(0, 5);
    return `${startTime} - ${endTime}`;
};

/**
 * Transform API Group data to TableData format
 */
const transformGroupToTableData = (group: Group): TableData => ({
    id: String(group.id),
    avatar: "",
    columns: {
        name: group.name,
        level: group.level?.title || "-",
        grade: group.grade?.name || "-",
        programsCurriculum: group.programsCurriculum?.caption || "-",
        capacity: group.maxCapacity,
        locationType: group.locationType || "-",
        days: formatSchedules(group.schedules),
        time: formatScheduleTimes(group.schedules),
        status: group.isActive ? "Active" : "Inactive",
    },
});

function RegularGroupsPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    // Build base path from URL params
    const basePath = `/admin/groups/grades/${gradeId}/levels/${levelId}`;

    // Fetch groups by level ID
    const { data, isLoading, isError } = useGroupsByLevel({
        levelId: levelId || "",
        page: currentPage,
        search: debouncedSearchQuery || undefined,
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    // Check if data is paginated or array
    const isPaginated = data && "items" in data;
    const groups = isPaginated
        ? (data as PaginatedData<Group>).items
        : Array.isArray(data)
          ? data
          : [];
    const paginationInfo = isPaginated ? (data as PaginatedData<Group>) : null;

    // Transform groups to table data
    const tableData: TableData[] = useMemo(
        () => groups.map(transformGroupToTableData),
        [groups]
    );

    // Create a map for looking up original group data by ID
    const groupsMap = useMemo(() => {
        const map = new Map<string, Group>();
        groups.forEach((group) => map.set(String(group.id), group));
        return map;
    }, [groups]);

    // Custom card renderer for groups
    const renderGroupCard = useCallback(
        (row: TableData) => {
            const group = groupsMap.get(row.id);
            if (!group) return null;

            return (
                <GroupCard
                    name={group.name}
                    levelTitle={group.level?.title}
                    gradeName={group.grade?.name}
                    programCaption={group.programsCurriculum?.caption}
                    locationType={group.locationType || undefined}
                    trainerName={group.trainer?.name}
                    schedules={group.schedules}
                    maxCapacity={group.maxCapacity}
                    enrolledCount={0}
                    sessionCount={0}
                    totalSessions={0}
                    isActive={group.isActive ?? true}
                />
            );
        },
        [groupsMap]
    );

    // Calculate stats from data
    const stats = useMemo(() => {
        const activeCount = groups.filter((g) => g.isActive).length;
        return {
            total: groups.length,
            active: activeCount,
            inactive: groups.length - activeCount,
        };
    }, [groups]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRowClick = useCallback(
        (rowId: string) => {
            navigate(`${basePath}/group/view/${rowId}`);
        },
        [navigate, basePath]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "name",
                header: t("groups.table.name", "Name"),
                accessorKey: "name",
                sortable: true,
            },
            {
                id: "level",
                header: t("groups.table.level", "Level"),
                accessorKey: "level",
                sortable: true,
            },
            {
                id: "grade",
                header: t("groups.table.grade", "Grade"),
                accessorKey: "grade",
                sortable: true,
            },
            {
                id: "programsCurriculum",
                header: t("groups.table.programsCurriculum", "Curriculum"),
                accessorKey: "programsCurriculum",
                sortable: true,
            },
            {
                id: "capacity",
                header: t("groups.table.capacity", "Capacity"),
                accessorKey: "capacity",
                sortable: true,
            },
            {
                id: "locationType",
                header: t("groups.table.locationType", "Location"),
                accessorKey: "locationType",
                sortable: true,
            },
            {
                id: "days",
                header: t("groups.table.days", "Days"),
                accessorKey: "days",
                sortable: false,
            },
            {
                id: "time",
                header: t("groups.table.time", "Time"),
                accessorKey: "time",
                sortable: false,
            },
            {
                id: "status",
                header: t("groups.table.status", "Status"),
                accessorKey: "status",
                sortable: true,
            },
        ],
        [t]
    );

    // Get level title from first group
    const levelTitle = groups[0]?.level?.title || `Level ${levelId}`;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.regularListBreadcrumb", "Regular Groups"),
                subtitle: levelTitle,
                backButton: true,
                actions: (
                    <Link
                        to={`${basePath}/group/create`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {t("groups.actions.createNew", "Create New Group")}
                    </Link>
                ),
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title={t("groups.stats.totalGroups", "Total Groups")}
                    value={stats.total}
                    icon={<TotalGroupsIcon />}
                    variant="primary"
                />
                <StatCard
                    title={t("groups.stats.activeGroups", "Active Groups")}
                    value={stats.active}
                    icon={<ActiveGroupsIcon />}
                    variant="success"
                />
                <StatCard
                    title={t("groups.stats.inactiveGroups", "Inactive Groups")}
                    value={stats.inactive}
                    icon={<InactiveGroupsIcon />}
                    variant="danger"
                />
            </div>

            <DynamicTable
                initialView="cards"
                title={t("groups.table.title", "Class Name")}
                data={tableData}
                columns={columns}
                itemsPerPage={paginationInfo?.perPage ?? 10}
                hideHeader={true}
                onRowClick={handleRowClick}
                currentPage={paginationInfo?.currentPage}
                lastPage={paginationInfo?.lastPage}
                totalCount={groups.length}
                onPageChange={paginationInfo ? handlePageChange : undefined}
                renderCard={renderGroupCard}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                enableClientSearch={false}
            />

            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            )}

            {isError && (
                <div className="text-center py-8 text-red-500">
                    {t("groups.errors.loadFailed", "Failed to load groups")}
                </div>
            )}
        </PageWrapper>
    );
}

export default RegularGroupsPage;
