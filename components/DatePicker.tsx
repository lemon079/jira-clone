"use client"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarCheck } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
    placeholder?: string;
}


export const DatePicker = ({ value, onChange, className, placeholder }: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} size={"lg"} className={cn("justify-start text-left font-normal px-3", !value && "text-muted-foreground", className)}>
                    <CalendarCheck className="mr-2 size-4" />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={value} onSelect={(date) => onChange(date as Date)} initialFocus />
            </PopoverContent>
        </Popover>
    )
}