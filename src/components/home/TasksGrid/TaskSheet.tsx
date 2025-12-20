
import { Edit, Save, Trash } from 'lucide-react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type Tasks from '@/types/tasktypes'
import { Button } from '../../ui/button'

import { useState } from 'react'
import { Input } from '../../ui/input'

export default function TaskSheet({ title, body }: Tasks) {
    const [editActive, setEditActive] = useState<boolean>(false)
    const [bodyValue, setBodyValue] = useState<string>(body)

    return (
        <>
            <SheetContent className="p-8 backdrop-blur-md dark:bg-card/20 ">
                <SheetHeader className='p-0 bg-amber-950'>

                </SheetHeader>
                <form>
                    <SheetTitle className="w-full whitespace-normal wrap-break-word ">
                        {title}

                    </SheetTitle>
                    <SheetDescription className="w-full whitespace-break-spaces wrap-break-word ">
                        <Input
                            value={bodyValue}
                        />
                    </SheetDescription>
                    <div className='flex flex-row items-center justify-between items- w-fill '>

                        <Button>
                            <Trash size={20} />
                            Delete
                        </Button>
                        {editActive ?
                            <Button onClick={() => { setEditActive(false) }}>
                                <Save size={20} />
                                Save
                            </Button> :
                            <Button onClick={() => { setEditActive(true) }}>
                                <Edit size={20} />
                                Edit
                            </Button>}



                    </div>
                </form>
            </SheetContent>
        </>
    )
}
