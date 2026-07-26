import { AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import ConfidenceBar from "./ConfidenceBar";
import { cn } from "@/lib/utils";

interface DiagnosisResult {
  disease: string;
  isHealthy: boolean;
  confidence: {
    angularLeafSpot: number;
    beanRust: number;
    healthy: number;
  };
}

interface DiagnosisCardProps {
  result: DiagnosisResult | null;
  isAnalyzing: boolean;
}

const DiagnosisCard = ({ result, isAnalyzing }: DiagnosisCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Diagnosis Results
        </h2>
      </div>

      {/* Main Diagnosis */}
      <div className="text-center py-6">
        {isAnalyzing ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2 mx-auto" />
          </div>
        ) : result ? (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              {result.isHealthy ? (
                <CheckCircle2 className="w-8 h-8 text-success" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-destructive" />
              )}
            </div>
            <h3
              className={cn(
                "text-2xl md:text-3xl font-bold tracking-wider font-mono",
                result.isHealthy
                  ? "text-success text-glow-green"
                  : "text-destructive text-glow-red"
              )}
            >
              {result.disease}
            </h3>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              {result.isHealthy ? "No Disease Detected" : "Disease Detected"}
            </p>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <p className="font-mono text-sm tracking-widest">AWAITING SAMPLE</p>
            <p className="text-xs mt-2 opacity-60">
              Upload an image to begin analysis
            </p>
          </div>
        )}
      </div>

      {/* Confidence Bars */}
      <div className="space-y-4">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase border-b border-border pb-2">
          Confidence Analysis
        </h4>
        {result ? (
          <div className="space-y-4 animate-fade-in">
            <ConfidenceBar
              label="Angular Leaf Spot"
              value={result.confidence.angularLeafSpot}
              variant={result.confidence.angularLeafSpot > 50 ? "danger" : "warning"}
            />
            <ConfidenceBar
              label="Bean Rust"
              value={result.confidence.beanRust}
              variant={result.confidence.beanRust > 50 ? "danger" : "warning"}
            />
            <ConfidenceBar
              label="Healthy"
              value={result.confidence.healthy}
              variant="healthy"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <ConfidenceBar label="Angular Leaf Spot" value={0} variant="warning" animated={false} />
            <ConfidenceBar label="Bean Rust" value={0} variant="warning" animated={false} />
            <ConfidenceBar label="Healthy" value={0} variant="healthy" animated={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisCard;
