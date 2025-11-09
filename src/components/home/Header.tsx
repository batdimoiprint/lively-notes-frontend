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

export default function Header() {
    type Inputs = {
        title: string,
        body: string,
    }



    const { register, handleSubmit, formState: { errors, isSubmitting, } } = useForm<Inputs>();
    const [result, setResult] = useState<React.ReactNode>("Submit");


    const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(inputs)
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            await response.json()
            setResult(
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
                    <Check size={16} /> Notes Created!
                </span>
            );
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
