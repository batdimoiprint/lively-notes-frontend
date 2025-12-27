
import { Edit, Save, Trash } from 'lucide-react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { type Tasks } from '@/types/tasktypes'
import { Button } from '../../ui/button'

import { useState } from 'react'
import { Input } from '../../ui/input'
import {
    // useForm
    // , type SubmitHandler 
} from 'react-hook-form'
// import { useMutation } from '@tanstack/react-query'

export default function TaskSheet({ task }: { task: Tasks | null }) {
    const [editActive, setEditActive] = useState<boolean>(false)
    // const {
    //     register,
    //     handleSubmit,
    //       formState: { errors }, reset
    // } = useForm<Tasks>()

    // const mutation = useMutation({
    //     onMutate: () => {

    //     },
    //     onSuccess: () => {

    //     },
    //     onError: () => {

    //     }
    // })

    // const onSubmit: SubmitHandler<Tasks> = (data) => {
    //     mutation.mutate(data)
    // }


    return (
        <>
            <SheetContent side='left' className="p-8 backdrop-blur-md dark:bg-card/20">
                <SheetHeader className='p-0 bg-amber-950'>

                </SheetHeader>
                <form
                // onSubmit={handleSubmit(onSubmit)}
                >
                    <SheetTitle className="w-full whitespace-normal wrap-break-word ">
                        {task?.title}

                    </SheetTitle>
                    <SheetDescription className="w-full whitespace-break-spaces wrap-break-word ">
                        <Input
                            value={task?.body}
                        // placeholder="Edit your note..."
                        // onChange={e => setBodyValue(e.target.value)}
                        // disabled={!editActive}
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
