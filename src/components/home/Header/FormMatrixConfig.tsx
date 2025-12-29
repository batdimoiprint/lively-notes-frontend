import React, { useEffect } from "react";
import { type MatrixConfig } from "@/types/matrixConfig";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ModeToggle } from "@/components/mode-toggle";
import { Toggle } from "@/components/ui/toggle";
import { Rainbow, SwatchBook } from "lucide-react";

// import { getSettings } from "@/api/settings";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";

interface FormMatrixConfigProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>
}

// Goes to Header
export default function FormMatrixConfig({ config, onConfigChange, }: FormMatrixConfigProps) {



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
                <ModeToggle />
                {/* Rainbow Toggle */}
                <Toggle
                    aria-label="Toggle bookmark"
                    size={"sm"}
                    variant={"outline"}
                    className="Toggle"
                    pressed={!config?.rainbow}
                    onClick={() => {
                        onConfigChange((prev) => ({ ...prev, rainbow: !prev.rainbow }))
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
                    onChange={(e) =>
                        onConfigChange((prev) => ({ ...prev, textColor: e.target.value }))
                    }
                    className="p-0 cursor-pointer w-7 h-7"
                />
                {/* Background Color */}
                <Label htmlFor="backgroundColor" className="text-xs whitespace-nowrap">
                    Background Color: {config.backgroundColor}
                </Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) =>
                        onConfigChange((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                        }))
                    }
                    className="p-0 cursor-pointer w-7 h-7"
                />
            </div>

            {/* Speed Control */}
            <Label className="text-xs whitespace-nowrap">
                Speed: {99 - config.matrixspeed}ms
            </Label>
            <Slider
                value={[99 - config.matrixspeed]}
                onValueChange={(value) =>
                    onConfigChange((prev) => (

                        { ...prev, matrixspeed: 99 - value[0] }))

                }
                max={99}
                step={1}
            />
            {/* Trail Control */}
            <Label className="text-xs whitespace-nowrap">
                Trail: {Number(config.trailOpacity).toFixed(2)}
            </Label>
            <Slider
                value={[config.trailOpacity]}
                onValueChange={(value) =>
                    onConfigChange((prev) => ({ ...prev, trailOpacity: value[0] }))
                }
                min={0.01}
                max={0.3}
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
                min={0.01}
                max={0.2}
                step={0.01}
                disabled={!config.rainbow}
            />
        </div>
    );
}
