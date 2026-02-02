import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      NotFound Lmaoo
      <Link to="/">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
