import { useState } from 'react'
import Header from '@/components/home/Header/Header'
import MatrixBG from '@/components/home/MatrixBG/MatrixBG'
import TasksGrid from '@/components/home/TasksGrid/TasksGrid'
import Snowfall from 'react-snowfall'
import { DEFAULT_MATRIX_CONFIG, type MatrixConfig } from '@/types/matrixConfig'
import PictureCards from '@/components/home/PictureCards/PictureCardsGroup'

export default function Home() {
    // State for the MatrixBG and Header
    const [matrixConfig, setMatrixConfig] = useState<MatrixConfig>(DEFAULT_MATRIX_CONFIG)

    return (
        <main>
            <div className='relative flex flex-row gap-4 px-4 pt-4 max-w-[1920px] z-1'>
                <Header
                    config={matrixConfig}
                    onConfigChange={setMatrixConfig}
                />
                <PictureCards />

            </div >

            <div className='relative px-4 pt-4 overflow-hidden z-1 max-h-192 max-w-[1920px]'>
                <TasksGrid />
            </div>
            <div className='absolute inset-0'>
                <MatrixBG
                    config={matrixConfig}
                />
                <Snowfall snowflakeCount={1000} />
            </div>
        </main>
    )
}
