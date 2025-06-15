import { useState } from 'react';
import { useFetcher } from 'react-router';

import { truncateString } from '@/lib/utils';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
// import type { ProjectForm } from '@/types';
import type { Project } from '@/types';

import ProjectForm from './ProjectForm';
import { toast } from 'sonner';

type ProjectFormDialogProps = {
  defaultFormData?: Project;
  children: React.ReactNode;
  method: 'POST' | 'PUT';
};

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  defaultFormData,
  children,
  method,
}) => {
  const fetcher = useFetcher();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='p-0 border-0 !rounded-xl'>
        <ProjectForm
          mode={method === 'POST' ? 'create' : 'edit'}
          defaultFormData={defaultFormData}
          onCancel={() => setOpen(false)}
          onSubmit={async (data) => {
            setOpen(false);
            const toastId = toast(
              `${method === 'POST' ? 'Creating' : 'Updating'} project...`,
              {
                duration: Infinity,
              },
            );
            await fetcher.submit(JSON.stringify(data), {
              action: '/app/projects',
              method,
              encType: 'application/json',
            });

            toast(`Project ${method === 'POST' ? 'created' : 'updated'}`, {
              description: `Project ${truncateString(data.name, 32)} ${data.ai_task_gen ? 'and its tasks' : ''} have been successfully ${method === 'POST' ? 'created' : 'updated'}.`,
              duration: 5000,
              id: toastId,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
