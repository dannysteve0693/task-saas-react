import React, { use, useState } from 'react';
import Head from '@/components/Head';

import { useFetcher, useLoaderData } from 'react-router';

import TopAppBar from '@/components/TopAppBar';
import { Page, PageHeader, PageTitle, PageList } from '@/components/Page';
import TaskCreateButton from '@/components/TaskCreateButton';
import TaskEmptyState from '@/components/TaskEmptyState';

import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';

import type { Models } from 'appwrite';

const InboxPage = () => {
  const fetcher = useFetcher();
  const { tasks } = useLoaderData<{ tasks: Models.DocumentList<Models.Document> }>()
  const [taskFormShow, setTaskFormShow] = useState(false);

  return (
    <>
      <Head title='Inbox' />

      <TopAppBar
        title='Inbox'
        taskCount={20}
      />

      <Page>
        <PageHeader>
          <PageTitle>Inbox</PageTitle>
        </PageHeader>
        <PageList>
          {tasks.documents.map(({ $id, content, completed, due_date, projectId: project }) => (
            <TaskCard
              key={$id}
              id={$id}
              content={content}
              completed={completed}
              due_date={due_date}
              project={project}

            />
          ))}


          {!taskFormShow && (
            <TaskCreateButton onClick={() => setTaskFormShow(true)} />
          )}
          {!taskFormShow && <TaskEmptyState type='inbox' />}

          {taskFormShow && (
            <TaskForm
              className='mt-1'
              mode='create'
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
};

export default InboxPage;
