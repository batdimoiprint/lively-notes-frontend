
import { ModeToggle } from "../../mode-toggle";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import type { MatrixConfig } from "@/types/matrixConfig";
import FormNotes from "./FormNotes";
import FormMatrixConfig from "./FormMatrixConfig";
import JokeTitle from "./JokeTitle";
interface HeaderProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>;
}
// Goes to Home
export default function Header({ config, onConfigChange }: HeaderProps) {
    return (
        <div className="flex flex-row w-full h-auto gap-4 ">
            <Card className="w-full backdrop-blur-md dark:bg-card/20">
                <CardHeader>
                    <CardTitle>Lively Desktop Notes</CardTitle>
                    <CardDescription>
                        <JokeTitle />
                    </CardDescription>
                    <CardAction className="flex flex-wrap items-center gap-2">
                        <ModeToggle />

                        <FormMatrixConfig config={config} onConfigChange={onConfigChange} />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <FormNotes />
                </CardContent>
            </Card>
        </div>
    )
}
