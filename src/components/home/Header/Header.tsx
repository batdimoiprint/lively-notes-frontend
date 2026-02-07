import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import FormMatrixConfig from "./FormMatrixConfig";
import FormNotes from "./FormNotes";
import JokeTitle from "./JokeTitle";

// Goes to Home
export default function Header() {
  const [isHeaderToggled, setHeaderToggled] = useState<boolean>(false);

  return (
    <div className="flex h-auto w-full flex-row gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lively Desktop Notes</CardTitle>
          <CardDescription>
            <JokeTitle />
          </CardDescription>
          <CardAction className="flex flex-wrap items-center gap-2">
            <Switch
              onCheckedChange={(checked) => {
                setHeaderToggled(checked);
              }}
            />
          </CardAction>
        </CardHeader>
        <CardContent>{isHeaderToggled ? <FormMatrixConfig /> : <FormNotes />}</CardContent>
      </Card>
    </div>
  );
}
