import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeftRight, Mic, Loader2, Volume2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: number;
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      original: "Hello, how can I help you?",
      translated: "Hola, ¿cómo puedo ayudarte?",
      sourceLang: "English",
      targetLang: "Spanish",
    },
  ]);

  const handleSend = async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text: inputText,
          sourceLang: sourceLang,
          targetLang: targetLang,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          toast.error("Credits required. Please add credits to continue.");
        } else {
          toast.error("Translation failed. Please try again.");
        }
        return;
      }

      const data = await response.json();
      
      const newMessage: Message = {
        id: messages.length + 1,
        original: inputText,
        translated: data.translatedText,
        sourceLang: sourceLang.toUpperCase(),
        targetLang: targetLang.toUpperCase(),
      };
      
      setMessages([...messages, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        
        try {
          // Convert audio blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            toast.info("Transcribing audio...");
            
            // Send to speech-to-text edge function
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/speech-to-text`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({ audio: base64Audio }),
            });

            if (!response.ok) {
              toast.error("Failed to transcribe audio. Please try again.");
              return;
            }

            const data = await response.json();
            setInputText(data.text);
            toast.success("Audio transcribed successfully!");
          };
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Failed to process audio. Please try again.");
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.success("Recording... Tap again to stop");
    } catch (error) {
      console.error("Microphone access error:", error);
      toast.error("Unable to access microphone. Please check permissions.");
    }
  };

  const handlePlayAudio = async (text: string, messageId: number) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingAudioId(null);
    }

    // If clicking the same message, just stop
    if (playingAudioId === messageId) {
      return;
    }

    try {
      setPlayingAudioId(messageId);
      toast.info("Generating audio...");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        toast.error("Failed to generate audio. Please try again.");
        setPlayingAudioId(null);
        return;
      }

      const data = await response.json();
      
      // Create audio element and play
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingAudioId(null);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        toast.error("Failed to play audio.");
        setPlayingAudioId(null);
        audioRef.current = null;
      };

      await audio.play();
      toast.success("Playing audio...");
    } catch (error) {
      console.error("Audio playback error:", error);
      toast.error("Failed to play audio. Please try again.");
      setPlayingAudioId(null);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

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
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
              </div>
              <LanguageSelector value={targetLang} onChange={setTargetLang} />
            </div>
          </Card>

          {/* Chat Messages */}
          <Card className="flex-1 card-gradient shadow-card p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <ChatBubble
                    text={message.original}
                    isOriginal={true}
                    language={message.sourceLang}
                    onPlayAudio={() => handlePlayAudio(message.original, message.id * 2)}
                    isPlaying={playingAudioId === message.id * 2}
                  />
                  <ChatBubble
                    text={message.translated}
                    isOriginal={false}
                    language={message.targetLang}
                    onPlayAudio={() => handlePlayAudio(message.translated, message.id * 2 + 1)}
                    isPlaying={playingAudioId === message.id * 2 + 1}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Input */}
          <Card className="card-gradient shadow-card p-4">
            <div className="flex gap-2">
              <Button
                onClick={handleVoiceInput}
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                className="transition-smooth"
                disabled={isTranslating}
              >
                <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isTranslating && handleSend()}
                disabled={isTranslating}
                className="flex-1 transition-base"
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isTranslating || !inputText.trim()}
                className="transition-smooth"
              >
                {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
