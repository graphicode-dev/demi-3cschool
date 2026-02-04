import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Video, ExternalLink, Sparkles } from "lucide-react";
import { useCurriculumTerms } from "@/features/dashboard/classroom/components/TermStepper";
import { useOnlineSessions } from "@/features/dashboard/classroom/virtualSessions/api";
import { useOfflineSessions } from "@/features/dashboard/classroom/physicalSessions/api/physicalSessions.queries";

interface SessionEvent {
    id: number;
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
    const { t, i18n } = useTranslation("dashboard");
    const isRTL = i18n.language === "ar";
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [fallbackSeconds, setFallbackSeconds] = useState(15 * 60);

    const { selectedTermId } = useCurriculumTerms();

    const {
        data: onlineSessions = [],
        isLoading: isLoadingOnline,
        isError: isOnlineError,
    } = useOnlineSessions(selectedTermId, { enabled: !!selectedTermId });
    const {
        data: offlineSessions = [],
        isLoading: isLoadingOffline,
        isError: isOfflineError,
    } = useOfflineSessions(selectedTermId, { enabled: !!selectedTermId });

    const isLoading = isLoadingOnline || isLoadingOffline;
    const isError = isOnlineError || isOfflineError;

    useEffect(() => {
        const timer = setInterval(() => {
            setFallbackSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const sessions: Array<SessionEvent & { kind: SessionKind }> =
        useMemo(() => {
            const online = onlineSessions.map((s) => ({
                id: s.id,
                kind: "online" as const,
                group: {
                    id: s.group.id,
                    name: s.group.name,
                    locationType: "online" as const,
                    location: "",
                    locationMapUrl: "",
                },
                sessionDate: s.sessionDate,
                startTime: s.startTime,
                endTime: s.endTime,
                topic: s.lesson?.title ?? "",
                lesson: {
                    id: s.lesson.id,
                    title: s.lesson.title,
                },
                isCancelled: Boolean(s.reason),
                cancellationReason: s.reason,
                meetingProvider: "bbb",
                meetingId: s.bbbMeetingId,
                hasMeeting: Boolean(s.hasMeeting),
                linkMeeing: s.hasMeeting ? (s.bbbMeetingId ?? null) : null,
            }));

            const offline = offlineSessions.map((s) => ({
                id: s.id,
                kind: "offline" as const,
                group: {
                    id: s.group.id,
                    name: s.group.name,
                    locationType: "offline" as const,
                    location: s.offlineLocation ?? "",
                    locationMapUrl: "",
                },
                sessionDate: s.sessionDate,
                startTime: s.startTime,
                endTime: s.endTime,
                topic: s.lesson?.title ?? "",
                lesson: {
                    id: s.lesson.id,
                    title: s.lesson.title,
                },
                isCancelled: Boolean(s.reason),
                cancellationReason: s.reason,
                meetingProvider: "bbb",
                meetingId: s.bbbMeetingId,
                hasMeeting: Boolean(s.hasMeeting),
                linkMeeing: s.hasMeeting ? (s.bbbMeetingId ?? null) : null,
            }));

            return [...online, ...offline];
        }, [onlineSessions, offlineSessions]);

    // Find the next upcoming session
    const nextSession = useMemo(() => {
        if (!sessions || sessions.length === 0) return null;

        const now = new Date();
        const upcomingSessions = sessions
            .filter((session: SessionEvent) => {
                if (session.isCancelled) return false;
                const sessionDateTime = new Date(
                    `${session.sessionDate}T${session.startTime}`
                );
                return sessionDateTime > now;
            })
            .sort((a: SessionEvent, b: SessionEvent) => {
                const dateA = new Date(`${a.sessionDate}T${a.startTime}`);
                const dateB = new Date(`${b.sessionDate}T${b.startTime}`);
                return dateA.getTime() - dateB.getTime();
            });

        return upcomingSessions[0] as SessionEvent | undefined;
    }, [sessions]);

    // Calculate time left
    useEffect(() => {
        if (!nextSession) return;

        const calculateTimeLeft = () => {
            const sessionDateTime = new Date(
                `${nextSession.sessionDate}T${nextSession.startTime}`
            );
            const now = new Date();
            const difference = sessionDateTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft(null);
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
    }, [nextSession]);

    const formatTime = (time: string) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const isStartingSoon = Boolean(
        timeLeft && timeLeft.total <= 30 * 60 * 1000
    );
    const isVeryClose = Boolean(timeLeft && timeLeft.total <= 5 * 60 * 1000);

    const getStatusColor = () => {
        if (!selectedTermId) return "bg-brand-500";
        if (isVeryClose) return "bg-red-500";
        if (isStartingSoon) return "bg-amber-500";
        return "bg-brand-500";
    };

    const getTextColor = () => {
        if (!selectedTermId) return "text-brand-600 dark:text-brand-400";
        if (isVeryClose) return "text-red-600 dark:text-red-400";
        if (isStartingSoon) return "text-amber-600 dark:text-amber-400";
        return "text-brand-600 dark:text-brand-400";
    };

    const formatSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const displayTitle =
        nextSession?.topic ||
        nextSession?.lesson?.title ||
        "Mastering Maze Game Logic";
    const displaySubtitle =
        nextSession?.group?.name || "Level 1: Candidate Exclusive";

    const displayTotalSeconds =
        timeLeft?.total != null
            ? Math.max(0, Math.floor(timeLeft.total / 1000))
            : fallbackSeconds;

    const handleJoinClick = () => {
        if (!nextSession) return;
        if (nextSession.group.locationType !== "online") return;
        if (!nextSession.hasMeeting) return;
        if (!nextSession.linkMeeing) return;
        window.open(nextSession.linkMeeing, "_blank");
    };

    return (
        <div className="relative group overflow-hidden border-b border-white/10 animate-in slide-in-from-top duration-700">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-[length:200%_200%] animate-gradient-slow bg-gradient-to-r from-[#00ADEF] via-[#FFB800] to-[#007ABF] opacity-95" />

            {/* Floating Light Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[200%] bg-white/10 blur-[80px] rotate-45 animate-pulse" />
                <div className="absolute bottom-[-50%] right-[-10%] w-[30%] h-[200%] bg-yellow-300/20 blur-[100px] -rotate-45 animate-pulse delay-700" />
            </div>

            <div className=" mx-auto px-10 py-3.5 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-6">
                    {/* Animated Status Badge */}
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">
                            Session Live
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:rotate-6 transition-transform">
                            <Video size={18} />
                        </div>
                        <div>
                            <p className="text-white font-black text-[15px] tracking-tight drop-shadow-sm flex items-center gap-2">
                                {displayTitle}{" "}
                                <Sparkles
                                    size={14}
                                    className="text-yellow-200 animate-bounce"
                                />
                            </p>
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
                                {displaySubtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/80">
                            <Clock size={14} />
                        </div>
                        <div>
                            <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                                Starts In
                            </p>
                            <p className="text-white font-black text-lg tabular-nums tracking-tighter leading-none drop-shadow-sm">
                                {formatSeconds(displayTotalSeconds)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleJoinClick}
                        className="bg-white text-[#007ABF] px-8 py-3.5 rounded-[18px] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-black/10 hover:shadow-white/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3 border border-white group/btn"
                    >
                        Join Class{" "}
                        <ExternalLink
                            size={14}
                            className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient-slow 12s ease infinite;
        }
      `}</style>
        </div>
    );
};

export default NavbarSessionCountdown;
