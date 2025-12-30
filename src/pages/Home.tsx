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
import { Fireworks } from "@fireworks-js/react"

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

    const now = new Date();
    const isChristmas = now.getMonth() === 11 && now.getDate() === 25;
    const isNearNewYear = (now.getMonth() === 11 && now.getDate() >= 30) || (now.getMonth() === 0 && now.getDate() <= 1);

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
                    <div className="absolute inset-0  ">
                        <MatrixBG config={matrixConfig} />

                        {isChristmas && <div className="fixed inset-0 "><Snowfall snowflakeCount={1000} /></div>}
                        {isNearNewYear && (
                            <div className="fixed inset-0 w-full h-full pointer-events-none">
                                <Fireworks
                                    style={{
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        position: "fixed",
                                        background: "transparent",
                                    }}
                                    options={{
                                        autoresize: true,
                                        opacity: 1,
                                        acceleration: 1.05,
                                        friction: 0.97,
                                        gravity: 1.5,
                                        particles: 250,
                                        traceLength: 1,
                                        traceSpeed: 2,
                                        explosion: 5,
                                        intensity: 10,
                                        flickering: 100,
                                        lineStyle: 'round',
                                        hue: {
                                            min: 0,
                                            max: 360
                                        },
                                        delay: {
                                            min: 1,
                                            max: 60
                                        },
                                        rocketsPoint: {
                                            min: 0,
                                            max: 100
                                        },
                                        lineWidth: {
                                            explosion: {
                                                min: 1,
                                                max: 10
                                            },
                                            trace: {
                                                min: 1,
                                                max: 5
                                            }
                                        },
                                        brightness: {
                                            min: 1,
                                            max: 100
                                        },
                                        decay: {
                                            min: 0.015,
                                            max: 0.05
                                        },
                                        mouse: {
                                            click: false,
                                            move: true,
                                            max: 1
                                        }
                                    }

                                    }
                                />
                            </div>
                        )}
                    </div>
                </ErrorBoundary>

            </main>
            <Toaster />
        </>
    );
}
