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
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { useState } from "react";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<string>("default");
  const [contentView, setContentView] = useState<ContentView>("notes");
  const [hideHeaders, setHideHeaders] = useState<boolean>(false);

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
        />

        {/* Headers Drawer — shown for notes/calendar/jobs when not hidden */}
        {!isPictures && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div
              className={`flex w-full flex-col gap-4 lg:flex-row lg:items-stretch transition-all duration-300 origin-top overflow-hidden ${
                hideHeaders 
                  ? "max-h-0 opacity-0 pointer-events-none gap-0 scale-y-0" 
                  : "max-h-[500px] opacity-100 scale-y-100"
              }`}
            >
              <div className="flex w-full lg:w-80">
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
            <div className="flex flex-1 min-h-0 flex-col gap-3 lg:flex-row overflow-hidden">
              <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
                <TasksGrid selectedSection={selectedSection} onSectionSelect={setSelectedSection} />
              </div>
              <div className="flex w-full flex-col lg:w-80 xl:w-96 h-full gap-3 overflow-hidden">
                <Header selectedSection={selectedSection} />
                <div className="flex-1 min-h-0 overflow-hidden">
                  <TodoList />
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
