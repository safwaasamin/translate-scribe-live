import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";

interface ChatBubbleProps {
  text: string;
  isOriginal: boolean;
  language: string;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
}

export const ChatBubble = ({ text, isOriginal, language, onPlayAudio, isPlaying }: ChatBubbleProps) => {
  return (
    <div className={cn("flex w-full", isOriginal ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-card transition-smooth",
          isOriginal
            ? "bg-muted text-foreground"
            : "primary-gradient text-primary-foreground"
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="text-xs opacity-70 font-medium">{language}</div>
          {onPlayAudio && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-background/10"
              onClick={onPlayAudio}
            >
              <Volume2 className={cn("h-3 w-3", isPlaying && "animate-pulse")} />
            </Button>
          )}
        </div>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};
