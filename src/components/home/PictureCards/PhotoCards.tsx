import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AdvancedImage, responsive } from '@cloudinary/react'
import type { CloudinaryImage } from '@cloudinary/url-gen/index'

interface PhotoCardProps {
    isIdolLoading: boolean,
    idolImg: CloudinaryImage | null,
    idolError: Error | null,
    cardLabel: string
}

export default function PhotoCards({ isIdolLoading, idolImg, idolError, cardLabel }: PhotoCardProps) {
    return (
        <Card className="w-full max-w-74.5 gap-0 text-center p-2 ">
            <div className="flex items-center justify-center w-full overflow-hidden aspect-square ">

                {isIdolLoading ? (
                    <Spinner />
                ) : idolImg ? (
                    <AdvancedImage
                        cldImg={idolImg}
                        className="object-cover w-full h-full rounded"
                        plugins={[responsive()]}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">No image available</div>
                )}
                {idolError?.message}

            </div>
            <p className="font-bold ">{cardLabel}</p>

        </Card>
    )
}
