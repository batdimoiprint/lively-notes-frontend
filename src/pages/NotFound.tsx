import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      NotFound Lmaoo
      <Link to="/">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
