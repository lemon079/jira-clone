"use client"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import useMedia from "use-media"
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const ResponsiveModal = ({ children, onOpenChange, isOpen }: { children: React.ReactNode, onOpenChange?: (open: boolean) => void, isOpen: boolean }) => {
    const isDisplay = useMedia({ minWidth: "1024px" });
    if (isDisplay) {
        return (
            <Dialog onOpenChange={onOpenChange} open={isOpen}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-hidden hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    // if not then use drawer
    return (
        <Drawer onOpenChange={onOpenChange} open={isOpen}>
            <DrawerContent>
                <div className="w-full sm:max-w-lg p-0 border-none overflow-y-hidden hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ResponsiveModal