import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Languages } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("en");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl primary-gradient shadow-lg">
              <Languages className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            VoiceTranz
          </h1>
          <p className="text-muted-foreground">Break language barriers in real-time</p>
        </div>

        {/* Login Form */}
        <div className="card-gradient rounded-2xl shadow-card border border-border/50 p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-base"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base transition-smooth">
              Login
            </Button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm text-primary hover:underline transition-base">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Language Selector */}
        <div className="w-full">
          <LanguageSelector value={language} onChange={setLanguage} label="Preferred Language" />
        </div>
      </div>
    </div>
  );
};

export default Login;
