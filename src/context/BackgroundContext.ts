import { createContext } from "react";

interface BackgroundContextType {
  reloadBackground: () => Promise<void>;
}

export const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);