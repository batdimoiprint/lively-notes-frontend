export interface MatrixConfig {
  rainbowSpeed: number;
  rainbow: boolean;
  matrixspeed: number;
  textColor: string;
  trailOpacity: number;
  backgroundColor: string;
}

export const DEFAULT_MATRIX_CONFIG: MatrixConfig = {
  rainbowSpeed: 0.05,
  rainbow: true,
  matrixspeed: 67,
  textColor: "#ff0000",
  trailOpacity: 0.5,
  backgroundColor: "#000000",
};
