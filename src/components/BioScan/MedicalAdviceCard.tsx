import { FileText, AlertCircle, Pill } from "lucide-react";

interface MedicalAdvice {
  symptoms: string;
  treatment: string;
}

interface MedicalAdviceCardProps {
  advice: MedicalAdvice | null;
  isAnalyzing: boolean;
}

const MedicalAdviceCard = ({ advice, isAnalyzing }: MedicalAdviceCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Actionable Intelligence
        </h2>
      </div>

      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
      ) : advice ? (
        <div className="space-y-4 animate-fade-in">
          {/* Symptoms */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <h4 className="font-mono text-xs tracking-widest text-destructive uppercase">
                Symptoms
              </h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pl-6">
              {advice.symptoms}
            </p>
          </div>

          {/* Treatment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-success" />
              <h4 className="font-mono text-xs tracking-widest text-success uppercase">
                Recommended Treatment
              </h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pl-6">
              {advice.treatment}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p className="font-mono text-xs tracking-widest">NO DATA AVAILABLE</p>
          <p className="text-xs mt-2 opacity-60">
            Medical advice will appear after analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalAdviceCard;
