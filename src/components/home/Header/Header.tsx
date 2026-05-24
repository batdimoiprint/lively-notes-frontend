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

interface HeaderProps {
  selectedSection: string;
}

// Goes to Home
export default function Header({ selectedSection }: HeaderProps) {
  const [isHeaderToggled, setHeaderToggled] = useState<boolean>(false);

  return (
    <Card className="flex sm:flex-1 flex-col">
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
      <CardContent className="bg-debug flex flex-1 flex-col">
        {isHeaderToggled ? <FormMatrixConfig /> : <FormNotes selectedSection={selectedSection} />}
      </CardContent>
    </Card>
  );
}
