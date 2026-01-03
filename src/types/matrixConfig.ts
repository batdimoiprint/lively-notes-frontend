export interface MatrixConfig {
    rainbowSpeed: number
    rainbow: boolean
    matrixspeed: number
    textColor: string
    trailOpacity: number
    backgroundColor: string
}

export const DEFAULT_MATRIX_CONFIG: MatrixConfig = {
    rainbowSpeed: 0.01,
    rainbow: true,
    matrixspeed: 99,
    textColor: "#363636",
    trailOpacity: 0.15,
    backgroundColor: "#000000"
}
