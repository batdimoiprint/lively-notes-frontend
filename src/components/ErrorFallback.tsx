import { type FallbackProps } from "react-error-boundary";
import { Button } from "./ui/button";
import { Card, CardDescription } from "./ui/card";

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <Card className={"relative z-1 mx-164 flex flex-col justify-center p-4"}>
      Something went wrong!
      <CardDescription>{message}</CardDescription>
      <Button onClick={resetErrorBoundary}>Retry</Button>
    </Card>
  );
}
