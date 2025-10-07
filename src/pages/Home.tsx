import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Languages, MessageSquare, Skull, Globe, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Real-Time Translation",
      description: "Instant text and voice translation across 100+ languages"
    },
    {
      icon: Skull,
      title: "AI Chatbot",
      description: "Chat with Captain Blackbeard in pirate speak"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Auto-detect and translate seamlessly"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Powered by advanced AI models for instant results"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl primary-gradient shadow-lg">
              <Languages className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              VoiceTranz
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Break language barriers in real-time
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience seamless translation with voice recognition, auto language detection, 
              and AI-powered conversation tools.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="h-12 text-base transition-smooth"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 text-base transition-smooth"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-gradient rounded-2xl shadow-card border border-border/50 p-6 text-center space-y-3 transition-smooth hover:shadow-lg"
              >
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 VoiceTranz. Breaking language barriers worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
