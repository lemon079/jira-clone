import { TriangleAlertIcon } from 'lucide-react'
import React from 'react'

const PageError = ({ message = 'Something Went Wrong' }: { message: string }) => {
    return (
        <div className='h-full flex flex-col items-center justify-center'>
            <TriangleAlertIcon className='size-6 text-muted-foreground mb-2' />
            <p className='text-sm'>{message}</p>
        </div>
    )
}

export default PageError