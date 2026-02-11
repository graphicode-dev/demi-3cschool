/**
 * InternalNotesTab Component
 *
 * Displays internal notes and allows adding new notes.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import type { InternalNote } from "../types";
import { format } from "date-fns";

interface InternalNotesTabProps {
    notes: InternalNote[];
    onAddNote: (content: string) => void;
    isLoading?: boolean;
}

export function InternalNotesTab({
    notes,
    onAddNote,
    isLoading,
}: InternalNotesTabProps) {
    const { t } = useTranslation("adminTicketsManagement");
    const [newNote, setNewNote] = useState("");

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAddNote(newNote.trim());
            setNewNote("");
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Warning banner */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                        {t(
                            "tickets.internalNotes.warning",
                            "Internal notes are only visible to customer service and operations team"
                        )}
                    </span>
                </div>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t(
                            "tickets.internalNotes.empty",
                            "No internal notes yet"
                        )}
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-black dark:bg-gray-600 shrink-0 flex items-center justify-center text-white dark:text-gray-300 text-xs font-medium">
                                {getInitials(note.authorName)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {note.authorName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(
                                            new Date(note.createdAt),
                                            "MMM dd, yyyy h:mm a"
                                        )}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add note input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddNote();
                            }
                        }}
                        placeholder={t(
                            "tickets.internalNotes.placeholder",
                            "Add an internal note..."
                        )}
                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || isLoading}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        {t("tickets.internalNotes.addNote", "+ Add Note")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InternalNotesTab;
