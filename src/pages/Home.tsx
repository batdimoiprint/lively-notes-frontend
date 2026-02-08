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
      <main>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="relative z-1 flex max-h-[350px] max-w-[1920px] flex-row gap-4 ">
            <Header />
            <PictureCards />
            <Pomorodo />
          </div>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="relative z-1 max-w-[1920px] overflow-hidden pt-4">
            <TasksGrid />
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
