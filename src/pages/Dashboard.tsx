import { Header } from "@/components/Header";
import { DashboardCard } from "@/components/DashboardCard";
import { MessageSquare, History, Settings, Skull } from "lucide-react";

const Dashboard = () => {
  const cards = [
    {
      title: "Chat Translator",
      icon: MessageSquare,
      path: "/chat",
      description: "Text & voice translation",
    },
    {
      title: "Pirate Chat",
      icon: Skull,
      path: "/pirate-chat",
      description: "Chat with Captain Blackbeard",
    },
    {
      title: "History",
      icon: History,
      path: "/history",
      description: "View past translations",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      description: "Customize preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showLanguage />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-lg">
              Choose a feature to get started with real-time translation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {cards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
