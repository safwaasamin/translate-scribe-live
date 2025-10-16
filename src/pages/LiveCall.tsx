import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Phone, PhoneOff, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptItem {
  id: number;
  original: string;
  translated: string;
  timestamp: Date;
}

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const LiveCall = () => {
  const { loading, user } = useAuth();
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string>("");
  
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create conversation when call starts
  useEffect(() => {
    const createConversation = async () => {
      if (!isCallActive || !user || conversationId) return;
      
      const { data, error } = await supabase
        .from('conversation_history')
        .insert({
          user_id: user.id,
          type: 'live_call',
          title: `${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()} Live Call`
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
      } else {
        setConversationId(data.id);
      }
    };

    createConversation();
  }, [isCallActive, user, sourceLang, targetLang]);

  const saveTranslation = async (original: string, translated: string) => {
    if (!conversationId || !user) return;

    await supabase.from('conversation_messages').insert({
      conversation_id: conversationId,
      original_text: original,
      translated_text: translated,
      source_lang: sourceLang,
      target_lang: targetLang
    });
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const translateAndSpeak = async (text: string) => {
    if (isProcessing || !text.trim()) return;
    
    setIsProcessing(true);

    try {
      // Translate the text
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
      const newTranscript = {
        id: Date.now(),
        original: text,
        translated: translatedText,
        timestamp: new Date(),
      };
      setTranscripts(prev => [...prev, newTranscript]);

      // Save to database
      await saveTranslation(text, translatedText);

      // Speak the translated text using Web Speech API
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);

      setIsProcessing(false);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed");
      setIsProcessing(false);
    }
  };

  const startCall = async () => {
    try {
      // Check if browser supports Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition() as SpeechRecognitionInterface;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = sourceLang;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          console.log("Recognized:", transcript);
          translateAndSpeak(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
        if (event.error === 'no-speech') {
          // Ignore no-speech errors as they're common during pauses
          return;
        }
        toast.error(`Recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        // Restart recognition if call is still active
        if (isCallActive && recognitionRef.current) {
          try {
            recognition.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsCallActive(true);
      toast.success("Live call started - speak now!");
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Unable to start speech recognition");
    }
  };

  const endCall = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    window.speechSynthesis.cancel();
    setIsCallActive(false);
    setConversationId(null); // Reset for next call
    toast.info("Call ended");
  };

  useEffect(() => {
    // Update recognition language when source language changes
    if (recognitionRef.current && isCallActive) {
      recognitionRef.current.lang = sourceLang;
    }
  }, [sourceLang]);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    setIsTranscribing(true);
    setAudioTranscript("");

    try {
      // Convert audio file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        // Call speech-to-text edge function
        const { data, error } = await supabase.functions.invoke('speech-to-text', {
          body: { audio: base64Data }
        });

        if (error) throw error;

        if (data?.text) {
          setAudioTranscript(data.text);
          toast.success('Audio transcribed successfully');
        }
      };

      reader.onerror = () => {
        throw new Error('Failed to read audio file');
      };
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
          <Tabs defaultValue="live-call" className="flex-1 flex flex-col gap-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="live-call">Live Call</TabsTrigger>
              <TabsTrigger value="audio-upload">Audio Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="live-call" className="flex-1 flex flex-col gap-6 m-0">
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
              <Card className="flex-1 card-gradient shadow-card p-6 overflow-hidden">
                <h3 className="text-lg font-semibold mb-4">Live Transcription</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-4 pr-4">
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
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="audio-upload" className="flex-1 flex flex-col gap-6 m-0">
              {/* Audio Upload Section */}
              <Card className="card-gradient shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Upload Audio File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload an audio file to transcribe</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="audio-upload"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isTranscribing}
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Audio File
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Transcription Result */}
                  {audioTranscript && (
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Transcription</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <p className="text-foreground whitespace-pre-wrap">{audioTranscript}</p>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LiveCall;
