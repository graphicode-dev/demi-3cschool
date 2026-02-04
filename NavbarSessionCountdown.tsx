import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Video, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useCoursesServices } from "@/features/dashboard/services/courses.services";
import { Link } from "react-router-dom";

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

const NavbarSessionCountdown = () => {
  const { t, i18n } = useTranslation("dashboard");
  const isRTL = i18n.language === "ar";
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const { getAllSessions } = useCoursesServices();
  const { data: sessions = [], isLoading } = getAllSessions();

  // Find the next upcoming session
  const nextSession = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;

    const now = new Date();
    const upcomingSessions = sessions
      .filter((session: SessionEvent) => {
        if (session.isCancelled) return false;
        const sessionDateTime = new Date(
          `${session.sessionDate}T${session.startTime}`,
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
        `${nextSession.sessionDate}T${nextSession.startTime}`,
      );
      const now = new Date();
      const difference = sessionDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
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

  // Don't show if loading, no session, or no time left
  if (isLoading || !nextSession || !timeLeft) return null;

  // Check if session is starting soon (within 30 minutes)
  const isStartingSoon = timeLeft.total <= 30 * 60 * 1000;
  // Check if session is very close (within 5 minutes)
  const isVeryClose = timeLeft.total <= 5 * 60 * 1000;

  const getStatusColor = () => {
    if (isVeryClose) return "bg-red-500";
    if (isStartingSoon) return "bg-amber-500";
    return "bg-brand-500";
  };

  const getTextColor = () => {
    if (isVeryClose) return "text-red-600 dark:text-red-400";
    if (isStartingSoon) return "text-amber-600 dark:text-amber-400";
    return "text-brand-600 dark:text-brand-400";
  };

  const getBgColor = () => {
    if (isVeryClose) return "bg-red-50 dark:bg-red-500/10";
    if (isStartingSoon) return "bg-amber-50 dark:bg-amber-500/10";
    return "bg-brand-50 dark:bg-brand-500/10";
  };

  const getBorderColor = () => {
    if (isVeryClose) return "border-red-200 dark:border-red-800";
    if (isStartingSoon) return "border-amber-200 dark:border-amber-800";
    return "border-brand-200 dark:border-brand-800";
  };

  return (
    <div className="relative">
      {/* Compact Countdown Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${getBgColor()} ${getBorderColor()} hover:shadow-md ${
          isVeryClose ? "animate-pulse" : ""
        }`}
      >
        <div className={`p-1 rounded-lg ${getStatusColor()}`}>
          {nextSession.group.locationType === "online" ? (
            <Video className="h-3.5 w-3.5 text-white" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-white" />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className={`h-4 w-4 ${getTextColor()}`} />
          <span className={`font-bold tabular-nums text-sm ${getTextColor()}`}>
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className={`h-4 w-4 ${getTextColor()}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 ${getTextColor()}`} />
        )}
      </button>

      {/* Expanded Dropdown */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />

          {/* Dropdown Content */}
          <div
            className={`absolute top-full mt-2 z-50 w-[320px] rounded-2xl border shadow-xl overflow-hidden ${
              isRTL ? "left-0" : "right-0"
            } ${getBgColor()} ${getBorderColor()}`}
          >
            {/* Header */}
            <div className={`px-4 py-3 border-b ${getBorderColor()}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${getTextColor()}`}>
                  {t("pages.student.schedule.nextSession", "Next Session")}
                </span>
                {isStartingSoon && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full text-white ${getStatusColor()} ${
                      isVeryClose ? "animate-pulse" : ""
                    }`}
                  >
                    {isVeryClose
                      ? t("pages.student.schedule.startingNow", "Starting Now!")
                      : t("pages.student.schedule.soon", "Soon")}
                  </span>
                )}
              </div>
            </div>

            {/* Session Info */}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white truncate">
                {nextSession.topic || nextSession.lesson?.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {nextSession.group.name}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {formatDate(nextSession.sessionDate)} •{" "}
                  {formatTime(nextSession.startTime)} -{" "}
                  {formatTime(nextSession.endTime)}
                </span>
              </div>

              {/* Countdown Display */}
              <div className="flex items-center justify-center gap-3 mt-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold tabular-nums ${getTextColor()}`}
                    >
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                      {t("pages.student.schedule.countdown.days", "Days")}
                    </div>
                  </div>
                )}
                {timeLeft.days > 0 && (
                  <span className={`text-xl font-bold ${getTextColor()}`}>
                    :
                  </span>
                )}
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold tabular-nums ${getTextColor()}`}
                  >
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                    {t("pages.student.schedule.countdown.hours", "Hours")}
                  </div>
                </div>
                <span className={`text-xl font-bold ${getTextColor()}`}>:</span>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold tabular-nums ${getTextColor()}`}
                  >
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                    {t("pages.student.schedule.countdown.mins", "Mins")}
                  </div>
                </div>
                <span className={`text-xl font-bold ${getTextColor()}`}>:</span>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold tabular-nums ${getTextColor()}`}
                  >
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                    {t("pages.student.schedule.countdown.secs", "Secs")}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  to="/schedule"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {t("pages.student.schedule.viewSchedule", "View Schedule")}
                </Link>
                {nextSession.hasMeeting && nextSession.linkMeeing && (
                  <a
                    href={nextSession.linkMeeing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-center text-white rounded-xl transition-colors ${getStatusColor()} hover:opacity-90 ${
                      isVeryClose ? "animate-pulse" : ""
                    }`}
                  >
                    {t("pages.student.schedule.joinNow", "Join Now")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavbarSessionCountdown;
