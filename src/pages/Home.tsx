import Header from "@/components/home/Header/Header";
import TasksGrid from "@/components/home/TasksGrid/TasksGrid";
import TodoList from "@/components/home/Todo/TodoList";
import { Toaster } from "@/components/ui/sonner";
import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import SpecialCard from "@/components/home/SpecialCard/SpecialCard";
import NotesCalendar from "@/components/home/NotesCalendar/NotesCalendar";
import ContentViewToggle, {
  type ContentView,
} from "@/components/home/ContentViewToggle/ContentViewToggle";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { useState } from "react";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<string>("default");
  const [contentView, setContentView] = useState<ContentView>("notes");

  const isCalendar = contentView === "calendar";

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Headers */}
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="order-2 flex flex-col lg:order-1">
              {/* Toggle card replaces the Header when calendar is active */}
              {isCalendar ? (
                <ContentViewToggle view={contentView} onViewChange={setContentView} />
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                  <ContentViewToggle view={contentView} onViewChange={setContentView} />
                  <Header selectedSection={selectedSection} />
                </div>
              )}
            </div>
            <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:flex-1">
              <PictureCards />
            </div>
            <div className="order-3 flex">
              <SpecialCard />
            </div>
          </div>
        </ErrorBoundary>

        {/* Content area — switches between Notes grid and Calendar */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {isCalendar ? (
            <NotesCalendar />
          ) : (
            <div className="flex flex-1 flex-col gap-4 lg:flex-row">
              <div className="flex min-w-0 flex-1 flex-col">
                <TasksGrid selectedSection={selectedSection} onSectionSelect={setSelectedSection} />
              </div>
              <div className="flex w-full flex-col lg:w-80 xl:w-96">
                <TodoList />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
