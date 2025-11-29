import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { StrategySelector } from "@/components/StrategySelector";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface Task {
  id?: string;
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
  score?: number;
  explanation?: string;
  priority_level?: "high" | "medium" | "low";
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analyzedTasks, setAnalyzedTasks] = useState<Task[]>([]);
  const [strategy, setStrategy] = useState("smart_balance");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Task[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleAddTask = async (task: Task) => {
    // Add task to database
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
      return;
    }

    setTasks((prev) => [...prev, { ...task, id: data.id }]);
  };

  const handleBulkImport = async (newTasks: Task[]) => {
    // Add tasks to database
    const { data, error } = await supabase
      .from("tasks")
      .insert(newTasks)
      .select();

    if (error) {
      console.error("Error importing tasks:", error);
      toast.error("Failed to import tasks");
      return;
    }

    setTasks((prev) => [...prev, ...data]);
  };

  const handleAnalyzeTasks = async () => {
    if (tasks.length === 0) {
      toast.error("Please add some tasks first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/analyze-tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, strategy }),
      });

      if (!res.ok) throw new Error("Failed to analyze");

      const data = await res.json();
      setAnalyzedTasks(data.tasks);

      toast.success(`Analyzed ${data.tasks.length} tasks successfully!`);
    } catch (error) {
      console.error("Error analyzing tasks:", error);
      toast.error("Failed to analyze tasks");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/suggest-tasks/");

      if (!res.ok) throw new Error("Failed to get suggestions");

      const data = await res.json();

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        toast.success(`Got ${data.suggestions.length} task suggestions!`);
      } else {
        toast.info(data.message || "No suggestions available");
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast.error("Failed to get suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold text-transparent">
            Smart Task Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Intelligent task prioritization using advanced scoring algorithms
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="space-y-6 lg:col-span-1">
            <TaskForm
              onAddTask={handleAddTask}
              onBulkImport={handleBulkImport}
            />

            <StrategySelector value={strategy} onChange={setStrategy} />

            <div className="space-y-3">
              <Button
                onClick={handleAnalyzeTasks}
                disabled={isAnalyzing || tasks.length === 0}
                className="w-full gap-2 py-6 text-base font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    Analyze Tasks ({tasks.length})
                  </>
                )}
              </Button>

              <Button
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions}
                variant="outline"
                className="w-full gap-2"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    Get Top 3 Suggestions
                  </>
                )}
              </Button>
            </div>

            {/* Stats Card */}
            {tasks.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-card-foreground">
                  Task Stats
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total Tasks:</span>
                    <span className="font-semibold text-foreground">
                      {tasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analyzed:</span>
                    <span className="font-semibold text-foreground">
                      {analyzedTasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <span className="font-semibold text-foreground">
                      {strategy
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:col-span-2">
            {suggestions.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Top Suggestions
                  </h2>
                </div>
                <TaskList tasks={suggestions} showRank />
              </div>
            )}

            {analyzedTasks.length > 0 ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Prioritized Tasks
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    (Sorted by Score)
                  </span>
                </h2>
                <TaskList tasks={analyzedTasks} showRank />
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Brain className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  No Analysis Yet
                </h3>
                <p className="text-muted-foreground">
                  Add tasks and click "Analyze Tasks" to see intelligent
                  prioritization
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
