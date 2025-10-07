import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Languages, MessageSquare, Skull, Globe, Zap, Mic, Volume2, Brain, Users, Star, ArrowRight, Check } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Real-Time Translation",
      description: "Instant text and voice translation across 100+ languages"
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Speak naturally and get instant translations"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Advanced language models for accurate translations"
    },
    {
      icon: Globe,
      title: "100+ Languages",
      description: "Support for all major world languages"
    }
  ];

  const stats = [
    { number: "100+", label: "Languages" },
    { number: "1M+", label: "Translations" },
    { number: "50K+", label: "Users" },
    { number: "99.9%", label: "Accuracy" }
  ];

  const useCases = [
    {
      icon: Users,
      title: "Business Meetings",
      description: "Break language barriers in international conferences and business calls"
    },
    {
      icon: Globe,
      title: "Travel & Tourism",
      description: "Navigate foreign countries with ease and communicate effortlessly"
    },
    {
      icon: MessageSquare,
      title: "Education & Learning",
      description: "Learn new languages and access educational content worldwide"
    },
    {
      icon: Skull,
      title: "Entertainment",
      description: "Chat with AI characters and have fun while learning"
    }
  ];

  const benefits = [
    "Auto language detection",
    "Real-time voice translation",
    "Text-to-speech output",
    "Translation history",
    "Multiple AI models",
    "Secure & private"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl primary-gradient shadow-elegant hover-scale">
                <Languages className="h-14 w-14 text-primary-foreground" />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent leading-tight">
                VoiceTranz
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-foreground">
                Break Language Barriers in Real-Time
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience seamless translation with advanced AI-powered voice recognition, 
                auto language detection, and instant translation across 100+ languages. 
                Connect with the world like never before.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg transition-smooth group"
                onClick={() => navigate("/login")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg transition-smooth"
                onClick={() => navigate("/login")}
              >
                <Volume2 className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-scale-in">
            {stats.map((stat) => (
              <Card key={stat.label} className="card-gradient border border-border/50 p-6 text-center shadow-card hover-scale">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="card-gradient rounded-2xl shadow-card border border-border/50 p-6 text-center space-y-4 transition-smooth hover:shadow-lg hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4 shadow-sm">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-gradient-subtle py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Perfect For Every Scenario
              </h2>
              <p className="text-muted-foreground text-lg">
                From business to travel, we've got you covered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <Card
                  key={useCase.title}
                  className="card-gradient border border-border/50 p-8 space-y-4 transition-smooth hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 shadow-sm">
                      <useCase.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-xl text-foreground">{useCase.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="card-gradient border border-border/50 p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose VoiceTranz?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Join thousands of users who trust VoiceTranz for accurate, 
                  fast, and secure translations every day.
                </p>
                <Button 
                  size="lg" 
                  className="h-12 text-base transition-smooth"
                  onClick={() => navigate("/login")}
                >
                  Start Translating Now
                </Button>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="primary-gradient border-0 p-12 text-center shadow-elegant">
            <div className="space-y-6">
              <Star className="h-16 w-16 text-primary-foreground mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Connect with the World?
              </h2>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Start your journey with VoiceTranz today. No credit card required.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="h-14 px-8 text-lg transition-smooth"
                onClick={() => navigate("/login")}
              >
                Create Free Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Languages className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">VoiceTranz</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 VoiceTranz. Breaking language barriers worldwide.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-base">Privacy</a>
              <a href="#" className="hover:text-primary transition-base">Terms</a>
              <a href="#" className="hover:text-primary transition-base">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
