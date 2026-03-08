import Header from "@/components/home/Header/Header";
import TasksGrid from "@/components/home/TasksGrid/TasksGrid";
import { Toaster } from "@/components/ui/sonner";
import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import Pomorodo from "@/components/home/Pomorodo/Pomorodo";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";

export default function Home() {
  return (
    <>
      <main className="flex flex-col p-4 gap-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Header */}
          <div className="flex  max-w-[1920px] flex-col gap-4 sm:flex-row ">
            <Header />
            <PictureCards />
            <Pomorodo />
          </div>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="max-w-[1920px] overflow-hidden">
            <TasksGrid />
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
