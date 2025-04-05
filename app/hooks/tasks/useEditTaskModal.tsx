import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'

const useEditTaskModal = () => {
    const [taskId, setTaskId] = useQueryState("edit-task", parseAsString)

    function open(id: string) {
        setTaskId(id);
    }
    function close() {
        setTaskId(null);
    }

    return {
        open,
        close,
        taskId,
        setTaskId
    }
}

export default useEditTaskModal