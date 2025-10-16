import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { DashboardCard } from "@/components/DashboardCard";
import { MessageSquare, History, Settings, Skull, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  const cards = [
    {
      title: "Chat Translator",
      icon: MessageSquare,
      path: "/chat",
      description: "Text & voice translation",
    },
    {
      title: "Live Translation",
      icon: Phone,
      path: "/live-call",
      description: "Real-time voice translation",
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
