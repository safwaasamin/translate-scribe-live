import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeftRight, Mic, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: number;
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
        
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll show a placeholder message
        toast.info("Voice input received! (Speech-to-text integration coming soon)");
        
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

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

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
                  />
                  <ChatBubble
                    text={message.translated}
                    isOriginal={false}
                    language={message.targetLang}
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
