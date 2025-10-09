import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftRight, Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface TranscriptItem {
  id: number;
  original: string;
  translated: string;
  timestamp: Date;
}

const LiveCall = () => {
  const { loading } = useAuth();
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const processAudioChunk = async () => {
    if (audioChunksRef.current.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Transcribe
        const transcribeResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/speech-to-text`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ audio: base64Audio }),
          }
        );

        if (!transcribeResponse.ok) {
          console.error("Transcription failed");
          setIsProcessing(false);
          return;
        }

        const { text } = await transcribeResponse.json();
        
        if (!text || text.trim().length === 0) {
          setIsProcessing(false);
          return;
        }

        // Translate
        const translateResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-text`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              text,
              sourceLang,
              targetLang,
            }),
          }
        );

        if (!translateResponse.ok) {
          console.error("Translation failed");
          setIsProcessing(false);
          return;
        }

        const { translatedText } = await translateResponse.json();

        // Add to transcripts
        setTranscripts(prev => [
          ...prev,
          {
            id: Date.now(),
            original: text,
            translated: translatedText,
            timestamp: new Date(),
          },
        ]);

        // Play translated audio
        const ttsResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: translatedText }),
          }
        );

        if (ttsResponse.ok) {
          const { audioContent } = await ttsResponse.json();
          const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
          audio.play();
        }

        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Processing error:", error);
      setIsProcessing(false);
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsCallActive(true);
      toast.success("Live call started");

      // Process audio every 3 seconds
      processingTimeoutRef.current = setInterval(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 3000);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Unable to access microphone");
    }
  };

  const endCall = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processingTimeoutRef.current) {
      clearInterval(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    audioChunksRef.current = [];
    setIsCallActive(false);
    toast.info("Call ended");
  };

  useEffect(() => {
    // Process accumulated audio chunks periodically
    const interval = setInterval(() => {
      if (isCallActive && !isProcessing) {
        processAudioChunk();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isCallActive, isProcessing, sourceLang, targetLang]);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showBack showLanguage />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
          {/* Language Selectors */}
          <Card className="card-gradient shadow-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <LanguageSelector value={sourceLang} onChange={setSourceLang} />
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={swapLanguages}
                  className="transition-smooth hover:scale-110"
                  disabled={isCallActive}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
              </div>
              <LanguageSelector value={targetLang} onChange={setTargetLang} />
            </div>
          </Card>

          {/* Call Status */}
          <Card className="card-gradient shadow-card p-8">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-bold text-primary">
                {isCallActive ? "Call Active" : "Ready to Start"}
              </h2>
              
              <Button
                onClick={isCallActive ? endCall : startCall}
                size="lg"
                variant={isCallActive ? "destructive" : "default"}
                className="h-20 w-20 rounded-full transition-smooth shadow-lg"
              >
                {isCallActive ? (
                  <PhoneOff className="h-8 w-8" />
                ) : (
                  <Phone className="h-8 w-8" />
                )}
              </Button>

              {isCallActive && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Listening and translating...
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Live Transcripts */}
          <Card className="flex-1 card-gradient shadow-card p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Live Transcription</h3>
            <div className="space-y-4">
              {transcripts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Start a call to see live translations
                </p>
              ) : (
                transcripts.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                      <p className="font-medium">{item.original}</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-medium">{item.translated}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LiveCall;
