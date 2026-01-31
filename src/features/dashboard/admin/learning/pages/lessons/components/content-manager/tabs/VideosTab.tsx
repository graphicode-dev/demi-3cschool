/**
 * Videos Tab Component
 *
 * Displays video list and video editor for a lesson.
 * Integrates with lesson videos API.
 */

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { arrayMove } from "@dnd-kit/sortable";
import ContentList from "../ContentList";
import ContentListItem from "../ContentListItem";
import EmptyState from "../EmptyState";
import VideoEditor from "../editors/VideoEditor";
import {  useLessonVideosList } from "../../../api";
import { LessonVideo } from "../../../types";

interface VideosTabProps {
    lessonId: string;
}

export default function VideosTab({ lessonId }: VideosTabProps) {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState<LessonVideo | null>(
        null
    );
    const [isCreating, setIsCreating] = useState(false);

    const { data: allVideos = [], isLoading } = useLessonVideosList();

    const filteredVideos = useMemo(
        () => allVideos.filter((video) => video.lesson?.id === lessonId),
        [allVideos, lessonId]
    );

    const [videos, setVideos] = useState<LessonVideo[]>([]);

    useEffect(() => {
        setVideos(filteredVideos);
    }, [filteredVideos]);

    const handleAddVideo = () => {
        setSelectedVideo(null);
        setIsCreating(true);
    };

    const handleSelectVideo = (video: LessonVideo) => {
        setSelectedVideo(video);
        setIsCreating(false);
    };

    const handleReorder = (activeId: string, overId: string) => {
        setVideos((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
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
        // Will be implemented with API integration
        setIsCreating(false);
    };

    const handleCancel = () => {
        setSelectedVideo(null);
        setIsCreating(false);
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
                        isSelected={selectedVideo?.id === video.id}
                        onClick={() => handleSelectVideo(video)}
                    />
                ))}
            </ContentList>

            {/* Video Editor */}
            <div className="w-2/3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {selectedVideo || isCreating ? (
                    <VideoEditor
                        lessonId={lessonId}
                        video={selectedVideo}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={handleCancel}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}
