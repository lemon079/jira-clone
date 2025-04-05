import { Avatar, AvatarFallback } from '../ui/avatar'
import { cn } from '@/lib/utils'

interface MemberAvatarProps {
    name: string;
    className?: string;
    fallBackClassName?: string;
}

const MemberAvatar = ({ name, className, fallBackClassName }: MemberAvatarProps) => {

    return (
        <div>
            <Avatar className={cn("size-5 transition border border-neutral-300 rounded-full", className)}>
                <AvatarFallback className={cn("bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center", fallBackClassName)} >
                    {name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default MemberAvatar;