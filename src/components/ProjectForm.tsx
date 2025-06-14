import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './ui/card';

import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './ui/command';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

import { Circle, ChevronDown, Check, Bot } from 'lucide-react';

import { PROJECT_COLORS } from './constants';

import type { Project, ProjectForm } from '@/types';

const DEFAULT_PROJECT_NAME = 'Untitled';
const DEFAULT_PROJECT_COLOR_NAME = 'Slate';
const DEFAULT_PROJECT_COLOR_HEX = '#64748b';

const DEFAULT_FORM_DATA: Project = {
  id: null,
  name: DEFAULT_PROJECT_NAME,
  color_name: DEFAULT_PROJECT_COLOR_NAME,
  color_hex: DEFAULT_PROJECT_COLOR_HEX,
};

type ProjectFormProps = {
  defaultFormData?: Project;
  mode: 'create' | 'edit';
  onCancel?: () => void;
  onSubmit?: (formData: ProjectForm) => void;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  defaultFormData = DEFAULT_FORM_DATA,
  mode,
  onCancel = () => {},
  onSubmit,
}) => {
  const [projectName, setProjectName] = useState<string>(defaultFormData.name);
  const [projectNameCharCount, setProjectNameCharCount] = useState<number>(
    defaultFormData.name.length,
  );

  const [colorName, setColorName] = useState<string>(
    defaultFormData.color_name,
  );
  const [colorHex, setColorHex] = useState<string>(defaultFormData.color_hex);
  const [colorOpen, setColorOpen] = useState<boolean>(false);
  const [aiTaskGen, setAiTaskGen] = useState<boolean>(false);
  const [taskGenPrompt, setTaskGenPrompt] = useState<string>('');
  const [formData, setFormData] = useState<ProjectForm>({
    ...defaultFormData,
    ai_task_gen: aiTaskGen,
    task_gen_prompt: taskGenPrompt,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: projectName,
      color_name: colorName,
      color_hex: colorHex,
      ai_task_gen: aiTaskGen,
      task_gen_prompt: taskGenPrompt,
    }));
  }, [projectName, colorName, colorHex, aiTaskGen, taskGenPrompt]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit(formData);
  }, [onSubmit, formData]);

  const handleKeySubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <Card>
      <CardHeader className='p-4'>
        <CardTitle>{mode === 'create' ? 'Add project' : 'Edit'}</CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className='p-4 grid grid-cols-1 gap-2'>
        <div>
          <Label htmlFor='project_name'>Name</Label>
          <Input
            type='text'
            id='project_name'
            className='mt-2 mb-1'
            onInput={(e) => {
              setProjectName(e.currentTarget.value);
              setProjectNameCharCount(e.currentTarget.value.length);
            }}
            maxLength={120}
            onKeyDown={handleKeySubmit}
          />

          <div
            className={cn(
              'text-xs text-muted-foreground max--max ms-auto',
              projectNameCharCount >= 110 && 'text-destructive',
            )}
          >
            {projectNameCharCount}/120
          </div>
        </div>

        <div>
          <Label htmlFor='color'>Color</Label>

          <Popover
            modal={true}
            open={colorOpen}
            onOpenChange={setColorOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className='w-full mt-2'
                id='color'
              >
                <Circle fill={colorHex} />
                {colorName}

                <ChevronDown className='ms-auto' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='p-0 w-[478px] max-sm:w-[360px]'
            >
              <Command>
                <CommandInput placeholder='Search color...' />

                <CommandList>
                  <ScrollArea>
                    <CommandEmpty>No color found.</CommandEmpty>
                    <CommandGroup>
                      {PROJECT_COLORS.map(({ name, hex }) => (
                        <CommandItem
                          key={name}
                          value={`${name}=${hex}`}
                          onSelect={(value) => {
                            console.log(value);
                            const [name, hex] = value.split('=');

                            setColorName(name);
                            setColorHex(hex);
                            setColorOpen(false);
                          }}
                        >
                          <Circle fill={hex} />
                          {name}
                          {colorName === name && <Check className='ms-auto' />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {mode === 'create' && (
          <div className='border rounded-md mt-6'>
            <div className='flex items-center gap-3 py-2 px-3'>
              <Bot className='text-muted-foreground flex-shrink-0' />

              <div className='space-y-0.5 me-auto'>
                <Label
                  htmlFor='ai_generate'
                  className='block text-sm'
                >
                  AI Task Generator
                </Label>
                <p className='text-xs text-muted-foreground'>
                  Automatically create tasks by providing a simple prompt.
                </p>
              </div>

              <Switch
                id='ai_generate'
                onCheckedChange={setAiTaskGen}
              />
            </div>

            {aiTaskGen && (
              <Textarea
                autoFocus
                placeholder='Tell me about your project. What you want to accomplish?'
                className='border-none'
                value={taskGenPrompt}
                onChange={(e) => setTaskGenPrompt(e.currentTarget.value)}
                onKeyDown={handleKeySubmit}
              />
            )}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className='flex justify-end gap-3 p-4'>
        <Button
          variant={'secondary'}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          disabled={!projectName || (aiTaskGen && !taskGenPrompt)}
          onClick={handleSubmit}
        >
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectForm;
