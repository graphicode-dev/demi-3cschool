/**
 * Videos Tab Component
 *
 * Displays video list and video editor for a lesson.
 * Integrates with lesson videos API.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import ContentList from "../ContentList";
import ContentListItem from "../ContentListItem";
import EmptyState from "../EmptyState";
import VideoEditor from "../editors/VideoEditor";
import VideoQuizEditor from "../editors/VideoQuizEditor";
import { useLessonVideosByLevel } from "../../../api";
import { LessonVideo } from "../../../types";

type EditorMode = "video" | "quiz" | "none";

interface VideosTabProps {
    lessonId: string;
    levelId: string;
}

export default function VideosTab({ lessonId, levelId }: VideosTabProps) {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState<LessonVideo | null>(
        null
    );
    const [isCreating, setIsCreating] = useState(false);
    const [editorMode, setEditorMode] = useState<EditorMode>("none");
    const [quizVideoId, setQuizVideoId] = useState<string | null>(null);

    const { data: videos = [], isLoading } = useLessonVideosByLevel(levelId);

    const handleAddVideo = () => {
        setSelectedVideo(null);
        setIsCreating(true);
        setEditorMode("video");
        setQuizVideoId(null);
    };

    const handleSelectVideo = (video: LessonVideo) => {
        setSelectedVideo(video);
        setIsCreating(false);
        setEditorMode("video");
        setQuizVideoId(null);
    };

    const handleQuizClick = (video: LessonVideo) => {
        setSelectedVideo(null);
        setIsCreating(false);
        setEditorMode("quiz");
        setQuizVideoId(video.id);
    };

    const handleReorder = (activeId: string, overId: string) => {
        // TODO: Implement reorder via API
        console.log("Reorder:", activeId, "->", overId);
    };

    const renderDragOverlay = (activeId: string) => {
        const video = videos.find((v) => v.id === activeId);
        if (!video) return null;
        return (
            <ContentListItem
                id={video.id}
                title={video.title}
                type="video"
                duration={video.duration}
                isPublished={video.isActive === 1}
            />
        );
    };

    const handleSave = () => {
        setIsCreating(false);
        setEditorMode("none");
    };

    const handleCancel = () => {
        setSelectedVideo(null);
        setIsCreating(false);
        setEditorMode("none");
        setQuizVideoId(null);
    };

    const handleQuizSave = () => {
        setEditorMode("none");
        setQuizVideoId(null);
    };

    const handleQuizCancel = () => {
        setEditorMode("none");
        setQuizVideoId(null);
    };

    const renderEditor = () => {
        if (editorMode === "quiz" && quizVideoId) {
            return (
                <VideoQuizEditor
                    videoId={quizVideoId}
                    onSave={handleQuizSave}
                    onCancel={handleQuizCancel}
                />
            );
        }

        if (editorMode === "video" && (selectedVideo || isCreating)) {
            return (
                <VideoEditor
                    lessonId={lessonId}
                    video={selectedVideo}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={handleCancel}
                />
            );
        }

        return <EmptyState />;
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Video List */}
            <ContentList
                title={t("lessons:content.videos.listTitle", "Video List")}
                count={videos.length}
                itemIds={videos.map((v) => v.id)}
                onReorder={handleReorder}
                onAddItem={handleAddVideo}
                isLoading={isLoading}
                renderDragOverlay={renderDragOverlay}
            >
                {videos.map((video) => (
                    <ContentListItem
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        type="video"
                        duration={video.duration}
                        isPublished={video.isActive === 1}
                        isSelected={
                            editorMode === "video" &&
                            selectedVideo?.id === video.id
                        }
                        onClick={() => handleSelectVideo(video)}
                        onQuizClick={() => handleQuizClick(video)}
                        isQuizSelected={
                            editorMode === "quiz" && quizVideoId === video.id
                        }
                    />
                ))}
            </ContentList>

            {/* Editor Panel */}
            <div className="w-2/3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {renderEditor()}
            </div>
        </div>
    );
}
