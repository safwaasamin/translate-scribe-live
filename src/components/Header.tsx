import { ArrowLeft, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  showBack?: boolean;
  showLanguage?: boolean;
}

export const Header = ({ showBack = false, showLanguage = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="transition-smooth hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Languages className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              VoiceTranz
            </span>
          </div>
        </div>

        {showLanguage && (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="transition-smooth">
              <Languages className="mr-2 h-4 w-4" />
              EN
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-medium text-sm">
              U
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
