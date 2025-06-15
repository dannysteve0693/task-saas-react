import { useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';

import Head from '@/components/Head';
import TopAppBar from '@/components/TopAppBar';
import { Button } from '@/components/ui/button';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import TaskCardSkeleton from '@/components/TaskCardSkeleton';
import ProjectActionMenu from '@/components/ProjectActionMenu';
import TaskCreateButton from '@/components/TaskCreateButton';
import TaskEmptyState from '@/components/TaskEmptyState';
import { Page, PageHeader, PageTitle, PageList } from '@/components/Page';

import { MoreHorizontal } from 'lucide-react';

import type { Models } from 'appwrite';

const ProjectDetailPage = () => {
  const fetcher = useFetcher();
  const { project } = useLoaderData<{ project: Models.Document }>();

  // get task not completed
  const projectTasks = project.tasks.filter(
    (i: Models.Document) => !i.completed,
  ) as Models.Document[];

  // sort task by due date
  projectTasks.sort((a, b) => {
    return a.due_date < b.due_date ? -1 : 1;
  });

  const [taskFormShow, setTaskFormShow] = useState<boolean>(false);

  return (
    <>
      <Head title={project.name + ' - Tasky AI'} />

      <TopAppBar title={project.name} />

      <Page>
        <PageHeader>
          <div className='flex items-center gap-2'>
            <PageTitle>{project.name}</PageTitle>

            <ProjectActionMenu
              defaultFormData={{
                id: project.$id,
                name: project.name,
                color_name: project.color_name,
                color_hex: project.color_hex,
              }}
            >
              <Button>
                <MoreHorizontal />
              </Button>
            </ProjectActionMenu>
          </div>
        </PageHeader>

        <PageList>
          {projectTasks.map(({ $id, content, completed, due_date }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              dueDate={due_date}
              project={project}
            />
          ))}

          {fetcher.state !== 'idle' && <TaskCardSkeleton />}

          {!taskFormShow && (
            <TaskCreateButton onClick={() => setTaskFormShow(true)} />
          )}

          {!projectTasks.length && !taskFormShow && (
            <TaskEmptyState type='project' />
          )}

          {taskFormShow && (
            <TaskForm
              className='mt-1'
              mode='create'
              onCancel={() => setTaskFormShow(false)}
              defaultFormData={{
                content: '',
                due_date: null,
                project: project.$id,
              }}
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
};

export default ProjectDetailPage;
