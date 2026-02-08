import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Sparkles, Monitor } from "lucide-react";
import { useMyCurrentSession } from "@/features/dashboard/classroom/mySchedule/api";
import type { MyCurrentSession } from "@/features/dashboard/classroom/mySchedule/types";

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
    const { t, i18n } = useTranslation("dashboard");
    const isRTL = i18n.language === "ar";
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [fallbackSeconds, setFallbackSeconds] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [countdownMode, setCountdownMode] = useState<
        "upcoming" | "current" | "ended"
    >("ended");

    const { data: currentSession, isLoading, isError } = useMyCurrentSession();

    useEffect(() => {
        const timer = setInterval(() => {
            setFallbackSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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

    const displayTotalSeconds = useMemo(() => {
        if (timeLeft?.total != null) {
            return Math.max(0, Math.floor(timeLeft.total / 1000));
        }
        if (countdownMode !== "ended") {
            return 0;
        }
        return fallbackSeconds;
    }, [timeLeft?.total, countdownMode, fallbackSeconds]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return {
            hrs: hrs.toString().padStart(2, "0"),
            mins: mins.toString().padStart(2, "0"),
            secs: secs.toString().padStart(2, "0"),
        };
    };

    const time = formatTime(displayTotalSeconds);

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
                className={`absolute inset-0 bg-size-[300%_300%] animate-gradient-slow bg-linear-to-r opacity-95 ${
                    isCurrent
                        ? "from-[#EF4444] via-[#F97316] to-[#EF4444]"
                        : "from-[#00ADEF] via-[#FFB800] to-[#00ADEF]"
                }`}
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
                            { val: time.hrs, label: t("sessionBanner.time.h") },
                            {
                                val: time.mins,
                                label: t("sessionBanner.time.m"),
                            },
                            {
                                val: time.secs,
                                label: t("sessionBanner.time.s"),
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
                                {idx < 2 && (
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
                            onClick={() => setShowDetails((v) => !v)}
                            disabled={!sessionEvent}
                            className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {showDetails
                                ? t("sessionBanner.hideDetails")
                                : t("sessionBanner.details")}
                        </button>
                    )}
                </div>
            </div>

            {showDetails && !!sessionEvent && (
                <div className="max-w-7xl mx-auto px-10 pb-3 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white/90">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest">
                            <span>
                                {t("sessionBanner.sessionId")}: #
                                {sessionEvent.id}
                            </span>
                            {!!sessionEvent.sessionState && (
                                <span>
                                    {t("sessionBanner.state")}:{" "}
                                    {sessionEvent.sessionState}
                                </span>
                            )}
                            {!!sessionEvent.status && (
                                <span>
                                    {t("sessionBanner.status")}:{" "}
                                    {sessionEvent.status}
                                </span>
                            )}
                        </div>

                        {!!sessionEvent.cancellationReason && (
                            <p className="mt-2 text-[11px] font-semibold">
                                {t("sessionBanner.reason")}:{" "}
                                {sessionEvent.cancellationReason}
                            </p>
                        )}

                        {sessionEvent.group.locationType === "offline" &&
                            !!sessionEvent.group.location && (
                                <a
                                    href={sessionEvent.group.location}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest underline underline-offset-2"
                                >
                                    {t("sessionBanner.openLocation")}
                                    <ExternalLink size={12} />
                                </a>
                            )}
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default NavbarSessionCountdown;
