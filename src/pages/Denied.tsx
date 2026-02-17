import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

export default function Denied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      Access Denied
      <Link to="/">
        <Button>Back</Button>
      </Link>
    </div>
  );
}
