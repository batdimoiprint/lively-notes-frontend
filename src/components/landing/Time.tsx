import { useEffect, useState } from "react";

export default function Time() {
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [timeGreet, setTimeGreet] = useState<number | undefined>();
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      setFormattedTime(now.toLocaleString("en-US", options));
      setTimeGreet(now.getHours());
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return { formattedTime, timeGreet };
}
