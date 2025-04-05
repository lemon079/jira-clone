import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";

interface ProjectAvatarProps {
    name: string;
    image?: string;
    className?: string;
    fallBackClassName?: string;
}

const ProjectAvatar = ({ name, image, className, fallBackClassName }: ProjectAvatarProps) => {

    if (image) {
        return (
            <div className={cn("size-5 relative rounded-md overflow-hidden", className)}>
                <Image src={image} alt='workspace-logo' fill className='object-cover' />
            </div>
        )
    } else {
        return (
            <div>
                <Avatar className={cn("size-5 rounded-md", className)}>
                    <AvatarFallback className={cn("text-white bg-blue-600 text-sm uppercase", fallBackClassName)} >
                        {name[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
        )
    }
}

export default ProjectAvatar