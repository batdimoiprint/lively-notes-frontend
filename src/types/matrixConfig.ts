export interface MatrixConfig {
    wavecolor: { r: number; g: number; b: number }
    rainbowSpeed: number
    rainbow: boolean
    matrixspeed: number
    textColor: string
    trailOpacity: number
    backgroundColor: string
}

export const DEFAULT_MATRIX_CONFIG: MatrixConfig = {
    wavecolor: { r: 255, g: 255, b: 255 },
    rainbowSpeed: 0.01,
    rainbow: true,
    matrixspeed: 99,
    textColor: "#363636",
    trailOpacity: 0.15,
    backgroundColor: "#000000"
}
