import { useState } from 'react'
import Header from '@/components/home/Header'
import MatrixBG from '@/components/home/MatrixBG'
import TasksGrid from '@/components/home/TasksGrid'
import Snowfall from 'react-snowfall'
import { DEFAULT_MATRIX_CONFIG, type MatrixConfig } from '@/types/matrixConfig'

export default function Home() {
    const [matrixConfig, setMatrixConfig] = useState<MatrixConfig>(DEFAULT_MATRIX_CONFIG)

    return (
        <main>
            <div className='relative flex flex-col w-full gap-4 p-4 z-1 
            
            '>
                <Header
                    config={matrixConfig}
                    onConfigChange={setMatrixConfig}
                />
                <TasksGrid />
            </div >
            <div className='absolute inset-0'>
                <MatrixBG
                    config={matrixConfig}
                />
                <Snowfall />
            </div>
        </main>
    )
}
