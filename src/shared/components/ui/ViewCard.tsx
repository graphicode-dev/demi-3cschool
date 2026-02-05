import React, { useState } from "react";
import {
    ViewCardProps,
    ViewCardSectionProps,
    ViewCardFieldProps,
    ViewCardButtonsProps,
    ViewCardHeaderProps,
} from "@/shared/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/shared/context/ThemeContext";

const ViewCardSection: React.FC<ViewCardSectionProps> = ({
    label,
    children,
}) => (
    <div className="mb-8 text-left">
        <h3 className="text-sm text-left font-semibold text-brand-500 mb-3 capitalize">
            {label}
        </h3>
        {children}
    </div>
);

// Helper function to safely render values (handles objects that can't be rendered as React children)
const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        // For file/image objects, return the URL or name
        return (
            obj.url?.toString() ||
            obj.name?.toString() ||
            obj.title?.toString() ||
            obj.label?.toString() ||
            ""
        );
    }
    return String(value);
};

// Helper function to check if value is an image object
const isImageObject = (
    value: unknown
): value is { url: string; mimeType?: string; name?: string } => {
    if (value === null || value === undefined || typeof value !== "object")
        return false;
    const obj = value as Record<string, unknown>;
    if (!obj.url || typeof obj.url !== "string") return false;
    // Check if it's an image by mimeType or file extension
    const mimeType = obj.mimeType?.toString() || "";
    const url = obj.url.toString().toLowerCase();
    return (
        mimeType.startsWith("image/") ||
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg") ||
        url.endsWith(".gif") ||
        url.endsWith(".webp") ||
        url.endsWith(".svg")
    );
};

