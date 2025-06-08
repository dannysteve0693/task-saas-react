import type { PropsWithChildren } from 'react';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

import Taskform from '@/components/TaskForm';

const TaskFormDialog: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Taskform />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
