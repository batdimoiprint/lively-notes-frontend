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
          <div className="relative z-1 flex w-full flex-col gap-4 md:max-h-[350px] md:flex-row md:max-w-[1920px]">
            <Header />
            <PictureCards />
            <Pomorodo />
          </div>
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="relative z-1 w-full overflow-hidden pt-4 md:max-w-[1920px]">
            <TasksGrid />
          </div>
        </ErrorBoundary>
      </main>
      <Toaster />
    </>
  );
}
