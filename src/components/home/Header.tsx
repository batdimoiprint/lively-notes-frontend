import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { Check } from "lucide-react";
import { createNotes } from "@/api/notes";
import type Inputs from "@/types/tasktypes"



export default function Header() {




    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>();
    const [result, setResult] = useState<React.ReactNode>("Submit");


    const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
        try {
            await createNotes(inputs).then(() => {
                setResult(
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
                        <Check size={16} /> Notes Created!
                    </span>
                );
            })

            setTimeout(() => {
                setResult("Submit")
            }, 4000);


        } catch (error) {
            console.log(error)
        }
    }



    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Lively Desktop Notes</CardTitle>
                    <CardDescription>Good Day Morning</CardDescription>
                    <CardAction><ModeToggle /></CardAction>

                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input {...register("title", { required: "Title is required", })} placeholder="Title" />
                        {errors.title && <Label >{errors.title.message}</Label>}
                        <Textarea {...register("body", { required: "Body is required", })} placeholder="Body" />
                        {errors.body && <Label >{errors.body.message}</Label>}

                        <Button disabled={isSubmitting} type="submit" >{isSubmitting ? <Spinner /> : result}</Button>

                        {errors.root && <Label>{errors.root.message}</Label>}
                    </form>

                </CardContent>

            </Card>
        </>
    )
}
