import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  isOriginal: boolean;
  language: string;
}

export const ChatBubble = ({ text, isOriginal, language }: ChatBubbleProps) => {
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
        <div className="text-xs opacity-70 mb-1 font-medium">{language}</div>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};
