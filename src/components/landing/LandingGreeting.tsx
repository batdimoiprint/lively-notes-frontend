import { useEffect, useState } from "react";
import Time from "./Time";

export default function LandingGreeting() {
  const time = Time();
  const [greetings, setGreetings] = useState<string>("");

  useEffect(() => {
    if (typeof time.timeGreet !== "number") return;

    switch (true) {
      case time.timeGreet >= 0 && time.timeGreet < 12:
        setGreetings("Good Morning");
        break;
      case time.timeGreet >= 12 && time.timeGreet <= 17:
        setGreetings("Good Afternoon");
        break;
      case time.timeGreet >= 18:
        setGreetings("Good Evening");
        break;
      default:
        setGreetings("");
    }
  }, [time.timeGreet]);

  return (
    <>
      <h1 className="text-3xl font-bold">{greetings}</h1>
      <h2 className="text-lg font-light">{time.formattedTime}</h2>
    </>
  );
}
