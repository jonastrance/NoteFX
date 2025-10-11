import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskSchema } from '../utils/taskSchema';
import { Task, TaskInput, TaskPriority, TaskStatus } from '../utils/taskTypes';

interface TaskEditorProps {
  notes: { id: string; title: string }[];
  initialTask?: Task;
  onSubmit: (payload: TaskInput) => void;
  onCancel: () => void;
}

const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
];

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' }
];

export function TaskEditor({ notes, initialTask, onSubmit, onCancel }: TaskEditorProps) {
  const defaultValues: TaskSchema = {
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    status: 'pending',
    noteId: null,
    recurrence: null,
    reminders: []
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialTask
      ? {
          ...defaultValues,
          ...initialTask,
          dueDate: initialTask.dueDate ?? null,
          recurrence: initialTask.recurrence ?? null,
          reminders: initialTask.reminders ?? []
        }
      : defaultValues
  });

  const selectedRecurrence = watch('recurrence');
  const reminders = watch('reminders');

  useEffect(() => {
    if (initialTask) {
      reset({
        ...defaultValues,
        ...initialTask,
        dueDate: initialTask.dueDate ?? null,
        recurrence: initialTask.recurrence ?? null,
        reminders: initialTask.reminders ?? []
      });
    }
  }, [initialTask, reset]);

  const submitHandler = (values: TaskSchema) => {
    onSubmit({
      ...values,
      description: values.description?.trim() ? values.description : undefined,
      dueDate: values.dueDate ?? undefined,
      noteId: values.noteId ?? undefined,
      recurrence: values.recurrence ?? undefined,
      reminders: values.reminders && values.reminders.length > 0 ? values.reminders : undefined
    });
    reset(defaultValues);
  };

  const toggleRecurrence = (pattern: 'daily' | 'weekly' | 'monthly') => {
    if (selectedRecurrence?.pattern === pattern) {
      setValue('recurrence', null, { shouldValidate: true });
      return;
    }
    setValue('recurrence', { pattern, interval: 1 }, { shouldValidate: true });
  };

  const addReminder = () => {
    const next = [...(reminders ?? [])];
    if (next.length >= 3) {
      return;
    }
    next.push({ minutesBefore: 60 });
    setValue('reminders', next, { shouldValidate: true });
  };

  const updateReminder = (index: number, minutesBefore: number) => {
    const next = [...(reminders ?? [])];
    next[index] = { minutesBefore };
    setValue('reminders', next, { shouldValidate: true });
  };

  const removeReminder = (index: number) => {
    const next = [...(reminders ?? [])];
    next.splice(index, 1);
    setValue('reminders', next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="mt-4 space-y-4" noValidate>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {errors.description ? <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
            Due date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            {...register('dueDate', {
              setValueAs: (value) => (value ? value : null)
            })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.dueDate ? <p className="mt-1 text-xs text-rose-600">{errors.dueDate.message}</p> : null}
        </div>
        <div>
          <label htmlFor="noteId" className="block text-sm font-medium text-slate-700">
            Link to note
          </label>
         <select
            id="noteId"
            {...register('noteId', {
              setValueAs: (value) => (value ? value : null)
            })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">No link</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
          {errors.noteId ? <p className="mt-1 text-xs text-rose-600">{errors.noteId.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Priority</legend>
          <div className="mt-2 flex gap-2">
            {priorityOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="radio" value={option.value} {...register('priority')} /> {option.label}
              </label>
            ))}
          </div>
          {errors.priority ? <p className="mt-1 text-xs text-rose-600">{errors.priority.message}</p> : null}
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Status</legend>
          <div className="mt-2 flex gap-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="radio" value={option.value} {...register('status')} /> {option.label}
              </label>
            ))}
          </div>
          {errors.status ? <p className="mt-1 text-xs text-rose-600">{errors.status.message}</p> : null}
        </fieldset>
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700">Recurrence</span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(
            [
              { label: 'Daily', value: 'daily' as const },
              { label: 'Weekly', value: 'weekly' as const },
              { label: 'Monthly', value: 'monthly' as const }
            ]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedRecurrence?.pattern === option.value
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => toggleRecurrence(option.value)}
            >
              {option.label}
            </button>
          ))}
          {selectedRecurrence ? (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Every
              <input
                type="number"
                min={1}
                max={30}
                {...register('recurrence.interval', { valueAsNumber: true })}
                className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {selectedRecurrence.pattern === 'monthly' ? 'month(s)' : selectedRecurrence.pattern === 'weekly' ? 'week(s)' : 'day(s)'}
            </label>
          ) : null}
          {errors.recurrence ? <p className="w-full text-xs text-rose-600">Invalid recurrence</p> : null}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Reminders</span>
          <button
            type="button"
            onClick={addReminder}
            className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={(reminders ?? []).length >= 3}
          >
            Add reminder
          </button>
        </div>
        <ul className="mt-2 space-y-2">
          {(reminders ?? []).map((reminder, index) => (
            <li key={index} className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span>Notify</span>
                <input
                  type="number"
                  min={5}
                  max={7 * 24 * 60}
                  value={reminder.minutesBefore}
                  onChange={(event) => updateReminder(index, Number(event.target.value))}
                  className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span>minutes before</span>
              </label>
              <button
                type="button"
                onClick={() => removeReminder(index)}
                className="text-xs font-medium text-rose-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {errors.reminders ? <p className="mt-1 text-xs text-rose-600">{errors.reminders.message as string}</p> : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            reset(defaultValues);
            onCancel();
          }}
          className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {initialTask ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
