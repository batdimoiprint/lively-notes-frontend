
import { useState, useEffect } from "react";
import getJoke from "@/api/jokes";


export default function JokeTitle() {
    const [joke, setJoke] = useState<string>("No Jokes yet")
    useEffect(() => {
        async function getData() {
            const jokeData: { joke: string }[] = await getJoke()
            setJoke(jokeData[0].joke) // Gets first item's title
        }
        getData()


    }, [])
    return (
        <>
            {joke}
        </>
    )
}
