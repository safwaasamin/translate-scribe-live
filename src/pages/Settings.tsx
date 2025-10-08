import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, LogOut, Loader2 } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [defaultSource, setDefaultSource] = useState("en");
  const [defaultTarget, setDefaultTarget] = useState("es");
  const [voiceType, setVoiceType] = useState("female");
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [apiProvider, setApiProvider] = useState("google");
  const [autoDetect, setAutoDetect] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setEmail(session.user.email || "");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
        return;
      }

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setDefaultSource(profileData.preferred_source_lang || "en");
        setDefaultTarget(profileData.preferred_target_lang || "es");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          preferred_source_lang: defaultSource,
          preferred_target_lang: defaultTarget,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showLanguage />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Customize your translation preferences</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* User Profile */}
          <Card className="card-gradient shadow-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="card-gradient shadow-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Language Preferences</h2>
            
            <div className="space-y-4">
              <LanguageSelector
                value={defaultSource}
                onChange={setDefaultSource}
                label="Default Source Language"
              />
              
              <LanguageSelector
                value={defaultTarget}
                onChange={setDefaultTarget}
                label="Default Target Language"
              />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-detect Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically detect the source language
                  </p>
                </div>
                <Switch checked={autoDetect} onCheckedChange={setAutoDetect} />
              </div>
            </div>
          </Card>

          {/* Voice Settings */}
          <Card className="card-gradient shadow-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Voice Settings</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Voice Type</Label>
                <Select value={voiceType} onValueChange={setVoiceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speech Speed</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{speed[0]}x</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Voice Pitch</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={pitch}
                    onValueChange={setPitch}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{pitch[0]}x</span>
                </div>
              </div>
            </div>
          </Card>

          {/* API Settings */}
          <Card className="card-gradient shadow-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">API Provider</h2>
            
            <div className="space-y-2">
              <Label>Translation Service</Label>
              <Select value={apiProvider} onValueChange={setApiProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Translate</SelectItem>
                  <SelectItem value="libre">LibreTranslate</SelectItem>
                  <SelectItem value="whisper">OpenAI Whisper</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              size="lg"
              onClick={handleSaveProfile}
              disabled={loading}
              className="transition-smooth"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
