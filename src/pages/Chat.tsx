import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeftRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      original: "Hello, how can I help you?",
      translated: "Hola, ¿cómo puedo ayudarte?",
      sourceLang: "English",
      targetLang: "Spanish",
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      original: inputText,
      translated: `[Translation of: ${inputText}]`,
      sourceLang: sourceLang.toUpperCase(),
      targetLang: targetLang.toUpperCase(),
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showBack showLanguage />

      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b-0">
              <TabsTrigger value="call" onClick={() => navigate("/live-call")} className="rounded-none">
                Start Call
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Chat
              </TabsTrigger>
              <TabsTrigger value="history" onClick={() => navigate("/history")} className="rounded-none">
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

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
              <Input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 transition-base"
              />
              <Button onClick={handleSend} size="icon" className="transition-smooth">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
