import { parseAsBoolean, useQueryState } from 'nuqs'

const useCreateProjectModal = () => {
    const [isOpen, setIsOpen] = useQueryState("create-project", parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }))

    function open() {
        setIsOpen(true);
    }
    function close() {
        setIsOpen(false);
    }

    return {
        open,
        close,
        isOpen,
        setIsOpen
    }
}

export default useCreateProjectModal