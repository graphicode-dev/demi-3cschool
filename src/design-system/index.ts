/**
 * Design System - Public Exports
 *
 * Shared UI components and types for the LMS.
 *
 * @example
 * ```tsx
 * import {
 *     PageHeader,
 *     DataTable,
 *     LoadingState,
 *     ErrorState,
 *     EmptyState,
 * } from '@/design-system';
 * ```
 */

// Types
export type {
    Size,
    CompactSize,
    ColorVariant,
    StateVariant,
    BreadcrumbItem,
    ActionButton,
    ColumnDef,
    PaginationInfo,
    LoadingStateProps,
    ErrorStateProps,
    EmptyStateProps,
    BaseComponentProps,
} from "./types";

// Components
export { PageHeader } from "./components/PageHeader";
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbItemType } from "./components/Breadcrumb";
export { LoadingState } from "./components/LoadingState";
export { ErrorState } from "./components/ErrorState";
export { EmptyState } from "./components/EmptyState";
export { ConfirmDialog } from "./components/ConfirmDialog";
export { Tooltip } from "./components/Tooltip";
export type {
    ConfirmDialogProps,
    ConfirmDialogButton,
    DialogVariant,
} from "./components/ConfirmDialog";

// Tabs
export { Tabs } from "./components/tabs";
export type {
    TabsProps,
    TabItemProps,
    TabsVariant,
    TabsSize,
    TabPanelProps,
    TabContentProps,
} from "./components/tabs";

// Hooks
export {
    ConfirmDialogProvider,
    useConfirmDialog,
    type ConfirmOptions,
    type ConfirmDialogContextValue,
} from "./hooks";
