import { ScoreCard } from './ScoreCard';

interface Task {
  id?: string;
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
  score?: number;
  explanation?: string;
  priority_level?: 'high' | 'medium' | 'low';
}

interface TaskListProps {
  tasks: Task[];
  showRank?: boolean;
}

export function TaskList({ tasks, showRank = false }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
        <p className="text-lg text-muted-foreground">
          No tasks to display. Add some tasks to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <ScoreCard
          key={task.id || index}
          task={task}
          rank={showRank ? index + 1 : undefined}
        />
      ))}
    </div>
  );
}
