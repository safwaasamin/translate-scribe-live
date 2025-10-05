import { useState } from "react";
import { Header } from "@/components/Header";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [defaultSource, setDefaultSource] = useState("en");
  const [defaultTarget, setDefaultTarget] = useState("es");
  const [voiceType, setVoiceType] = useState("female");
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [apiProvider, setApiProvider] = useState("google");
  const [autoDetect, setAutoDetect] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showLanguage />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your translation preferences</p>
          </div>

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

          <div className="flex justify-end">
            <Button size="lg" className="transition-smooth">
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
