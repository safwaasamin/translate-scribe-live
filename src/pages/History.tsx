import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: number;
  date: string;
  time: string;
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
}

const History = () => {
  const navigate = useNavigate();
  const historyItems: HistoryItem[] = [
    {
      id: 1,
      date: "2025-10-05",
      time: "10:30 AM",
      original: "Hello, how are you today?",
      translated: "Hola, ¿cómo estás hoy?",
      sourceLang: "EN",
      targetLang: "ES",
    },
    {
      id: 2,
      date: "2025-10-04",
      time: "3:45 PM",
      original: "Thank you for your help",
      translated: "Gracias por tu ayuda",
      sourceLang: "EN",
      targetLang: "ES",
    },
    {
      id: 3,
      date: "2025-10-04",
      time: "11:20 AM",
      original: "Where is the nearest restaurant?",
      translated: "¿Dónde está el restaurante más cercano?",
      sourceLang: "EN",
      targetLang: "ES",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showLanguage />

      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b-0">
              <TabsTrigger value="call" onClick={() => navigate("/live-call")} className="rounded-none">
                Start Call
              </TabsTrigger>
              <TabsTrigger value="chat" onClick={() => navigate("/chat")} className="rounded-none">
                Chat
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Translation History</h1>
            <p className="text-muted-foreground">View and replay your past translations</p>
          </div>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="card-gradient shadow-card p-6 transition-smooth hover:shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                        {item.sourceLang} → {item.targetLang}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.date} at {item.time}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="transition-smooth hover:scale-105">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="transition-smooth hover:scale-105 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Original</div>
                      <p className="text-sm text-foreground">{item.original}</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="text-xs text-muted-foreground mb-2">Translation</div>
                      <p className="text-sm text-foreground">{item.translated}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
