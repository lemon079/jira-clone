"use client"
import { MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname])

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant={"secondary"} className='lg:hidden'><MenuIcon className='size-4 text-neutral-500' /></Button>
            </SheetTrigger>
            <SheetContent side={"left"} className='p-0'>
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar

{/* marking trigger to be asChild to tell nextjs that this is a single child ( having other things inside), this is important because sheettrigger is a button and inside it is also a button. without this, a hydration error will occure by nextjs */ }