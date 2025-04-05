import useGetMembers from '@/app/hooks/members/useGetMembers';
import useGetProjects from '@/app/hooks/projects/useGetProjects';
import useWorkspaceId from '@/app/hooks/workspaces/useWorkspaceId'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select'
import { DatePicker } from '../DatePicker';
import { FolderIcon, ListChecksIcon, UserIcon } from 'lucide-react';
import { TaskStatus } from '@/app/types';
import { useTaskFilters } from '@/app/hooks/tasks/useTasksFilter';

interface DataFilterProps {
    hideProjectFilter?: boolean
}

const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
    const workspaceId = useWorkspaceId();

    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.documents.map(project => ({
        value: project.$id,
        label: project.name
    }))

    const memberOptions = members?.documents.map(member => ({
        value: member.$id,
        label: member.name
    }))

    // all states below, setFilter to change them. their values persist as they are shown in URL even after refresing page
    const [{ status, assigneeId, dueDate, projectId, search }, setFilter] = useTaskFilters();

    const onStatusChange = (value: string) => setFilter({ status: value === "all" ? null : (value as TaskStatus) });

    const onAssigneeChange = (value: string) => setFilter({ assigneeId: value === "all" ? null : (value as string) });

    const onDueDateChange = (value: string) => setFilter({ dueDate: value === "all" ? null : (value as string) });

    const onProjectChange = (value: string) => setFilter({ projectId: value === "all" ? null : (value as string) });

    const onSearchChange = (value: string) => setFilter({ search: value.trim() === "" ? null : (value as string) });

    if (isLoading) return null;

    return (
        <div className='flex flex-col lg:flex-row gap-2'>
            <Select defaultValue={status ?? undefined} onValueChange={(value) => onStatusChange(value)}>
                <SelectTrigger className='w-full lg:w-auto h-full'>
                    <div className='flex items-center pr-2'>
                        <ListChecksIcon className='size-4 mr-2' />
                        <SelectValue placeholder="All Status" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All status</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
            </Select>
            <Select defaultValue={assigneeId ?? undefined} onValueChange={(value) => onAssigneeChange(value)}>
                <SelectTrigger className='w-full lg:w-auto h-full'>
                    <div className='flex items-center pr-2'>
                        <UserIcon className='size-4 mr-2' />
                        <SelectValue placeholder="All Assignees" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All Assignees</SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((member) => (
                        <SelectItem key={member.value} value={member.value}>{member.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {!hideProjectFilter && (
                <Select defaultValue={projectId ?? undefined} onValueChange={(value) => onProjectChange(value)}>
                    <SelectTrigger className='w-full lg:w-auto h-full'>
                        <div className='flex items-center pr-2'>
                            <FolderIcon className='size-4 mr-2' />
                            <SelectValue placeholder="All Projects" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Projects</SelectItem>
                        <SelectSeparator />
                        {projectOptions?.map((project) => (
                            <SelectItem key={project.value} value={project.value}>{project.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <DatePicker placeholder='Due Date' value={dueDate ? new Date(dueDate) : undefined} onChange={(date) => {
                setFilter({ dueDate: date ? date.toISOString() : null })
            }} />
        </div>
    )
}

export default DataFilter