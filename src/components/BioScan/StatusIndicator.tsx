import { Circle } from "lucide-react";

interface StatusIndicatorProps {
  status: "ready" | "scanning" | "complete";
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    ready: {
      text: "SYSTEM READY",
      color: "text-success",
      glow: "animate-pulse-glow",
    },
    scanning: {
      text: "ANALYZING...",
      color: "text-warning",
      glow: "animate-pulse-glow",
    },
    complete: {
      text: "ANALYSIS COMPLETE",
      color: "text-primary",
      glow: "",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <Circle
        className={`w-2 h-2 fill-current ${config.color} ${config.glow}`}
      />
      <span className={`font-mono text-xs tracking-widest ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default StatusIndicator;
