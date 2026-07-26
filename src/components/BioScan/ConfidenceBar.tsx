import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  label: string;
  value: number;
  variant: "healthy" | "warning" | "danger";
  animated?: boolean;
}

const ConfidenceBar = ({ label, value, variant, animated = true }: ConfidenceBarProps) => {
  const barColors = {
    healthy: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  const glowColors = {
    healthy: "glow-green",
    warning: "",
    danger: "glow-red",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="font-mono text-foreground text-sm">
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            barColors[variant],
            animated && value > 50 && glowColors[variant]
          )}
          style={{ width: animated ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
