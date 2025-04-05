import { Task, TaskStatus } from "@/app/types";
import { Droppable, Draggable, DragDropContext, DropResult } from "@hello-pangea/dnd";
import React, { useCallback, useEffect, useState } from "react";
import KanBanColumnHeader from "./KanBanColumnHeader";
import KanbanCard from "./KanbanCard";

interface DataKanbanProps {
    data: Task[];
    onChange: (task: { $id: string; status: TaskStatus; position: number }[]) => void
}
const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

type TasksState = {
    [key in TaskStatus]: Task[];
};

const DataKanban = ({ data, onChange }: DataKanbanProps) => {

    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
        });

        setTasks(newTasks);

    }, [data])

    const onDragEnd = useCallback((result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        interface payloadType {
            $id: string;
            status: TaskStatus;
            position: number;
        }

        let updatesPayload: payloadType[] = [];

        setTasks((prevTasks) => {

            const newTasks = { ...prevTasks };

            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            if (!movedTask) {
                console.log("No Task found at source index")
                return prevTasks
            }

            const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;

            newTasks[sourceStatus] = sourceColumn;

            const destinationColumn = [...newTasks[destStatus]]
            destinationColumn.splice(destination.index, 0, updatedMovedTask)
            newTasks[destStatus] = destinationColumn

            updatesPayload.push({ $id: updatedMovedTask.$id, status: destStatus, position: Math.min((destination.index + 1) * 1000, 1_000_000) })

            newTasks[destStatus].forEach((task, index) => {
                if (task && task.$id !== updatedMovedTask.$id) {
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000)
                    if (task.position !== newPosition) {
                        updatesPayload.push({
                            $id: task.$id,
                            status: destStatus,
                            position: newPosition
                        })
                    }
                }
            });
            if (sourceStatus !== destStatus) {
                newTasks[sourceStatus].forEach((task, index) => {
                    if (task) {
                        const newPosition = Math.min((index + 1) * 1000, 1_000_000)
                        if (task.position !== newPosition) {
                            updatesPayload.push({ $id: task.$id, status: sourceStatus, position: newPosition })
                        }
                    }
                })
            }

            return newTasks;
        })
        onChange(updatesPayload);
    }, [onChange]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* @ts-ignore */}
            <div className="flex overflow-x-auto">
                {boards.map((board) => (
                    <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                        <KanBanColumnHeader board={board} taskCount={tasks[board].length} />
                        {/* @ts-ignore */}
                        <Droppable droppableId={board}>
                            {/* @ts-ignore */}
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[200px] py-1.5"
                                >
                                    {/* @ts-ignore */}
                                    {tasks[board].map((task, index) => (
                                        <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                            {/* @ts-ignore */}
                                            {(provided) => (
                                                < div

                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <KanbanCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))
                }
            </div >
        </DragDropContext >
    );
};

export default DataKanban;
