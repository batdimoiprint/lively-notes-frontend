import Header from '@/components/home/Header'
import TasksGrid from '@/components/home/TasksGrid'

export default function Home() {
    return (
        <div className='p-4 flex flex-col gap-4'>
            <Header />
            <TasksGrid />
        </div >
    )
}
