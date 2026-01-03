import { resetSettings } from "@/api/settings";
// import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { type MatrixConfig } from "@/types/matrixConfig";
import { Label } from "@radix-ui/react-label";
import { Check, Rainbow, RefreshCw, SwatchBook } from "lucide-react";
import React, { useEffect, useState } from "react";

import { patchSettings } from "@/api/settings";
// import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

interface FormMatrixConfigProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>
}

// Goes to Header to prop again
export default function FormMatrixConfig({ config, onConfigChange, }: FormMatrixConfigProps) {
    const [reset, setReset] = useState<boolean>(false)


    const mutation = useMutation({
        mutationFn: patchSettings,
        onSuccess: () => {
            console.log("Success")

        },
        onError: () => {
            console.log("error somewhere lol")
        }
    })

    const handlePatch = (data: object) => {
        mutation.mutate(data)
    }

    const displayValue = 0.65 - config.trailOpacity;


    useEffect(() => {
        if (config) {
            // setFormSettings(config)

        } else {
            throw new Error("Config undefined");

        }
    }, [config])


    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex flex-row items-center justify-between">
                {/* <ModeToggle /> */}
                 {/*Rainbow Toggle*/}
                <Toggle
                    aria-label="Toggle rainbow"
                    size={"sm"}
                    variant={"outline"}
                    className="Toggle"
                    pressed={!config?.rainbow}
                    onClick={() => {


                        onConfigChange((prev) => {
                            handlePatch({rainbow: !prev.rainbow })
                            return { ...prev, rainbow: !prev.rainbow }
                        })

                    }}
                >

                    {config?.rainbow ? <Rainbow /> : <SwatchBook />}
                </Toggle>

                {/* Text Color */}
                <Label htmlFor="textColor" className="text-xs whitespace-nowrap">
                    Text Color: {config.textColor}
                </Label>
                <Input
                    id="textColor"
                    type="color"
                    disabled={Boolean(config.rainbow)}
                    value={config?.textColor}
                    onChange={(e) => {
                        handlePatch({textColor: e.target.value})
                        onConfigChange((prev) => ({...prev, textColor: e.target.value}))
                    }
                    }


                    className="p-0 cursor-pointer w-7 h-7"
                />

                {/*Reset to Default*/}
                <Button
                    onClick={async () => {
                        try {
                            const response = await resetSettings();
                            if (response === 200) {
                                setReset(true);
                                setTimeout(() => setReset(false), 2000);
                            } else {
                                setReset(false);
                            }
                        } catch (error) {
                            console.error("Reset failed:", error);
                            setReset(false);
                        }
                    }}
                >
                    {reset ? <Check /> : <RefreshCw />}
                </Button>
            </div>


            {/* Speed Control */}
            <Label className="text-xs whitespace-nowrap">
                Speed: {99 - config.matrixspeed}ms
            </Label>
            <Slider
                value={[99 - config.matrixspeed]}
                onValueChange={(value) =>(
                    onConfigChange((prev) => (
                        { ...prev, matrixspeed: 99 - value[0] }
                        ))

                )
                }
                onValueCommit={value => handlePatch({matrixspeed: 99 -value[0]})}
                max={99}
                step={1}
            />
            {/* Trail Control */}



            <Label className="text-xs whitespace-nowrap">
                Trail: {Number(displayValue).toFixed(2)}
            </Label>
            <Slider

                value={[displayValue]}
                onValueChange={(value) => {

                    const originalValue = 0.65 - value[0];
                    onConfigChange((prev) => ({ ...prev, trailOpacity: originalValue }));
                }}
                onValueCommit={(value) => {
                    // 3. Convert back to original scale before patching API
                    const originalValue = 0.65 - value[0];
                    handlePatch({ trailOpacity: originalValue });
                }}
                min={0.15}
                max={0.5}
                step={0.01}
            />
            {/* Rainbow Speed Control */}
            <Label htmlFor="rainbowSpeed" className="text-xs whitespace-nowrap">
                Rainbow Speed: {Number(config.rainbowSpeed).toFixed(2)}
            </Label>
            <Slider
                value={[config.rainbowSpeed]}
                onValueChange={(value) =>
                    onConfigChange((prev) => ({ ...prev, rainbowSpeed: value[0] }))
                }
                onValueCommit={value => handlePatch({rainbowSpeed: value[0]})}
                min={0.01}
                max={0.2}
                step={0.01}
                disabled={!config.rainbow}
            />
        </div >
    );
}
