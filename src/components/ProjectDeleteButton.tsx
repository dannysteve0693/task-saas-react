import { useCallback } from 'react';

import { useFetcher, useNavigate, useLocation } from 'react-router';

import { truncateString } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from './ui/button';

import { toast } from 'sonner';

import { Trash2 } from 'lucide-react';

import type { Project } from '@/types';
import { truncate } from 'fs';

type ProjectDeleteButtonProps = {
  defaultFormData: Project;
};

const ProjectDeleteButton: React.FC<ProjectDeleteButtonProps> = ({
  defaultFormData,
}) => {
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();

  const toastId = toast('Deleting project...', {
    duration: Infinity,
  });

  const handleProjectDelete = useCallback(async () => {
    if (location.pathname === `/app/projects/${defaultFormData.id}`) {
      navigate('/app/inbox');
    }

    try {
      await fetcher.submit(defaultFormData, {
        action: '/app/projects',
        method: 'DELETE',
        encType: 'application/json',
      });

      toast('Project deleted', {
        id: toastId,
        description: `The project ${truncateString(defaultFormData.name, 32)} has been successfully deleted.`,
        duration: 5000,
      });
    } catch (err) {
      toast('Error deleting project', {
        id: toastId,
        description: `An error occured while deleting the project.`,
        duration: 5000,
      });
      console.log('Error deleting project: ', err);
    }
  }, [defaultFormData]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'sm'}
          className='w-full justify-start px-2 !text-destructive'
        >
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            The <strong>{truncateString(defaultFormData.name, 48)}</strong>{' '}
            project and all of its task will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleProjectDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDeleteButton;
