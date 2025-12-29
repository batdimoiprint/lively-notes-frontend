import { useEffect, useState } from "react";
import Header from "@/components/home/Header/Header";
import MatrixBG from "@/components/home/MatrixBG/MatrixBG";
import TasksGrid from "@/components/home/TasksGrid/TasksGrid";
import Snowfall from "react-snowfall";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_MATRIX_CONFIG, type MatrixConfig } from "@/types/matrixConfig";
import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import Pomorodo from "@/components/home/Pomorodo/Pomorodo";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { getSettings } from "@/api/settings";

export default function Home() {
    // State for the MatrixBG and Header
    const [matrixConfig, setMatrixConfig] = useState<MatrixConfig>(
        DEFAULT_MATRIX_CONFIG
    );

    useEffect(() => {
        getSettings().then((settings) => {
            if (settings) {
                setMatrixConfig(settings);
            } else {
                console.log("No settings yet")
            }
        });
    }, []);



    return (
        <>
            <main>
                <ErrorBoundary FallbackComponent={ErrorFallback} >
                    <div className="relative flex flex-row gap-4 px-4 pt-4 max-w-[1920px] max-h-[350px] z-1">
                        <Header config={matrixConfig} onConfigChange={setMatrixConfig} />
                        <PictureCards />
                        <Pomorodo />
                    </div>
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback} >
                    <div className="relative px-4 pt-4 overflow-hidden z-1 max-w-[1920px]">
                        <TasksGrid />
                    </div>
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback} >
                    <div className="absolute inset-0">
                        <MatrixBG config={matrixConfig} />
                        <Snowfall snowflakeCount={1000} />
                    </div>
                </ErrorBoundary>

            </main>
            <Toaster />
        </>
    );
}
