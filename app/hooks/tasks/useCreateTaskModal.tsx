import { TaskStatus } from '@/app/types';
import { parseAsString, useQueryState } from 'nuqs'

const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState("create-task", parseAsString.withDefault(""))

    function open(taskStatus: TaskStatus | string) {
        setIsOpen(taskStatus);
    }

    function close() {
        setIsOpen(null);
    }

    return {
        open,
        close,
        isOpen,
        setIsOpen
    }
}

export default useCreateTaskModal