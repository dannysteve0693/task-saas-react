import React, { useState, useCallback } from 'react'

import { cn } from '@/lib/utils'
import { formatCustomDate, getTaskDueDateColorClass, truncateString } from '@/lib/utils'

import { Button } from './ui/button'
import { Check, CalendarDays, Hash, Inbox, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import TaskForm from './TaskForm'
import { useFetcher, useLocation } from 'react-router'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogAction
} from './ui/alert-dialog'

import type { Models } from 'appwrite'
import type { Task } from '@/types'
import { toast } from "sonner"
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'

type TaskCardProps = {
    id: string;
    content: string;
    completed: boolean;
    dueDate: Date;
    project: Models.Document | null;
}


const TaskCard: React.FC<TaskCardProps> = ({ id, content, completed, dueDate, project }) => {
    const [taskFormShow, setTaskFormShow] = useState(false);
    const fetcher = useFetcher();
    const location = useLocation();

    const fetcherTask = fetcher.json as unknown as Task;
    console.log(fetcherTask);

    const task: Task = Object.assign({
        id,
        content,
        completed,
        due_date: dueDate,
        project
    }, fetcherTask);

    const handleTaskComplete = useCallback(async (completed: boolean) => {
        return await fetcher.submit(JSON.stringify({
            id: task.id, completed
        }), {
            action: '/app',
            method: 'PUT',
            encType: 'application/json'
        })
    }, [task.id, task.completed]);

    return (
        <>
            {!taskFormShow && (
                <div className="group/card relative grid grid-cols-[max-content,minmax(0,1fr)] gap-3 border-b">
                    <Button
                        variant={'outline'}
                        size={'icon'}
                        className={cn('group/button rounded-full w-5 h-5 mt-2', task.completed && 'bg-border')}
                        role='checkbox'
                        aria-checked={task.completed}
                        aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
                        aria-describedby='task-content'
                        onClick={async () => {
                            await handleTaskComplete(!task.completed);

                            if (!task.completed) {
                                toast('1 task completed', {
                                    action: {
                                        label: 'Undo',
                                        onClick: () => {
                                            handleTaskComplete(false);
                                        },
                                    },
                                });
                            }
                        }}
                    >
                        <Check strokeWidth={4} className={cn('!w-3 !h-3 text-muted-foreground group-hover/button:opacity-100 transition-opacity', task.completed ? 'opacity-100' : 'opacity-0')} />
                    </Button>

                    <Card className='rounded-none py-2 space-y-1.5 border-none'>
                        <CardContent className='p-0'>
                            <p id="task-content" className={cn('text-sm max-md:me-16', task.completed && 'text-muted-foreground line-through')}>
                                {task.content}
                            </p>
                        </CardContent>
                        <CardFooter className='p-0 flex gap-4'>
                            {task.due_date && location.pathname !== '/app/today' && (
                                <div className={
                                    cn('flex items-center gap-1 text-xs text-muted-foreground', getTaskDueDateColorClass(task.due_date, task.completed))
                                }>
                                    <CalendarDays size={14} />

                                    {formatCustomDate(task.due_date)}
                                </div>
                            )}

                            {location.pathname !== '/app/inbox' && location.pathname !== `/app/projects/${project?.$id}` && (
                                <div className="grid grid-cols-[minmax(0,180px),max-content] items-center gap-1 text-xs text-muted-foreground ms-auto">
                                    <div className="truncate text-right">
                                        {task.project?.name || "Inbox"}
                                    </div>

                                    {task.project ? (<Hash size={14} />) : (<Inbox size={14} className='text-muted-foreground' />)}
                                </div>
                            )}

                        </CardFooter>
                    </Card>

                    <div className="absolute top-1.5 right-0 bg-background ps-1 shadow-[-10px_0_5px_hsl(var(--background))] flex items-center gap-1 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 max-md:opacity-100 ">
                        {
                            !task.completed && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className='w-6 h-6 text-muted-foreground'
                                            aria-label='Edit Task'
                                            onClick={() => setTaskFormShow(true)}
                                        >
                                            <Edit />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Edit Task
                                    </TooltipContent>
                                </Tooltip>
                            )
                        }

                        <AlertDialog>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'ghost'}
                                        size={'icon'}
                                        className='w-6 h-6 text-muted-foreground'
                                        aria-label='Delete Task'
                                    >
                                        <Trash2 />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Delete Task
                                </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className='text-center text-red-500'>Delete task?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        The <strong>{truncateString(task.content, 48)}</strong> task will be deleted permanently.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        fetcher.submit(JSON.stringify({ id: task.id }), {
                                            action: `/app`,
                                            method: 'DELETE',
                                            encType: 'application/json'
                                        })
                                    }}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>

                        </AlertDialog>

                    </div>
                </div>

            )}

            {taskFormShow && (
                <TaskForm
                    className='my-1'
                    defaultFormData={{
                        ...task,
                        project: project && project?.$id
                    }}
                    mode='edit'
                    onCancel={() => setTaskFormShow(false)}
                    onSubmit={(formData) => {
                        fetcher.submit(JSON.stringify(formData), {
                            action: `/app`,
                            method: 'PUT',
                            encType: 'application/json'
                        })
                        setTaskFormShow(false)
                    }}
                />
            )}
        </>
    )
}

export default TaskCard
