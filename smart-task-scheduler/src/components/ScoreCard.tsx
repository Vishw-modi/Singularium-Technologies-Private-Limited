import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, AlertCircle } from 'lucide-react';

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

interface ScoreCardProps {
  task: Task;
  rank?: number;
}

export function ScoreCard({ task, rank }: ScoreCardProps) {
  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-success text-success-foreground',
  };

  const priorityColor = task.priority_level ? priorityColors[task.priority_level] : 'bg-muted';

  // Check if task is overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.due_date);
  dueDate.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today;

  return (
    <Card className="p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start gap-4">
        {rank && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
            {rank}
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-card-foreground">{task.title}</h3>
            {task.score !== undefined && (
              <Badge variant="outline" className="shrink-0 text-base font-bold">
                Score: {task.score}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className={`h-4 w-4 ${isOverdue ? 'text-destructive' : ''}`} />
              <span className={isOverdue ? 'text-destructive font-semibold' : ''}>
                {isOverdue ? '⚠️ ' : ''}
                {task.due_date}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{task.estimated_hours}h</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              <span>Importance: {task.importance}/10</span>
            </div>

            {task.dependencies && task.dependencies.length > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                <span>{task.dependencies.length} dependencies</span>
              </div>
            )}
          </div>

          {task.explanation && (
            <p className="text-sm text-muted-foreground rounded-md bg-muted/50 p-3">
              {task.explanation}
            </p>
          )}

          {task.priority_level && (
            <Badge className={priorityColor}>
              {task.priority_level.toUpperCase()} PRIORITY
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