const ViewCardField: React.FC<ViewCardFieldProps> = ({
    label,
    value,
    type,
}) => {
    const displayValue = renderValue(value);
    const isImage = isImageObject(value);

    return (
        <div className="mb-4 flex flex-col">
            <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
                {label}
            </h4>

            {isImage ? (
                <a
                    href={(value as { url: string }).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <img
                        src={(value as { url: string }).url}
                        alt={(value as { name?: string }).name || label}
                        className="max-w-[200px] max-h-[150px] object-cover rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
                    />
                </a>
            ) : type === "file" ? (
                <a
                    href={displayValue}
                    target="_blank"
                    download={displayValue}
                    className="flex items-center gap-2 cursor-pointer text-brand-500 hover:text-brand-600 transition-colors"
                >
                    <span>{displayValue}</span>
                </a>
            ) : type === "image" ? (
                <img
                    src={displayValue}
                    className="w-30 h-30 object-cover rounded-full hover:opacity-80 hover:w-50 hover:h-50 transition-all"
                    alt={label}
                />
            ) : (
                <p className="text-gray-900 dark:text-white font-medium max-w-full truncate wrap-break-word whitespace-pre-wrap">
                    {displayValue || "No Value"}
                </p>
            )}
        </div>
    );
};

const ViewCardButtons: React.FC<ViewCardButtonsProps> = ({
    ticketButton,
    customButtonLabel,
    onEdit,
    onDelete,
    onTicket,
    onCustomButton,
}) => {
    const { theme } = useTheme();

    // Check if onCustomButton returns JSX or is a regular callback
    const customButtonContent = onCustomButton ? onCustomButton() : null;
    const isCustomJSX =
        customButtonContent && typeof customButtonContent === "object";

    return (
        <div className="flex gap-2">
            {isCustomJSX ? (
                customButtonContent
            ) : customButtonLabel && onCustomButton ? (
                <button
                    type="button"
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={onCustomButton as () => void}
                >
                    {customButtonLabel}
                </button>
            ) : null}
            {ticketButton && (
                <button
                    type="button"
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={onTicket}
                >
                    Tickets
                </button>
            )}
            <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-error-300 hover:bg-error-50 dark:border-gray-700 dark:hover:border-error-500/30 dark:hover:bg-error-500/10 group transition-colors"
                onClick={onDelete}
            >
                <span className="sr-only">Delete</span>
                <span className="group-hover:hidden">
                    {/* <TrashIcon
                        width={18}
                        height={18}
                        color={
                            theme === "light"
                                ? "var(--color-gray-500)"
                                : "var(--color-gray-400)"
                        }
                    /> */}
                </span>
                <span className="hidden group-hover:block">
                    {/* <TrashIcon
                        width={18}
                        height={18}
                        color="var(--color-error-500)"
                    /> */}
                </span>
            </button>
            <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/10 group transition-colors"
                onClick={onEdit}
            >
                <span className="sr-only">Edit</span>
                <span className="group-hover:hidden">
                    {/* <PenIcon
                        width={18}
                        height={18}
                        color={
                            theme === "light"
                                ? "var(--color-gray-500)"
                                : "var(--color-gray-400)"
                        }
                    /> */}
                </span>
                <span className="hidden group-hover:block">
                    {/* <PenIcon
                        width={18}
                        height={18}
                        color="var(--color-brand-500)"
                    /> */}
                </span>
            </button>
        </div>
    );
};

const ViewCardHeader: React.FC<ViewCardHeaderProps> = ({
    headerTitle = "View",
    hideHeaderTitle,
    buttons,
    ticketButton,
    onEdit,
    onDelete,
    onTicket,
    customButtonLabel,
    onCustomButton,
}) => {
    return (
        <div className="flex justify-between items-center gap-2">
            {!hideHeaderTitle && (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    {headerTitle}
                </h1>
            )}
            {buttons && (
                <ViewCardButtons
                    ticketButton={ticketButton}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTicket={onTicket}
                    customButtonLabel={customButtonLabel}
                    onCustomButton={onCustomButton}
                />
            )}
        </div>
    );
};

const ViewCard: React.FC<ViewCardProps> = ({
    headerTitle = "View",
    hideHeaderTitle = false,
    title = "View",
    subtitle,
    variant = "default",
    image,
    data,
    buttons,
    ticketButton,
    hideBorder = false,
    tabs = [],
    gridCols = 3,
    onEdit,
    onDelete,
    onTicket,
    customButtonLabel,
    onCustomButton,
}) => {
    // State to track if all content is shown or limited
    const [showAllContent, setShowAllContent] = useState(false);

    // Default number of sections to show initially
    const initialSectionsToShow = 3;

    // Get rows for the Show More/Less feature
    const allRows = data?.rows || [];

    // Determine if we need a show more button
    const needsShowMore = allRows.length > initialSectionsToShow;

    // Get the rows to display based on current state
    const visibleRows = showAllContent
        ? allRows
        : allRows.slice(0, initialSectionsToShow);

    // For tabs variant - handle tab navigation
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Get active tab from URL or use first tab
    const activeTabFromURL = searchParams.get("tab");
    const firstTabValue = tabs.length > 0 ? tabs[0].value : "";
    const [activeTab, setActiveTab] = useState(
        activeTabFromURL || firstTabValue
    );

    // Function to update tab in URL
    const updateTab = (tab: string) => {
        searchParams.set("tab", tab);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    // Find the active tab content
    const activeTabItem = tabs.find((tab) => tab.value === activeTab);

    const getGridCols = () => {
        switch (gridCols) {
            case 1:
                return "xl:grid-cols-1";

            case 2:
                return "xl:grid-cols-2";

            case 3:
                return "xl:grid-cols-3";

            case 4:
                return "xl:grid-cols-4";

            case 5:
                return "xl:grid-cols-5";

            case 6:
                return "xl:grid-cols-6";

            case 7:
                return "xl:grid-cols-7";

            case 8:
                return "xl:grid-cols-8";

            case 9:
                return "xl:grid-cols-9";

            case 10:
                return "xl:grid-cols-10";

            case 11:
                return "xl:grid-cols-11";

            case 12:
                return "xl:grid-cols-12";

            default:
                return "xl:grid-cols-3";
        }
    };

    const getColSpan = (key: number) => {
        switch (key) {
            case 1:
                return "md:col-span-1";

            case 2:
                return "md:col-span-2";

            case 3:
                return "md:col-span-3";

            case 4:
                return "md:col-span-4";

            case 5:
                return "md:col-span-5";

            case 6:
                return "md:col-span-6";

            case 7:
                return "md:col-span-7";

            case 8:
                return "md:col-span-8";

            case 9:
                return "md:col-span-9";

            case 10:
                return "md:col-span-10";

            case 11:
                return "md:col-span-11";

            case 12:
                return "md:col-span-12";

            default:
                return "md:col-span-1";
        }
    };

    // Render different layouts based on variant
    const renderContent = () => {
        switch (variant) {
            case "user":
                return (
                    <div className="flex flex-col gap-6">
                        {/* Header */}
                        <ViewCardHeader
                            headerTitle={headerTitle}
                            hideHeaderTitle={hideHeaderTitle}
                            buttons={buttons}
                            ticketButton={ticketButton}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onTicket={onTicket}
                            customButtonLabel={customButtonLabel}
                            onCustomButton={onCustomButton}
                        />

                        {/* User Avatar and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden">
                                    <img
                                        src={
                                            image || "/images/default-user.png"
                                        }
                                        alt={title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="font-medium text-brand-500">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-b border-gray-200 dark:border-gray-800" />

                        {/* User Details */}
                        <div
                            className={`flex-1 grid grid-cols-1 md:${getGridCols()} gap-6 mt-6 md:mt-0`}
                        >
                            {data?.rows.map((row) =>
                                row.fields?.map((field, index) => (
                                    <ViewCardField
                                        key={index}
                                        label={field.label}
                                        value={field.value}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );

            case "vessel":
                return (
                    <div className="flex flex-col gap-6">
                        {/* Header */}
                        <ViewCardHeader
                            headerTitle={headerTitle}
                            hideHeaderTitle={hideHeaderTitle}
                            buttons={buttons}
                            ticketButton={ticketButton}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onTicket={onTicket}
                            customButtonLabel={customButtonLabel}
                            onCustomButton={onCustomButton}
                        />

                        {/* User Avatar and Basic Info */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative">
                                <div className="w-50 h-28 rounded-4xl overflow-hidden">
                                    <img
                                        src={
                                            image || "/images/default-ship.png"
                                        }
                                        alt={title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="font-medium text-brand-500">
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-b border-gray-200 dark:border-gray-800 my-4" />

                        {/* Sections */}
                        {visibleRows.length > 0 && (
                            <div className="mt-6">
                                {visibleRows.map((row, index) => (
                                    <React.Fragment key={index}>
                                        {row.mainTitle && (
                                            <h2 className="text-left text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                {row.mainTitle}
                                            </h2>
                                        )}

                                        <ViewCardSection label={row.title}>
                                            {row.customRender ? (
                                                row.customRender()
                                            ) : (
                                                <div
                                                    className={`grid grid-cols-1 md:${getGridCols()} gap-4`}
                                                >
                                                    {row.fields?.map(
                                                        (field, fieldIndex) => (
                                                            <div
                                                                key={fieldIndex}
                                                                className={`${
                                                                    field.colSpan
                                                                        ? getColSpan(
                                                                              field.colSpan
                                                                          )
                                                                        : ""
                                                                }`}
                                                            >
                                                                <ViewCardField
                                                                    label={
                                                                        field.label
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    type={
                                                                        field.type
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </ViewCardSection>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "tabs":
                return (
                    <div className="flex flex-col">
                        {/* Header with tab-specific buttons */}
                        {activeTabItem ? (
                            <ViewCardHeader
                                headerTitle={headerTitle}
                                hideHeaderTitle={hideHeaderTitle}
                                buttons={activeTabItem.buttons || buttons}
                                ticketButton={
                                    activeTabItem.onTicket ? true : ticketButton
                                }
                                onEdit={activeTabItem.onEdit || onEdit}
                                onDelete={activeTabItem.onDelete || onDelete}
                                onTicket={activeTabItem.onTicket || onTicket}
                                customButtonLabel={
                                    activeTabItem.customButtonLabel
                                }
                                onCustomButton={activeTabItem.onCustomButton}
                            />
                        ) : (
                            <ViewCardHeader
                                headerTitle={headerTitle}
                                hideHeaderTitle={hideHeaderTitle}
                                buttons={buttons}
                                ticketButton={ticketButton}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onTicket={onTicket}
                                customButtonLabel={customButtonLabel}
                                onCustomButton={onCustomButton}
                            />
                        )}

                        {/* Tabs Navigation */}
                        {tabs.length > 0 && (
                            <>
                                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.value}
                                            type="button"
                                            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                                                activeTab === tab.value
                                                    ? "text-brand-500 border-b-2 border-brand-500"
                                                    : "text-gray-500 dark:text-gray-400 hover:text-brand-400 hover:border-b hover:border-brand-300"
                                            }`}
                                            onClick={() => {
                                                setActiveTab(tab.value);
                                                updateTab(tab.value);
                                            }}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Render active tab content */}
                                <div className="pt-2">
                                    {activeTabItem && activeTabItem.children}
                                </div>
                            </>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col overflow-hidden">
                        <ViewCardHeader
                            headerTitle={headerTitle}
                            hideHeaderTitle={hideHeaderTitle}
                            buttons={buttons}
                            ticketButton={ticketButton}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onTicket={onTicket}
                            customButtonLabel={customButtonLabel}
                            onCustomButton={onCustomButton}
                        />

                        {/* Sections */}
                        {visibleRows.length > 0 && (
                            <div className="mt-6">
                                {visibleRows.map((row, index) => (
                                    <React.Fragment key={index}>
                                        {row.mainTitle && (
                                            <h2 className="text-left text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                {row.mainTitle}
                                            </h2>
                                        )}

                                        <ViewCardSection label={row.title}>
                                            {row.customRender ? (
                                                row.customRender()
                                            ) : (
                                                <div
                                                    className={`grid grid-cols-1 ${getGridCols()} gap-4`}
                                                >
                                                    {row.fields?.map(
                                                        (field, fieldIndex) => (
                                                            <div
                                                                key={fieldIndex}
                                                                className={`${
                                                                    field.colSpan
                                                                        ? getColSpan(
                                                                              field.colSpan
                                                                          )
                                                                        : ""
                                                                }`}
                                                            >
                                                                <ViewCardField
                                                                    label={
                                                                        field.label
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    type={
                                                                        field.type
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </ViewCardSection>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl ${
                !hideBorder ? "border border-gray-200 dark:border-gray-800" : ""
            }`}
        >
            {renderContent()}

            {/* Global Show More button */}
            {needsShowMore && (
                <div className="flex justify-center bg-gray-50 dark:bg-gray-800 py-3 mt-6 rounded-lg">
                    <button
                        onClick={() => setShowAllContent(!showAllContent)}
                        className="text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600 transition-colors"
                    >
                        {showAllContent ? "Show Less" : "Show More"}
                        <svg
                            className={`w-4 h-4 transition-transform ${
                                showAllContent ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export { ViewCard, ViewCardField, ViewCardSection };
export default ViewCard;
