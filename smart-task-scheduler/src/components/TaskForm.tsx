import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
}

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  onBulkImport: (tasks: Task[]) => void;
}

export function TaskForm({ onAddTask, onBulkImport }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [importance, setImportance] = useState('5');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkJson, setBulkJson] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dueDate || !estimatedHours) {
      toast.error('Please fill in all required fields');
      return;
    }

    const task: Task = {
      title,
      due_date: dueDate,
      estimated_hours: parseInt(estimatedHours),
      importance: parseInt(importance),
      dependencies: [],
    };

    onAddTask(task);

    // Reset form
    setTitle('');
    setDueDate('');
    setEstimatedHours('');
    setImportance('5');
    
    toast.success('Task added successfully!');
  };

  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const tasks = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate each task
      const validTasks = tasks.filter(task => {
        return task.title && task.due_date && task.estimated_hours && task.importance;
      });

      if (validTasks.length === 0) {
        toast.error('No valid tasks found in JSON');
        return;
      }

      onBulkImport(validTasks);
      setBulkJson('');
      setShowBulkInput(false);
      
      toast.success(`${validTasks.length} task(s) imported successfully!`);
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Add New Task</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBulkInput(!showBulkInput)}
          className="gap-2"
        >
          <FileJson className="h-4 w-4" />
          Bulk Import
        </Button>
      </div>

      {showBulkInput ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="bulk-json">Paste JSON Array</Label>
            <Textarea
              id="bulk-json"
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='[{"title": "Task 1", "due_date": "2025-12-31", "estimated_hours": 5, "importance": 8, "dependencies": []}]'
              rows={6}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBulkImport} className="flex-1">
              Import Tasks
            </Button>
            <Button variant="outline" onClick={() => setShowBulkInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <Label htmlFor="due-date">Due Date *</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="hours">Estimated Hours *</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g., 5"
                required
              />
            </div>

            <div>
              <Label htmlFor="importance">Importance (1-10) *</Label>
              <Input
                id="importance"
                type="number"
                min="1"
                max="10"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </form>
      )}
    </Card>
  );
}
