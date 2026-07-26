import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const GlowButton = ({ variant, onClick, children, disabled }: GlowButtonProps) => {
  const baseStyles = "flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-300 border";
  
  const variants = {
    primary: "bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:glow-cyan disabled:opacity-50",
    secondary: "bg-secondary/10 border-secondary text-secondary hover:bg-secondary/20 hover:glow-purple disabled:opacity-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant])}
    >
      {children}
    </button>
  );
};

export default GlowButton;
