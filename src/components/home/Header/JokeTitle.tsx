import { useState, useEffect } from "react";
import getJoke from "@/api/jokes";

export default function JokeTitle() {
  const [joke, setJoke] = useState<string>("No Jokes yet");
  useEffect(() => {
    async function getData() {
      const jokeData: { joke: string }[] | null = await getJoke();
      if (Array.isArray(jokeData) && jokeData.length > 0 && jokeData[0].joke) {
        setJoke(jokeData[0].joke);
      } else {
        setJoke("No Jokes available");
      }
    }
    getData();
  }, []);
  return <>{joke}</>;
}
