import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AdvancedImage, responsive } from '@cloudinary/react'
import { useSanaIds, useLizIds, useMomoIds } from "@/lib/cloudinary";
import React from 'react';
const PictureCards = React.memo(function PictureCards() {
    const { sanaImg, isLoading: isSanaLoading, error: sanaError } = useSanaIds();
    const { lizImg, isLoading: isLizLoading, error: lizError } = useLizIds();
    const { momoImg, isLoading: isMomoLoading, error: momoError } = useMomoIds();
    return (
        <>
            <Card className="backdrop-blur-md dark:bg-card/20 w-full max-w-74.5 gap-0 text-center p-2">
                <div className="flex items-center justify-center w-full overflow-hidden aspect-square">

                    {isSanaLoading ? <Spinner /> : <AdvancedImage
                        cldImg={sanaImg}
                        className="object-cover w-full h-full rounded"
                        plugins={[responsive()]}
                    />}
                    {sanaError?.message}

                </div>
                <p className="font-bold ">Slot for my gf</p>
            </Card>
            <Card className="backdrop-blur-md dark:bg-card/20 w-full max-w-74.5 gap-0 text-center p-2">
                <div className="flex items-center justify-center w-full overflow-hidden aspect-square">
                    {isLizLoading ? <Spinner /> : <AdvancedImage
                        cldImg={lizImg}
                        className="object-cover w-full h-full rounded"
                        plugins={[responsive()]}
                    />}
                    {lizError?.message}
                </div>
                <p className="font-bold ">My First Love</p>
            </Card>
            <Card className="backdrop-blur-md dark:bg-card/20 w-full max-w-74.5 gap-0 text-center p-2">
                <div className="flex items-center justify-center w-full overflow-hidden aspect-square">
                    {isMomoLoading ? <Spinner /> : <AdvancedImage
                        cldImg={momoImg}
                        className="object-cover w-full h-full rounded"
                        plugins={[responsive()]}
                    />}
                    {momoError?.message}
                </div>
                <p className="font-bold ">LOML</p>
            </Card></>
    )
})

export default PictureCards
