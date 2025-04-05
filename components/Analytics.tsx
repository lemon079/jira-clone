import React from 'react'
import AnalyticsCard from './AnalyticsCard'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { ProjectAnalyticsResponseType } from '@/app/hooks/projects/useGetProjectAnalytics'

const Analytics = ({ data }: ProjectAnalyticsResponseType) => {

    return (
        <ScrollArea className='border rounded-lg w-full whitespace-nowrap shrink-0'>
            <div className='w-full flex flex-row'>
                <div className='flex items-center flex-1 border-r-2'>
                    <AnalyticsCard title='Total Tasks' value={data?.tasksCount} increasedValue={data.tasksDifference} variant={data?.tasksDifference > 0 ? "increase" : "decrease"} />
                </div>
                <div className='flex items-center flex-1 border-r-2'>
                    <AnalyticsCard title='Assigned Tasks' value={data?.assignedTasksCount} increasedValue={data.assignedTasksDifference} variant={data?.assignedTasksDifference > 0 ? "increase" : "decrease"} />
                </div>
                <div className='flex items-center flex-1 border-r-2'>
                    <AnalyticsCard title='Completed Tasks' value={data?.completedTasksCount} increasedValue={data.completedTasksDifference} variant={data?.completedTasksDifference > 0 ? "increase" : "decrease"} />
                </div>
                <div className='flex items-center flex-1 border-r-2'>
                    <AnalyticsCard title='Overdue Tasks' value={data?.overdueTasksCount} increasedValue={data.overdueTasksDifference} variant={data?.overdueTasksDifference > 0 ? "increase" : "decrease"} />
                </div>
                <div className='flex items-center flex-1'>
                    <AnalyticsCard title='Incomplete Tasks' value={data?.incompleteTasksCount} increasedValue={data.incompleteTasksDifference} variant={data?.incompleteTasksDifference > 0 ? "increase" : "decrease"} />
                </div>
            </div>
            <ScrollBar orientation='horizontal' />
        </ScrollArea>
    )
}

export default Analytics