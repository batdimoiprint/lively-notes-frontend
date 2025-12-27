import { useMemo } from 'react';
import { useSanaPictures, useLizPictures, useMomoPictures } from '@/api/pictures';
import { useCloudPics } from '@/hooks/useCloudPics';



function randomizer(id: number[]) {
    const randomId = Math.floor((Math.random() * id.length))
    return randomId as number
}

export function useSanaIds() {
    const { data: sanaIds = [], isLoading, error } = useSanaPictures()
    const randomizedId = useMemo(() => {

        return randomizer(sanaIds)
    }, [sanaIds])
    const sanaImg = useCloudPics({ id: sanaIds, randomizedId })
    return { sanaImg, isLoading, error }
}

export function useMomoIds() {
    const { data: momoIds = [], isLoading, error } = useMomoPictures()
    const randomizedId = useMemo(() => {

        return randomizer(momoIds)
    }, [momoIds])
    const momoImg = useCloudPics({ id: momoIds, randomizedId })
    return { momoImg, isLoading, error }
}

export function useLizIds() {
    const { data: lizIds = [], isLoading, error } = useLizPictures()
    const randomizedId = useMemo(() => {

        return randomizer(lizIds)
    }, [lizIds])
    const lizImg = useCloudPics({ id: lizIds, randomizedId })
    return { lizImg, isLoading, error }
}


