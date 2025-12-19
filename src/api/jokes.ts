const url = "https://api.api-ninjas.com/v1/jokes"
const options = {
    headers: { "X-Api-Key": import.meta.env.VITE_QUOTES_API },
    method: "GET",
}

export default async function getJoke() {
    // const data = await fetch(url, options)
    const response = await data.json()
    return response
}