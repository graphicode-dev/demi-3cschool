/**
 * CreateTicketPage Component
 *
 * Page for students to create a new support ticket.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    AlignLeft,
    Image,
    Send,
    Info,
    CloudUpload,
} from "lucide-react";
import { ProgressStepper } from "../components";
import { supportHelp } from "../navigation";

export function CreateTicketPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!subject.trim()) return;

        setIsSubmitting(true);
        try {
            // TODO: Implement API call
            console.log("Submit ticket:", { subject, description, attachment });
            navigate(supportHelp.root());
        } catch (error) {
            console.error("Failed to create ticket:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(supportHelp.root());
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachment(file);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Header Section */}
            <div className="p-4 pb-0">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {t("supportHelp.createTicket.pageTitle", "Need Help?")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "supportHelp.createTicket.pageSubtitle",
                            "Tell us what problem you have, and we will fix it."
                        )}
                    </p>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="px-4 mb-4">
                <ProgressStepper />
            </div>

            {/* Form */}
            <div className="flex-1 px-4 pb-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-4">
                    {/* What is the problem? */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-gray-500" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "supportHelp.createTicket.whatProblem",
                                    "What is the problem?"
                                )}
                            </h2>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3">
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder={t(
                                    "supportHelp.createTicket.subjectPlaceholder",
                                    "Example: My lesson is not opening"
                                )}
                                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Tell us more */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <AlignLeft className="w-5 h-5 text-gray-500" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "supportHelp.createTicket.tellMore",
                                    "Tell us more"
                                )}
                            </h2>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t(
                                    "supportHelp.createTicket.descriptionPlaceholder",
                                    "Type here..."
                                )}
                                rows={4}
                                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none"
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            {t(
                                "supportHelp.createTicket.descriptionHint",
                                "You can write what happened or what you need help with."
                            )}
                        </p>
                    </div>

                    {/* Picture (Optional) */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <Image className="w-5 h-5 text-gray-500" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "supportHelp.createTicket.picture",
                                    "Picture (Optional)"
                                )}
                            </h2>
                        </div>
                        <label className="block cursor-pointer">
                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-dashed border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
                                <CloudUpload className="w-10 h-10 text-brand-500" />
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {attachment
                                        ? attachment.name
                                        : t(
                                              "supportHelp.createTicket.clickToAdd",
                                              "Click to add a picture"
                                          )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t(
                                        "supportHelp.createTicket.pictureHint",
                                        "You can add a picture if it helps us understand."
                                    )}
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            {t(
                                "supportHelp.createTicket.infoBanner",
                                "Don't worry! Your ticket will be reviewed by our support team soon."
                            )}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!subject.trim() || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-full font-semibold text-sm shadow-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {t(
                            "supportHelp.createTicket.submit",
                            "Send My Problem"
                        )}
                        <Send className="w-4 h-4" />
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={handleCancel}
                        className="w-full flex items-center justify-center px-4 py-2 text-gray-500 font-medium text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        {t(
                            "supportHelp.createTicket.cancel",
                            "Cancel and go back"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTicketPage;
