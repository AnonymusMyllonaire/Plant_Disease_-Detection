import { ImageIcon, Loader2 } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const ImagePreview = ({ imageUrl, isLoading }: ImagePreviewProps) => {
  return (
    <div className="relative aspect-[4/3] bg-background rounded-lg border border-border overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline z-10" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <span className="font-mono text-xs text-primary tracking-widest">
              PROCESSING IMAGE...
            </span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Plant sample"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="p-6 rounded-full bg-card border border-border">
              <ImageIcon className="w-12 h-12" />
            </div>
            <div className="text-center">
              <p className="font-mono text-xs tracking-widest">
                NO IMAGE LOADED
              </p>
              <p className="text-xs mt-1 opacity-60">
                Upload or capture a plant sample
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50" />
    </div>
  );
};

export default ImagePreview;
