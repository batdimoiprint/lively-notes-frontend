import { useEffect, useRef } from 'react'

interface MatrixConfig {
    wavecolor: { r: number; g: number; b: number }
    rainbowSpeed: number
    rainbow: boolean
    matrixspeed: number
    textColor: string
    trailOpacity: number
}

const DEFAULT_CONFIG: MatrixConfig = {
    wavecolor: { r: 125, g: 52, b: 253 },
    rainbowSpeed: 0.05,
    rainbow: false,
    matrixspeed: 50,
    textColor: "#ffffff",
    trailOpacity: 0.05,
}

export default function MatrixBG() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dropsRef = useRef<number[]>([])
    const hueRef = useRef(-0.01)
    const intervalRef = useRef<number | null>(null)
    const fontSizeRef = useRef(12)
    const charactersRef = useRef("ᜀᜁᜂᜃᜄᜅᜆᜇᜈᜉᜊᜋᜌᜎᜏᜐᜑᜒᜓ᜔".split(""))

    // Initialize canvas and columns
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.height = window.innerHeight
        canvas.width = window.innerWidth

        const columns = Math.floor(canvas.width / fontSizeRef.current)
        dropsRef.current = Array(columns).fill(1)

        const handleResize = () => {
            canvas.height = window.innerHeight
            canvas.width = window.innerWidth
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Draw loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const config = DEFAULT_CONFIG

        const draw = () => {
            const columns = Math.floor(canvas.width / fontSizeRef.current)
            if (dropsRef.current.length !== columns) {
                dropsRef.current = Array(columns).fill(1)
            }

            // Trail effect
            ctx.fillStyle = `rgba(0,0,0, ${config.trailOpacity})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.font = `${fontSizeRef.current}px arial`

            for (let i = 0; i < dropsRef.current.length; i++) {
                const text = charactersRef.current[Math.floor(Math.random() * charactersRef.current.length)]

                // Set text color based on config
                if (config.rainbow) {
                    hueRef.current += 0.01
                    const rr = Math.floor(127 * Math.sin(config.rainbowSpeed * hueRef.current + 0) + 128)
                    const rg = Math.floor(127 * Math.sin(config.rainbowSpeed * hueRef.current + 2) + 128)
                    const rb = Math.floor(127 * Math.sin(config.rainbowSpeed * hueRef.current + 4) + 128)
                    ctx.fillStyle = `rgba(${rr},${rg},${rb})`
                } else {
                    ctx.fillStyle = config.textColor
                }

                ctx.fillText(text, i * fontSizeRef.current, dropsRef.current[i] * fontSizeRef.current)
                dropsRef.current[i]++

                if (dropsRef.current[i] * fontSizeRef.current > canvas.height && Math.random() > 0.975) {
                    dropsRef.current[i] = 0
                }
            }
        }

        // Clear previous interval
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = window.setInterval(draw, config.matrixspeed)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0"
        ></canvas>
    )
}
