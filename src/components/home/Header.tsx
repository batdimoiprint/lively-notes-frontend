import React, { useState, useRef, useCallback, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import {
    Check,
    Rainbow,
    X
} from "lucide-react";
import { createNotes } from "@/api/notes";
import type Inputs from "@/types/tasktypes"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MatrixConfig } from "@/types/matrixConfig";
import getJoke from "@/api/jokes";

interface HeaderProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>;
}

// Debounce hook to prevent duplicate inputs
const useDebouncedInput = () => {
    const lastValueRef = useRef<{ title: string; body: string }>({ title: "", body: "" });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debounce = useCallback((field: 'title' | 'body', value: string, callback: (v: string) => void) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (lastValueRef.current[field] !== value) {
                lastValueRef.current[field] = value;
                callback(value);
            }
        }, 50);
    }, []);

    return debounce;
};


export default function Header({ config, onConfigChange }: HeaderProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Inputs>();
    const [result, setResult] = useState<React.ReactNode>("Submit");
    const queryClient = useQueryClient()
    const debounce = useDebouncedInput();
    const [joke, setJoke] = useState<string>("No Jokes yet")

    const mutation = useMutation({
        mutationFn: createNotes,
        onSuccess: () => {
            setResult(
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
                    <Check size={16} /> Notes Created!
                </span>
            )
            reset()
            setTimeout(() => {
                setResult("Submit")
            }, 4000);
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },
        onError: (error) => {
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
                <X size={16} /> Error: `${error.message}`
            </span>
        }
    })

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        mutation.mutate(data)
    }

    const handleToggleRainbow = () => {
        onConfigChange(prev => ({ ...prev, rainbow: !prev.rainbow }))
    }


    useEffect(() => {
        async function getData() {
            const jokeData: { joke: string }[] = await getJoke()
            setJoke(jokeData[0].joke) // Gets first item's title
        }
        getData()
    }, []) // Empty array = runs ONCE on mount, not every render





    return (
        <>
            <Card className="backdrop-blur-md dark:bg-card/20">
                <CardHeader>
                    <CardTitle>Lively Desktop Notes</CardTitle>
                    <CardDescription>{joke}

                    </CardDescription>
                    <CardAction className="flex flex-wrap items-center gap-2">
                        <ModeToggle />
                        <Button
                            onClick={handleToggleRainbow}
                            variant={config.rainbow ? "default" : "outline"}
                        >
                            <Rainbow />
                        </Button>
                        {/* Matrix Config Controls */}
                        <div className="flex flex-wrap items-center gap-2 ml-2">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="textColor" className="text-xs whitespace-nowrap">Text</Label>
                                <Input
                                    id="textColor"
                                    type="color"
                                    value={config.textColor}
                                    onChange={(e) => onConfigChange(prev => ({ ...prev, textColor: e.target.value }))}
                                    className="w-7 h-7 p-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <Label htmlFor="backgroundColor" className="text-xs whitespace-nowrap">BG</Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={config.backgroundColor}
                                    onChange={(e) => onConfigChange(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                    className="w-7 h-7 p-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <Label htmlFor="matrixspeed" className="text-xs whitespace-nowrap">Speed</Label>
                                <Input
                                    id="matrixspeed"
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={config.matrixspeed}
                                    onChange={(e) => onConfigChange(prev => ({ ...prev, matrixspeed: Number(e.target.value) }))}
                                    className="w-16"
                                />
                                <span className="text-[10px] w-6">{config.matrixspeed}ms</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Label htmlFor="trailOpacity" className="text-xs whitespace-nowrap">Trail</Label>
                                <Input
                                    id="trailOpacity"
                                    type="range"
                                    min="0.01"
                                    max="0.3"
                                    step="0.01"
                                    value={config.trailOpacity}
                                    onChange={(e) => onConfigChange(prev => ({ ...prev, trailOpacity: Number(e.target.value) }))}
                                    className="w-16"
                                />
                                <span className="text-[10px] w-6">{config.trailOpacity.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Label htmlFor="rainbowSpeed" className="text-xs whitespace-nowrap">R.Speed</Label>
                                <Input
                                    id="rainbowSpeed"
                                    type="range"
                                    min="0.01"
                                    max="0.2"
                                    step="0.01"
                                    value={config.rainbowSpeed}
                                    onChange={(e) => onConfigChange(prev => ({ ...prev, rainbowSpeed: Number(e.target.value) }))}
                                    className="w-16"
                                    disabled={!config.rainbow}
                                />
                                <span className="text-[10px] w-6">{config.rainbowSpeed.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-row w-full h-full gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register("title", {
                                required: "Title is required",
                                onChange: (e) => debounce('title', e.target.value, () => { })
                            })}
                            placeholder="Title"
                        />

                        {errors.title && <Label >{errors.title.message}</Label>}
                        <Textarea
                            {...register("body", {
                                required: "Body is required",
                                onChange: (e) => debounce('body', e.target.value, () => { })
                            })}
                            placeholder="Body"
                        />
                        {errors.body && <Label >{errors.body.message}</Label>}

                        <Button disabled={isSubmitting} type="submit" >{isSubmitting ? <Spinner /> : result}</Button>


                        {errors.root && <Label>{errors.root.message}</Label>}
                    </form>

                </CardContent>

            </Card>
        </>
    )
}
