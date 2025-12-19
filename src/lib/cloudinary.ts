
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import {
    // getSanaFolder,
    // getLizFolder, getMomoFolder
} from '@/api/pictures';
import { useSanaPictures, useLizPictures, useMomoPictures } from '@/api/pictures';


const cld = new Cloudinary({ cloud: { cloudName: 'dllnqngt4' } });

// const publicId = await getPublicIds()
// const sanaIds = await getSanaFolder()
// const MomoIds = await getMomoFolder()
// const LizIds = await getLizFolder()


export function useSanaIds() {
    const { data: sanaIds = [], isLoading, error } = useSanaPictures()

    const randomizedId = Math.floor((Math.random() * sanaIds.length))
    const sanaImg = cld
        .image(`${sanaIds[randomizedId]}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(1000).height(1000));
    return { sanaImg, isLoading, error }
}

export function useMomoIds() {

    const { data: momoIds = [], isLoading, error } = useMomoPictures()
    const randomizedId = Math.floor((Math.random() * momoIds.length))
    const momoImg = cld

        .image(`${momoIds[randomizedId]}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(1000).height(1000));
    return { momoImg, isLoading, error }
}

export function useLizIds() {
    const { data: lizIds = [], isLoading, error } = useLizPictures()
    const randomizedId = Math.floor((Math.random() * lizIds.length))
    const lizImg = cld
        .image(`${lizIds[randomizedId]}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(1000).height(1000));
    return { lizImg, isLoading, error }
}


