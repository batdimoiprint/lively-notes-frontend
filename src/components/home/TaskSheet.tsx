
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import type Tasks from '@/types/tasktypes'

export default function TaskSheet({ title, body }: Tasks) {
    return (
        <>
            <SheetContent className="backdrop-blur-md dark:bg-card/20">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {body}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </>
    )
}
