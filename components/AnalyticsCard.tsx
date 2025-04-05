import React from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AnalyticsCardProps {
    title: string;
    value: number;
    increasedValue: number;
    variant: "increase" | "decrease"
}

const AnalyticsCard = ({ increasedValue, title, value, variant }: AnalyticsCardProps) => {
    const iconColor = variant === "increase" ? "text-emerald-500" : "text-red-500"
    const increasedValueColor = variant === "increase" ? "text-emerald-500" : "text-red-500";
    const Icon: any = variant === "increase" ? FaCaretUp : FaCaretDown;

    return (
        <Card className='shadow-none border-none w-full'>
            <CardHeader>
                <div className='flex items-center gap-x-2.5'>
                    <CardDescription className='flex items-center gap-x-2 font-medium overflow-hidden'>
                        <span className='truncate text-base'>{title}</span>
                    </CardDescription>
                    <div className='flex items-center gap-x-1'>
                        <Icon className={cn(iconColor, "size-4")} />
                        <span className={cn(increasedValueColor, "truncate text-base font-medium")}>{increasedValue}</span>
                    </div>
                </div>
                <CardTitle className='font-semibold'>{value}</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default AnalyticsCard