import { parseAsBoolean, useQueryState } from 'nuqs'

const useCreateWorkspaceModal = () => {
    const [isOpen, setIsOpen] = useQueryState("create-workspace", parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }))

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    return {
        isOpen,
        setIsOpen,
        open,
        close
    }
}

export default useCreateWorkspaceModal