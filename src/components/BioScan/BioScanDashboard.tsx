import { useState, useRef } from "react";
import { Upload, Camera, Dna, Lock, LogOut, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const predictMutation = usePredictDisease();

  const checkPaymentAccess = (): boolean => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI plant disease scanner.",
      });
      navigate("/login");
      return false;
    }

    if (!user.isPaid) {
      toast({
        variant: "destructive",
        title: "Pro Access Required",
        description: "Please upgrade via Polar.sh to perform AI plant disease diagnostics.",
      });
      navigate("/pricing");
      return false;
    }

    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!checkPaymentAccess()) return;

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
    if (!checkPaymentAccess()) return;
    fileInputRef.current?.click();
  };

  const handleCamera = () => {
    if (!checkPaymentAccess()) return;
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
          <div className="flex items-center gap-4">
            <StatusIndicator status={status} />
            {user ? (
              <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border">
                <div className="text-right text-xs">
                  <p className="font-bold text-foreground">{user.name}</p>
                  <p className="text-muted-foreground">{user.isPaid ? 'PRO SUBSCRIBER' : 'FREE PLAN'}</p>
                </div>
                {!user.isPaid && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-all flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5" /> Upgrade
                  </button>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {!user?.isPaid && (
          <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-200">Payment Required for AI Predictions</h4>
                <p className="text-xs text-slate-400">Subscribe via Polar.sh ($9.99/mo) to upload plant images and scan with camera.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              Unlock Pro via Polar.sh
            </button>
          </div>
        )}

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
