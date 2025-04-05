import { Button, ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveModal from "@/components/ui/responsiveModel";
import { useState } from "react";

export const useConfirm = (title: string, message: string, variant: ButtonProps["variant"]): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        })
    }

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationDialogue = () => (

        <ResponsiveModal isOpen={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full shadow-none border-none">
                <CardContent className="pt-5">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                        <Button onClick={handleCancel} variant={"outline"} className="w-full lg:w-auto">Cancel</Button>
                        <Button onClick={handleConfirm} variant={variant} className="w-full lg:w-auto">Confirm</Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )


    return [ConfirmationDialogue, confirm];

}