
import { Switch } from "@/components/ui/switch";
import type { MatrixConfig } from "@/types/matrixConfig";
import { useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import FormMatrixConfig from "./FormMatrixConfig";
import FormNotes from "./FormNotes";
import JokeTitle from "./JokeTitle";
interface HeaderProps {
    config: MatrixConfig;
    onConfigChange: React.Dispatch<React.SetStateAction<MatrixConfig>>;
}
// Goes to Home
export default function Header({ config, onConfigChange }: HeaderProps) {
    const [isHeaderToggled, setHeaderToggled] = useState<boolean>(false)




    return (
        <div className="flex flex-row w-full h-auto gap-4 ">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Lively Desktop Notes</CardTitle>
                    <CardDescription>
                        <JokeTitle />
                    </CardDescription>
                    <CardAction className="flex flex-wrap items-center gap-2">


                        <Switch onCheckedChange={checked => { setHeaderToggled(checked) }} />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {isHeaderToggled ?
                        <FormMatrixConfig config={config} onConfigChange={onConfigChange} />
                        : <FormNotes />}


                </CardContent>
            </Card>
        </div>
    )
}
