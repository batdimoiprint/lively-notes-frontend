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
      <main className="flex flex-col gap-4 p-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Header */}
          <div className="flex max-w-[1920px] flex-col gap-4 sm:flex-row">
            <Header selectedSection={selectedSection} />
            <PictureCards />
            <div className="flex w-full flex-col gap-4 sm:max-w-md">
              <Pomorodo />
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex max-w-[1920px] gap-4 overflow-hidden" style={{ height: 'calc(100vh - 280px)', maxHeight: '669px' }}>
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
