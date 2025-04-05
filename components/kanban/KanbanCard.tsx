import { Task } from "@/app/types";
import TaskActions from "../tasks/TaskActions";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "../ui/separator";
import MemberAvatar from "../members/MemberAvatar";
import { TaskDate } from "../tasks/TaskDate";
import ProjectAvatar from "../projects/ProjectAvatar";

interface kanbanCardProps {
  task: Task
}

const KanbanCard = ({ task }: kanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions taskId={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <Separator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} fallBackClassName="text-[10px]" />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallBackClassName="text-[10px]" />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  )
};

export default KanbanCard;
