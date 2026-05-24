import Header from "@/components/home/Header/Header";
import TasksGrid from "@/components/home/TasksGrid/TasksGrid";
import TodoList from "@/components/home/Todo/TodoList";
import { Toaster } from "@/components/ui/sonner";
import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import Pomorodo from "@/components/home/Pomorodo/Pomorodo";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { useState } from "react";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<string>("default");

  return (
    <>
      {/* Headers */}
      <main className="flex flex-col">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Mobile: PictureCards → Header → Pomorodo. sm+: side-by-side row */}
          <div className="flex max-w-480 flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="order-2 flex flex-col sm:order-1 sm:flex-1">
              <Header selectedSection={selectedSection} />
            </div>
            <div className="order-1 sm:order-2">
              <PictureCards />
            </div>
            <div className="order-3 flex w-full flex-col gap-4 sm:max-w-md">
              <Pomorodo />
            </div>
          </div>
        </ErrorBoundary>

        {/* Below Grid */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex max-w-480 overflow-hidden sm:h-[calc(100vh-280px)] sm:max-h-167.25">
            <div className="min-w-0 flex-1">
              <TasksGrid selectedSection={selectedSection} onSectionSelect={setSelectedSection} />
            </div>
            <div className="hidden w-80 shrink-0 lg:block">
              <TodoList />
            </div>
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
