import { useQuery } from "@tanstack/react-query"

// export async function getSanaFolder() {
//     const data = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/images/folder/sana`)
//     const response = await data.json()
//     const randomizer = Math.floor((Math.random() * response.length))
//     return response[randomizer]
// }

async function getSanaFolder() {
    const data = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/images/folder/sana`)
    const response = await data.json()
    return response
}

async function getMomoFolder() {
    const data = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/images/folder/momo`)
    const response = await data.json()
    return response
}

async function getLizFolder() {
    const data = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/images/folder/liz`)
    const response = await data.json()
    return response
}


// async function getPublicIds() {
//     const data = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/images`)
//     const response = await data.json()
//     const randomizer = Math.floor((Math.random() * response.length))
//     return response[randomizer]
// }

function useSanaPictures() {
    return useQuery({
        queryKey: ['sana_pics_id'],
        queryFn: getSanaFolder,
        enabled: true,
        staleTime: Infinity,
        retry: 2,
        refetchOnWindowFocus: false,
        networkMode: 'offlineFirst'
    })
}

function useMomoPictures() {
    return useQuery({
        queryKey: ['momo_pics_id'],
        queryFn: getMomoFolder,
        enabled: true,
        staleTime: Infinity,
        retry: 2,
        refetchOnWindowFocus: false,
        networkMode: 'offlineFirst'
    })
}

function useLizPictures() {
    return useQuery({
        queryKey: ['liz_pics_id'],
        queryFn: getLizFolder,
        enabled: true,
        staleTime: Infinity,
        retry: 2,
        refetchOnWindowFocus: false,
        networkMode: 'offlineFirst'
    })
}

export { useSanaPictures, useLizPictures, useMomoPictures }