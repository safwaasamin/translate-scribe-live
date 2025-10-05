import { useState } from "react";
import { Header } from "@/components/Header";
import { MicButton } from "@/components/MicButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Volume2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const LiveCall = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [originalText, setOriginalText] = useState("Hello, how are you today?");
  const [translatedText, setTranslatedText] = useState("Hola, ¿cómo estás hoy?");

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showLanguage />

      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="call" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b-0">
              <TabsTrigger value="call" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Start Call
              </TabsTrigger>
              <TabsTrigger value="chat" onClick={() => navigate("/chat")} className="rounded-none">
                Chat
              </TabsTrigger>
              <TabsTrigger value="history" onClick={() => navigate("/history")} className="rounded-none">
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Language Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              label="Source Language"
            />
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
            </div>
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              label="Target Language"
            />
          </div>

          {/* Translation Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-gradient shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Original</h3>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {sourceLang.toUpperCase()}
                </span>
              </div>
              <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground leading-relaxed">{originalText}</p>
              </div>
            </Card>

            <Card className="card-gradient shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Translation</h3>
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
                  {targetLang.toUpperCase()}
                </span>
              </div>
              <div className="min-h-[200px] p-4 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-foreground leading-relaxed">{translatedText}</p>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-4">
              <MicButton isRecording={isRecording} onToggle={() => setIsRecording(!isRecording)} />
              <Button
                variant="outline"
                size="lg"
                className="h-16 w-16 rounded-full transition-smooth shadow-md"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveCall;
