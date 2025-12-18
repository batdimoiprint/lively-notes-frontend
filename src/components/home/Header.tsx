import React, { useState, useRef, useCallback } from "react";
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
    // Rainbow,
    X
} from "lucide-react";
import { createNotes } from "@/api/notes";
import type Inputs from "@/types/tasktypes"
import { useMutation, useQueryClient } from "@tanstack/react-query";

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


export default function Header(
    // { onConfigChange }

) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Inputs>();
    const [result, setResult] = useState<React.ReactNode>("Submit");
    const queryClient = useQueryClient()
    const debounce = useDebouncedInput();

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

    const handleToggleRaindbow = () => {
        // onConfigChange({ rainbow: false })
    }



    return (
        <>
            <Card className="backdrop-blur-md dark:bg-card/20">
                <CardHeader>
                    <CardTitle>Lively Desktop Notes</CardTitle>
                    <CardDescription>Good Day Ahead</CardDescription>
                    <CardAction>
                        <ModeToggle />
                        <Button onClick={handleToggleRaindbow}><Rainbow /></Button>
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
