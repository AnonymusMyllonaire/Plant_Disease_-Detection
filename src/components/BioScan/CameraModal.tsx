import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraModalProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

const CameraModal = ({ onCapture, onClose }: CameraModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setIsReady(true);
                };
            }
        } catch (error) {
            console.error('Camera error:', error);
            onClose();
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                stopCamera();
                onCapture(file);
                onClose();
            }
        }, 'image/jpeg', 0.95);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isReady) {
            captureImage();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isReady]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Camera preview */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto"
                    />

                    {/* Capture button */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex flex-col items-center gap-3">
                            <Button
                                onClick={captureImage}
                                disabled={!isReady}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold rounded-full shadow-lg"
                            >
                                📸 CAPTURE (Press Enter)
                            </Button>
                            <p className="text-white/60 text-sm font-mono">
                                Press ENTER to capture • ESC to cancel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default CameraModal;
