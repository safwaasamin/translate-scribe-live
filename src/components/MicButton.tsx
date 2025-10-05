import { Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isRecording: boolean;
  onToggle: () => void;
}

export const MicButton = ({ isRecording, onToggle }: MicButtonProps) => {
  return (
    <Button
      onClick={onToggle}
      size="lg"
      className={cn(
        "h-16 w-16 rounded-full transition-smooth shadow-lg",
        isRecording
          ? "bg-destructive hover:bg-destructive/90 animate-pulse"
          : "bg-primary hover:bg-primary/90"
      )}
    >
      {isRecording ? (
        <MicOff className="h-6 w-6 text-primary-foreground" />
      ) : (
        <Mic className="h-6 w-6 text-primary-foreground" />
      )}
    </Button>
  );
};
