import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

import { useLocation, useFetcher } from 'react-router';
import { startOfToday } from 'date-fns';

import Taskform from '@/components/TaskForm';


const TaskFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'q') {
        const target = event.target as HTMLElement;
        if (target.localName === 'textarea') return;
        event.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    }
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Taskform
          defaultFormData={{
            content: '',
            due_date:
              location.pathname === '/app/today' ? startOfToday() : null,
            projectId: null,
          }}
          mode='create'
          onCancel={() => setOpen(false)}
          onSubmit={(formData) => {
            fetcher.submit(JSON.stringify(formData), {
              action: '/app',
              method: 'POST',
              encType: 'application/json',
            });

            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
