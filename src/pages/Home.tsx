import Header from "@/components/home/Header/Header";
import TasksGrid from "@/components/home/TasksGrid/TasksGrid";
import TodoList from "@/components/home/Todo/TodoList";
import { Toaster } from "@/components/ui/sonner";
import SpecialCard from "@/components/home/SpecialCard/SpecialCard";
import NotesCalendar from "@/components/home/NotesCalendar/NotesCalendar";
import JobTracker from "@/components/home/JobTracker/JobTracker";
import PicturesView from "@/components/home/PicturesView/PicturesView";
import ContentViewToggle, {
  type ContentView,
} from "@/components/home/ContentViewToggle/ContentViewToggle";
import QuickCaptureModal from "@/components/home/QuickCaptureModal/QuickCaptureModal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState<string>("default");
  const [contentView, setContentView] = useState<ContentView>("notes");
  const [hideHeaders, setHideHeaders] = useState<boolean>(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState<boolean>(true);

  useEffect(() => {
    if (location.state?.openQuickCapture) {
      setIsQuickCaptureOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSuperOrAlt = e.metaKey || (e.altKey && !e.ctrlKey);
      if (isSuperOrAlt && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsQuickCaptureOpen((prev) => !prev);
      }
    };

    const handleOpenQuickCapture = () => {
      setIsQuickCaptureOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-quick-capture", handleOpenQuickCapture);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-quick-capture", handleOpenQuickCapture);
    };
  }, []);

  const isCalendar = contentView === "calendar";
  const isJobs = contentView === "jobs";
  const isPictures = contentView === "pictures";

  return (
    <>
      <main className="flex min-h-screen w-screen flex-col gap-3 overflow-y-auto p-3 lg:h-screen lg:overflow-hidden">
        <ContentViewToggle
          view={contentView}
          onViewChange={setContentView}
          hideHeaders={hideHeaders}
          onHideHeadersChange={setHideHeaders}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />

        {/* Headers Drawer — shown for notes/calendar/jobs when not hidden */}
        {!isPictures && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div
              className={`flex w-full origin-top flex-col gap-4 overflow-hidden transition-all duration-300 lg:flex-row lg:items-stretch ${
                hideHeaders
                  ? "pointer-events-none max-h-0 scale-y-0 gap-0 opacity-0"
                  : "max-h-[500px] scale-y-100 opacity-100"
              }`}
            >
              <div className="order-1 flex min-w-0 flex-col lg:order-1 lg:flex-1">
                <Header selectedSection={selectedSection} />
              </div>
              <div className="order-2 flex">
                <SpecialCard />
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* Content area — switches between Notes grid, Calendar, Job Tracker, and Pictures */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {isCalendar ? (
            <NotesCalendar />
          ) : isJobs ? (
            <JobTracker />
          ) : isPictures ? (
            <PicturesView />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row">
              <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                <TasksGrid selectedSection={selectedSection} onSectionSelect={setSelectedSection} />
              </div>
              <div className="flex h-full w-full flex-col overflow-hidden lg:w-80 xl:w-96">
                <TodoList />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>
      <QuickCaptureModal
        open={isQuickCaptureOpen}
        onOpenChange={setIsQuickCaptureOpen}
        selectedSection={selectedSection}
        autoReopenDelayMs={5000}
      />
      <Toaster />
    </>
  );
}
