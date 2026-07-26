import { useState, useRef } from "react";
import { Upload, Camera, Dna } from "lucide-react";
import StatusIndicator from "./StatusIndicator";
import ImagePreview from "./ImagePreview";
import GlowButton from "./GlowButton";
import DiagnosisCard from "./DiagnosisCard";
import MedicalAdviceCard from "./MedicalAdviceCard";
import CameraModal from "./CameraModal";
import { usePredictDisease } from "@/hooks/usePredictDisease";
import type { PredictionResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const BioScanDashboard = () => {
  const [status, setStatus] = useState<"ready" | "scanning" | "complete">("ready");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [medicalAdvice, setMedicalAdvice] = useState<any>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const predictMutation = usePredictDisease();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please select an image file (JPG, PNG, WEBP)',
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Please select an image smaller than 10MB',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start analysis
    setStatus("scanning");
    setDiagnosisResult(null);
    setMedicalAdvice(null);

    try {
      const result = await predictMutation.mutateAsync(file);

      // Transform API result to UI format
      const transformedResult = {
        disease: result.class_name.toUpperCase(),
        isHealthy: result.class_key === 'healthy',
        confidence: {
          angularLeafSpot: Math.round(result.probabilities.angular_leaf_spot * 100),
          beanRust: Math.round(result.probabilities.bean_rust * 100),
          healthy: Math.round(result.probabilities.healthy * 100),
        },
      };

      const advice = {
        symptoms: result.symptoms,
        treatment: result.cure,
      };

      setStatus("complete");
      setDiagnosisResult(transformedResult);
      setMedicalAdvice(advice);

      toast({
        title: 'Analysis Complete',
        description: `Detected: ${result.class_name}`,
      });
    } catch (error) {
      setStatus("ready");
      setImageUrl(null);
      console.error('Prediction error:', error);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCamera = () => {
    setShowCameraModal(true);
  };

  const handleCameraCapture = async (file: File) => {
    await handleFileSelect(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-card rounded-lg border border-primary/30 glow-cyan">
              <Dna className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-wider">
                <span className="text-primary text-glow-cyan">BIO</span>
                <span className="text-foreground"> SCAN</span>
                <span className="text-muted-foreground font-light"> | </span>
                <span className="text-muted-foreground text-lg md:text-xl font-light">
                  AI DIAGNOSTICS
                </span>
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest mt-1">
                ADVANCED PLANT PATHOLOGY ANALYSIS SYSTEM
              </p>
            </div>
          </div>
          <StatusIndicator status={status} />
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input Zone */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Image Input Module
                </h2>
              </div>

              <ImagePreview imageUrl={imageUrl} isLoading={predictMutation.isPending} />

              <div className="grid grid-cols-2 gap-4">
                <GlowButton
                  variant="primary"
                  onClick={handleUpload}
                  disabled={predictMutation.isPending}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload File</span>
                </GlowButton>

                <GlowButton
                  variant="secondary"
                  onClick={handleCamera}
                  disabled={predictMutation.isPending}
                >
                  <Camera className="w-5 h-5" />
                  <span>Open Camera</span>
                </GlowButton>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Supported formats: JPG, PNG, WEBP • Max size: 10MB
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          </div>

          {/* Right Column - Analysis Data */}
          <div className="space-y-6">
            <DiagnosisCard
              result={diagnosisResult}
              isAnalyzing={status === "scanning"}
            />
            <MedicalAdviceCard
              advice={medicalAdvice}
              isAnalyzing={status === "scanning"}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground tracking-widest">
            BIO SCAN v2.4.1 • NEURAL NETWORK ACTIVE • ACCURACY: 81.2%
          </p>
        </footer>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
};

export default BioScanDashboard;
