import Header from '@/components/home/Header'
import MatrixBG from '@/components/home/MatrixBG'
import TasksGrid from '@/components/home/TasksGrid'
import Snowfall from 'react-snowfall'

export default function Home() {



    return (
        <main>
            <div className='relative flex flex-col w-full gap-4 p-4 z-1 
            // max-w-1/2
            '>
                <Header
                // onConfigChange={setMatrixConfig}
                />
                <TasksGrid />
            </div >
            <div className='absolute inset-0'>
                <MatrixBG
                // config={matrixConfig}
                />
                <Snowfall />
            </div>
        </main>
    )
}
