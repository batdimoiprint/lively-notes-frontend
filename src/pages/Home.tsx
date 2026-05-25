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
      <main className="flex flex-1 flex-col gap-4 p-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Headers */}
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch">
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
          <div className="flex flex-1 flex-row gap-4">
            <div className="flex flex-1 flex-col">
              <TasksGrid selectedSection={selectedSection} onSectionSelect={setSelectedSection} />
            </div>
            <div className="">
              <TodoList />
            </div>
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
