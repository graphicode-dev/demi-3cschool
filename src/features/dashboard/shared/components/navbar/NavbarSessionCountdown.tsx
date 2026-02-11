import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Monitor } from "lucide-react";
import { useMyCurrentSession } from "@/features/dashboard/classroom/mySchedule/api";
import type { MyCurrentSession } from "@/features/dashboard/classroom/mySchedule/types";
import { SessionInfoModal } from "@/features/dashboard/classroom/virtualSessions/components/SessionInfoModal";
import type { VirtualSession } from "@/features/dashboard/classroom/virtualSessions/types";

interface SessionEvent {
    id: number;
    sessionState: string;
    status: string;
    effectiveLocationType: "online" | "offline";
    group: {
        id: number;
        name: string;
        locationType: "online" | "offline";
        location: string;
        locationMapUrl: string;
    };
    sessionDate: string;
    startTime: string;
    endTime: string;
    topic: string;
    lesson: {
        id: number;
        title: string;
    };
    isCancelled: boolean;
    cancellationReason: string | null;
    meetingProvider: string | null;
    meetingId: string | null;
    hasMeeting: boolean;
    linkMeeing?: string | null;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

type SessionKind = "online" | "offline";

const NavbarSessionCountdown = () => {
    const { t, i18n } = useTranslation("shared");
    const isRTL = i18n.language === "ar";
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [countdownMode, setCountdownMode] = useState<
        "upcoming" | "current" | "ended"
    >("ended");
    const [showInfoModal, setShowInfoModal] = useState(false);

    const { data: currentSession, isLoading, isError } = useMyCurrentSession();

    const sessionEvent = useMemo(():
        | (SessionEvent & { kind: SessionKind })
        | null => {
        const s: MyCurrentSession | null | undefined = currentSession;
        if (!s) return null;

        const kind =
            s.locationType === "offline"
                ? ("offline" as const)
                : ("online" as const);

        return {
            id: s.id,
            kind,
            sessionState: String(s.sessionState ?? ""),
            status: String(s.status ?? ""),
            effectiveLocationType: s.effectiveLocationType,
            group: {
                id: s.group?.id ?? 0,
                name: s.group?.name ?? "",
                locationType: kind,
                location: s.offlineLocation ?? "",
                locationMapUrl: "",
            },
            sessionDate: s.sessionDate,
            startTime: s.startTime,
            endTime: s.endTime,
            topic: s.lesson?.title ?? "",
            lesson: {
                id: s.lesson?.id ?? 0,
                title: s.lesson?.title ?? "",
            },
            isCancelled: Boolean(s.reason),
            cancellationReason: s.reason,
            meetingProvider: "bbb",
            meetingId: s.bbbMeetingId,
            hasMeeting: Boolean(s.hasMeeting),
            linkMeeing: s.hasMeeting ? (s.bbbMeetingId ?? null) : null,
        };
    }, [currentSession]);

    // Transform session data for SessionInfoModal
    const virtualSession = useMemo((): VirtualSession | null => {
        if (!sessionEvent || !currentSession) return null;

        return {
            id: sessionEvent.id,
            group: {
                id: sessionEvent.group.id,
                name: sessionEvent.group.name,
                locationType: sessionEvent.group.locationType,
            },
            course: {
                id: 0,
                title: currentSession.group?.name ?? "",
            },
            term: {
                id: 1,
                name: t("sessionBanner.currentTerm", "Current Term"),
            },
            sessionDate: sessionEvent.sessionDate,
            startTime: sessionEvent.startTime,
            endTime: sessionEvent.endTime,
            topic: sessionEvent.topic || sessionEvent.lesson.title,
            lesson: sessionEvent.lesson,
            description: "",
            isCancelled: sessionEvent.isCancelled,
            cancellationReason: sessionEvent.cancellationReason,
            meetingProvider: sessionEvent.meetingProvider ?? "bbb",
            meetingId: sessionEvent.meetingId ?? "",
            linkMeeting: sessionEvent.linkMeeing ?? "",
            contentProgress: {
                total: {
                    totalContents: 0,
                    completedContents: 0,
                    totalProgressPercentage: 0,
                },
                items: [],
            },
            instructor: {
                id: currentSession.teacher?.id ?? 0,
                name: currentSession.teacher?.name ?? "",
                course: currentSession.group?.name ?? "",
            },
            createdAt: currentSession.createdAt,
            updatedAt: currentSession.updatedAt,
        };
    }, [sessionEvent, currentSession, t]);

    const sessionTiming = useMemo(() => {
        if (!sessionEvent) return null;
        const start = new Date(
            `${sessionEvent.sessionDate}T${sessionEvent.startTime}`
        );
        const end = new Date(
            `${sessionEvent.sessionDate}T${sessionEvent.endTime}`
        );
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
            return null;
        return { start, end };
    }, [sessionEvent]);

    // Calculate time left
    useEffect(() => {
        if (!sessionTiming) {
            setTimeLeft(null);
            setCountdownMode("ended");
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const target =
                now < sessionTiming.start
                    ? sessionTiming.start
                    : now >= sessionTiming.start && now < sessionTiming.end
                      ? sessionTiming.end
                      : null;

            const mode =
                now < sessionTiming.start
                    ? "upcoming"
                    : now >= sessionTiming.start && now < sessionTiming.end
                      ? "current"
                      : "ended";

            setCountdownMode(mode);
            if (!target) {
                setTimeLeft(null);
                return;
            }

            const difference = target.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    total: 0,
                });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, total: difference });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [sessionTiming]);

    const displayTitle =
        sessionEvent?.topic ||
        sessionEvent?.lesson?.title ||
        (isLoading
            ? t("sessionBanner.loadingTitle")
            : isError
              ? t("sessionBanner.errorTitle")
              : t("sessionBanner.emptyTitle"));

    const displaySubtitle =
        sessionEvent?.group?.name ||
        (isLoading
            ? t("sessionBanner.loadingSubtitle")
            : isError
              ? t("sessionBanner.errorSubtitle")
              : t("sessionBanner.emptySubtitle"));

    // Calculate total minutes for display logic
    const displayTime = useMemo(() => {
        if (!timeLeft)
            return {
                value1: "00",
                value2: "00",
                label1: "h",
                label2: "m",
                showDays: false,
            };

        // More than 24 hours: show days and hours
        if (timeLeft.days > 0) {
            return {
                value1: timeLeft.days.toString().padStart(2, "0"),
                value2: timeLeft.hours.toString().padStart(2, "0"),
                label1: "d",
                label2: "h",
                showDays: true,
            };
        }

        // Less than 24 hours: show hours and minutes
        return {
            value1: timeLeft.hours.toString().padStart(2, "0"),
            value2: timeLeft.minutes.toString().padStart(2, "0"),
            label1: "h",
            label2: "m",
            showDays: false,
        };
    }, [timeLeft]);

    // Gradient color stages based on time remaining
    const gradientClass = useMemo(() => {
        if (countdownMode === "current") {
            // Session is live - red/orange gradient
            return "from-[#EF4444] via-[#F97316] to-[#EF4444]";
        }

        if (!timeLeft) return "from-[#00ADEF] via-[#FFB800] to-[#00ADEF]";

        const totalMinutes = Math.floor(timeLeft.total / (1000 * 60));

        // Less than 30 minutes - urgent red/orange
        if (totalMinutes <= 30) {
            return "from-[#F97316] via-[#EF4444] to-[#F97316]";
        }
        // Less than 1 hour - warning orange/yellow
        if (totalMinutes <= 60) {
            return "from-[#F59E0B] via-[#F97316] to-[#F59E0B]";
        }
        // Less than 3 hours - yellow/green
        if (totalMinutes <= 180) {
            return "from-[#FFB800] via-[#84CC16] to-[#FFB800]";
        }
        // Less than 24 hours - green/blue
        if (totalMinutes <= 1440) {
            return "from-[#22C55E] via-[#00ADEF] to-[#22C55E]";
        }
        // More than 24 hours - calm blue
        return "from-[#00ADEF] via-[#6366F1] to-[#00ADEF]";
    }, [timeLeft, countdownMode]);

    const lateSeconds = useMemo(() => {
        if (!sessionTiming) return null;
        if (countdownMode !== "current") return null;
        const now = new Date();
        const diff = now.getTime() - sessionTiming.start.getTime();
        return diff > 0 ? Math.floor(diff / 1000) : 0;
    }, [sessionTiming, countdownMode]);

    const formatDuration = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const hh = hrs.toString().padStart(2, "0");
        const mm = mins.toString().padStart(2, "0");
        const ss = secs.toString().padStart(2, "0");
        return hrs > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const formatBannerDayTime = () => {
        if (!sessionEvent) return t("sessionBanner.fallbackDayTime");

        const date = new Date(
            `${sessionEvent.sessionDate}T${sessionEvent.startTime}`
        );
        if (Number.isNaN(date.getTime()))
            return t("sessionBanner.fallbackDayTime");

        const weekday = date.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
            weekday: "long",
        });
        const timeStr = date.toLocaleTimeString(isRTL ? "ar-EG" : "en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
        return `${weekday} • ${timeStr}`;
    };

    const handleJoinClick = () => {
        if (!sessionEvent) return;
        if (sessionEvent.group.locationType !== "online") return;
        if (!sessionEvent.hasMeeting) return;
        if (!sessionEvent.linkMeeing) return;

        window.open(sessionEvent.linkMeeing, "_blank");
    };

    const isCurrent =
        (sessionEvent?.sessionState?.toLowerCase().includes("current") ??
            false) ||
        countdownMode === "current";

    const countdownLabel =
        countdownMode === "current"
            ? t("sessionBanner.endsIn")
            : t("sessionBanner.startsIn");

    const locationLabel =
        sessionEvent?.group.locationType === "offline"
            ? t("sessionBanner.offline")
            : t("sessionBanner.online");

    const formatTimeRange = () => {
        if (!sessionEvent) return "";
        const start = sessionEvent.startTime?.slice(0, 5) ?? "";
        const end = sessionEvent.endTime?.slice(0, 5) ?? "";
        if (!start || !end) return "";
        return `${start} - ${end}`;
    };

    return (
        <div className="relative w-full group overflow-hidden rounded-full animate-in slide-in-from-top duration-700 shadow-xl shadow-blue-500/10">
            <div
                className={`absolute inset-0 bg-size-[300%_300%] animate-gradient-slow bg-linear-to-r opacity-95 ${gradientClass}`}
            />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-white/10 blur-[100px] rotate-45 animate-pulse" />
                <div className="absolute bottom-[-50%] right-[-10%] w-[30%] h-[150%] bg-yellow-200/20 blur-[80px] -rotate-45 animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-10 py-3 flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-6">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {isCurrent
                                ? t("sessionBanner.liveNow")
                                : t("sessionBanner.upcoming")}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-white font-black text-lg tracking-tight leading-tight flex items-center gap-2 drop-shadow-sm">
                            {displayTitle}{" "}
                            <Sparkles
                                size={16}
                                className="text-white/80 animate-bounce"
                            />
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-black uppercase tracking-widest">
                                <Monitor size={12} strokeWidth={2.5} />
                                {locationLabel}
                            </div>
                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                                {formatBannerDayTime()}
                            </p>
                            {!!sessionEvent && !!formatTimeRange() && (
                                <>
                                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                                        {t("sessionBanner.timeRange", {
                                            defaultValue: "Time",
                                        })}
                                        : {formatTimeRange()}
                                    </p>
                                </>
                            )}
                        </div>
                        {!!displaySubtitle && (
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                {displaySubtitle}
                            </p>
                        )}
                        {!!sessionEvent && (
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                                    {t("sessionBanner.sessionId")}: #
                                    {sessionEvent.id}
                                </span>
                                {!!sessionEvent.sessionState && (
                                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                                        {t("sessionBanner.state")}:{" "}
                                        {sessionEvent.sessionState}
                                    </span>
                                )}
                                {!!sessionEvent.status && (
                                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                                        {t("sessionBanner.status")}:{" "}
                                        {sessionEvent.status}
                                    </span>
                                )}
                                {!!sessionEvent.cancellationReason && (
                                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest line-clamp-1">
                                        {t("sessionBanner.reason")}:{" "}
                                        {sessionEvent.cancellationReason}
                                    </span>
                                )}
                                {sessionEvent.group.locationType ===
                                    "offline" &&
                                    !!sessionEvent.group.location && (
                                        <a
                                            href={sessionEvent.group.location}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white/80 text-[9px] font-black uppercase tracking-widest underline underline-offset-2"
                                        >
                                            {t("sessionBanner.openLocation")}
                                        </a>
                                    )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end me-2">
                            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">
                                {countdownLabel}
                            </span>
                            {lateSeconds != null && (
                                <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">
                                    {t("sessionBanner.lateBy")}:{" "}
                                    {formatDuration(lateSeconds)}
                                </span>
                            )}
                        </div>
                        {[
                            {
                                val: displayTime.value1,
                                label: t(
                                    `sessionBanner.time.${displayTime.label1}`
                                ),
                            },
                            {
                                val: displayTime.value2,
                                label: t(
                                    `sessionBanner.time.${displayTime.label2}`
                                ),
                            },
                        ].map((unit, idx) => (
                            <Fragment key={idx}>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                                        <span className="text-white font-black text-xl tabular-nums">
                                            {unit.val}
                                        </span>
                                    </div>
                                    <span className="text-[8px] font-black text-white/60 uppercase mt-1 tracking-tighter">
                                        {unit.label}
                                    </span>
                                </div>
                                {idx < 1 && (
                                    <span className="text-white/50 font-black text-xl mb-3">
                                        :
                                    </span>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {isCurrent ? (
                        <button
                            onClick={handleJoinClick}
                            disabled={
                                !sessionEvent?.hasMeeting ||
                                !sessionEvent?.linkMeeing
                            }
                            className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/90 text-gray-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("sessionBanner.join")}
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowInfoModal(true)}
                            disabled={!sessionEvent}
                            className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("sessionBanner.details")}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
          @keyframes gradient-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-slow {
            animation: gradient-slow 10s ease infinite;
          }
        `}</style>

            {/* Session Info Modal */}
            {virtualSession && (
                <SessionInfoModal
                    session={virtualSession}
                    isOpen={showInfoModal}
                    onClose={() => setShowInfoModal(false)}
                />
            )}
        </div>
    );
};

export default NavbarSessionCountdown;
