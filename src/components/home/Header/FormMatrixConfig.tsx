import React, { useState } from 'react'
import { type MatrixConfig } from "@/types/matrixConfig";
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Slider } from "@/components/ui/slider"
import { ModeToggle } from '@/components/mode-toggle';
import { Toggle } from '@/components/ui/toggle';
import { Rainbow, SwatchBook } from 'lucide-react';

interface FormMatrixConfigProps {
    config: MatrixConfig,
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>
}

// Goes to Header
export default function FormMatrixConfig({ config, onConfigChange }: FormMatrixConfigProps) {
    const [speed, setSpeed] = useState<number[]>([99 - config.matrixspeed])
    const [trailOpacity, setTrailOpacity] = useState<number[]>([config.trailOpacity])
    const [rainbowSpeed, setRainbowSpeed] = useState<number[]>([config.rainbowSpeed])

    const handleToggleRainbow = () => {
        onConfigChange(prev => ({ ...prev, rainbow: !prev.rainbow }))
    }
    return (
        <div className='flex flex-col gap-4 '>
            <div className='flex flex-row justify-between items-center'>
                <ModeToggle />

                <Toggle
                    aria-label="Toggle bookmark"
                    size={"sm"}
                    variant={"outline"}
                    className="Toggle"
                    onClick={handleToggleRainbow}
                >
                    {config.rainbow ? <Rainbow /> : <SwatchBook />}

                </Toggle>

                <Label htmlFor="textColor" className="text-xs whitespace-nowrap">Text Color: {config.textColor}</Label>
                <Input
                    id="textColor"
                    type="color"
                    disabled={config.rainbow}
                    value={config.textColor}
                    onChange={(e) => onConfigChange(prev => ({ ...prev, textColor: e.target.value }))}
                    className="p-0 cursor-pointer w-7 h-7"
                />



                <Label htmlFor="backgroundColor" className="text-xs whitespace-nowrap">Background Color: {config.backgroundColor}</Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => onConfigChange(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="p-0 cursor-pointer w-7 h-7"
                />
            </div>

            {/* Speed Control */}
            <Label className="text-xs whitespace-nowrap">Speed: {99 - config.matrixspeed}ms</Label>
            <Slider value={speed} onValueChange={setSpeed} max={99} step={1}
                onValueCommit={(value) => {
                    onConfigChange(prev => ({ ...prev, matrixspeed: 99 - value[0] }))
                }}
            />

            <Label className="text-xs whitespace-nowrap">Trail: {config.trailOpacity.toFixed(2)}</Label>
            <Slider value={trailOpacity} onValueChange={setTrailOpacity} min={0.01} max={0.3} step={0.01}
                onValueCommit={(value) => {
                    onConfigChange(prev => ({ ...prev, trailOpacity: value[0] }))
                }}
            />


            <Label htmlFor="rainbowSpeed" className="text-xs whitespace-nowrap">R.Speed: {config.rainbowSpeed.toFixed(2)}</Label>
            <Slider value={rainbowSpeed} onValueChange={setRainbowSpeed} min={0.01} max={0.2} step={0.01} disabled={!config.rainbow}
                onValueCommit={(value) => {
                    onConfigChange(prev => ({ ...prev, rainbowSpeed: value[0] }))
                }}
            />

        </div>

    )
}
