import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface StrategySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  const strategies = [
    {
      value: 'smart_balance',
      label: 'Smart Balance',
      description: 'Balances urgency, importance, effort, and dependencies',
    },
    {
      value: 'fastest_wins',
      label: 'Fastest Wins',
      description: 'Prioritizes low-effort tasks for quick completions',
    },
    {
      value: 'high_impact',
      label: 'High Impact',
      description: 'Focuses on importance and blocking dependencies',
    },
    {
      value: 'deadline_driven',
      label: 'Deadline Driven',
      description: 'Prioritizes tasks by due date urgency',
    },
  ];

  const selectedStrategy = strategies.find(s => s.value === value);

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        <div>
          <Label htmlFor="strategy">Prioritization Strategy</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id="strategy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStrategy && (
          <p className="text-sm text-muted-foreground">
            {selectedStrategy.description}
          </p>
        )}
      </div>
    </Card>
  );
}
