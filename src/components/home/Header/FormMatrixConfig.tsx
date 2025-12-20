import React from 'react'
import type { MatrixConfig } from "@/types/matrixConfig";
import { Button } from '@/components/ui/button';
import { Rainbow } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';

interface HeaderProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>;
}

export default function FormMatrixConfig({ config, onConfigChange }: HeaderProps) {

    const handleToggleRainbow = () => {
        onConfigChange(prev => ({ ...prev, rainbow: !prev.rainbow }))
    }
    return (
        <>
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
                        className="p-0 cursor-pointer w-7 h-7"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Label htmlFor="backgroundColor" className="text-xs whitespace-nowrap">BG</Label>
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => onConfigChange(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="p-0 cursor-pointer w-7 h-7"
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
        </>
    )
}
