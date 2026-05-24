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
      <main className="flex flex-col">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Headers */}
          <div className="flex w-full flex-col sm:flex-row sm:items-stretch">
            <div className="order-2 flex flex-col sm:order-1">
              <Header selectedSection={selectedSection} />
            </div>
            <div className="order-1 flex flex-col sm:order-2 sm:flex-1">
              <PictureCards />
            </div>
            <div className="order-3 flex">
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
