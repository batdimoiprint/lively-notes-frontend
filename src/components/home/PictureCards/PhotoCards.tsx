import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AdvancedImage, responsive } from '@cloudinary/react'
import type { CloudinaryImage } from '@cloudinary/url-gen/index'

interface PhotoCardProps {
    isIdolLoading: boolean,
    idolImg: CloudinaryImage,
    idolError: Error | null,
    cardLabel: string
}

export default function PhotoCards({ isIdolLoading, idolImg, idolError, cardLabel }: PhotoCardProps) {
    return (
        <Card className="backdrop-blur-md dark:bg-card/20 w-full max-w-74.5 gap-0 text-center p-2">
            <div className="flex items-center justify-center w-full overflow-hidden aspect-square">

                {isIdolLoading ? <Spinner /> : <AdvancedImage
                    cldImg={idolImg}
                    className="object-cover w-full h-full rounded"
                    plugins={[responsive()]}
                />}
                {idolError?.message}

            </div>
            <p className="font-bold ">{cardLabel}</p>
            <Button onClick={() => {
                console.log("first")
            }}>Randomize</Button>
        </Card>
    )
}
