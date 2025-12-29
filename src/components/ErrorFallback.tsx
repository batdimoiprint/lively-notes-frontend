import { Button } from "./ui/button";
import { Card, CardDescription } from "./ui/card";



type FallbackProps = {
    error: Error,
    resetErrorBoundary: () => void;
};

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (

        <Card className={"relative flex flex-col justify-center p-4  mx-164 z-1 backdrop-blur-md dark:bg-card/20"}>

            Something went wrong!

            <CardDescription>{error.message}</CardDescription>
            <Button
                onClick={() => {
                    resetErrorBoundary();
                }}
            >
                Retry
            </Button>
        </Card>

    );
}
