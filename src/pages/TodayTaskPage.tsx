import { useState } from 'react';
import Head from '@/components/Head';

import { useFetcher, useLoaderData } from 'react-router';

import TopAppBar from '@/components/TopAppBar';
import { Page, PageHeader, PageTitle, PageList } from '@/components/Page';
import TaskCreateButton from '@/components/TaskCreateButton';
import TaskEmptyState from '@/components/TaskEmptyState';

import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';

import type { Models } from 'appwrite';
import TaskCardSkeleton from '@/components/TaskCardSkeleton';

import { CheckCircle2 } from 'lucide-react';
import { startOfToday } from 'date-fns';

const TodayTaskPage = () => {
    const fetcher = useFetcher();
    const { tasks } = useLoaderData<{ tasks: Models.DocumentList<Models.Document> }>()
    const [taskFormShow, setTaskFormShow] = useState(false);

    return (
        <>
            <Head title='Today - Task AI' />

            <TopAppBar
                title='Today'
                taskCount={tasks.total}
            />

            <Page>
                <PageHeader>
                    <PageTitle>Today</PageTitle>

                    {tasks.total > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CheckCircle2 size={16} /> {tasks.total} tasks
                        </div>
                    )}
                </PageHeader>
                <PageList>
                    {tasks.documents.map(({ $id, content, completed, due_date, project }) => (
                        <TaskCard
                            key={$id}
                            id={$id}
                            content={content}
                            completed={completed}
                            dueDate={due_date}
                            project={project}

                        />
                    ))}

                    {fetcher.state !== 'idle' && (
                        <TaskCardSkeleton />
                    )}


                    {!taskFormShow && (
                        <TaskCreateButton onClick={() => setTaskFormShow(true)} />
                    )}
                    {!tasks.total && !taskFormShow && <TaskEmptyState />}

                    {taskFormShow && (
                        <TaskForm
                            className='mt-1'
                            mode='create'
                            defaultFormData={{
                                content: '',
                                due_date: startOfToday(),
                                project: null
                            }}
                            onCancel={() => setTaskFormShow(false)}
                            onSubmit={(formData) => {
                                fetcher.submit(JSON.stringify(formData), {
                                    action: '/app',
                                    method: 'POST',
                                    encType: 'application/json',
                                });
                            }}
                        />
                    )}
                </PageList>
            </Page>
        </>
    );
}

export default TodayTaskPage
