import { type MatrixConfig } from "@/types/matrixConfig";
import { createContext } from "react";

export interface FormMatrixConfigProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>
}

export const MatrixContext = createContext<FormMatrixConfigProps | undefined>(undefined)

