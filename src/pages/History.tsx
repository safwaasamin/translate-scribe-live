import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Trash2, MessageSquare, Phone, Bot } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConversationWithMessages {
  id: string;
  type: string;
  title: string;
  created_at: string;
  messages: Array<{
    id: string;
    original_text: string;
    translated_text: string | null;
    source_lang: string | null;
    target_lang: string | null;
    role: string | null;
    created_at: string;
  }>;
}

const History = () => {
  const { loading, user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data: conversationsData, error: convError } = await supabase
        .from('conversation_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (convError) throw convError;

      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const { data: messagesData, error: msgError } = await supabase
            .from('conversation_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (msgError) throw msgError;

          return {
            ...conv,
            messages: messagesData || [],
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversation history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConversations(conversations.filter(conv => conv.id !== id));
      toast.success('Conversation deleted');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const playAudio = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'en';
    window.speechSynthesis.speak(utterance);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pirate_chat':
        return <Bot className="h-4 w-4" />;
      case 'live_call':
        return <Phone className="h-4 w-4" />;
      case 'chat_translation':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredConversations = conversations.filter(conv => 
    activeTab === "all" || conv.type === activeTab
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showLanguage />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">History</h1>
            <p className="text-muted-foreground">View and manage your conversations</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pirate_chat">Pirate Chat</TabsTrigger>
              <TabsTrigger value="chat_translation">Translations</TabsTrigger>
              <TabsTrigger value="live_call">Live Calls</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredConversations.length === 0 ? (
                <Card className="card-gradient shadow-card p-8">
                  <p className="text-center text-muted-foreground">
                    No conversations found. Start chatting to see your history here!
                  </p>
                </Card>
              ) : (
                filteredConversations.map((conv) => (
                  <Card key={conv.id} className="card-gradient shadow-card p-6 transition-smooth hover:shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium flex items-center gap-1">
                            {getTypeIcon(conv.type)}
                            {conv.title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(conv.created_at).toLocaleDateString()} at{' '}
                            {new Date(conv.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="transition-smooth hover:scale-105 hover:text-destructive"
                          onClick={() => deleteConversation(conv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {conv.messages.map((msg) => (
                          <div key={msg.id} className="space-y-2">
                            {msg.role && (
                              <div className={`p-3 rounded-lg ${
                                msg.role === 'user' 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'bg-muted/30'
                              }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">
                                    {msg.role === 'user' ? 'You' : 'Assistant'}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground">{msg.original_text}</p>
                              </div>
                            )}
                            
                            {!msg.role && (
                              <>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">
                                      {msg.source_lang?.toUpperCase()}
                                    </span>
                                    {msg.source_lang && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => playAudio(msg.original_text, msg.source_lang!)}
                                      >
                                        <Volume2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                  <p className="text-sm text-foreground">{msg.original_text}</p>
                                </div>
                                
                                {msg.translated_text && (
                                  <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-muted-foreground">
                                        {msg.target_lang?.toUpperCase()}
                                      </span>
                                      {msg.target_lang && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => playAudio(msg.translated_text!, msg.target_lang!)}
                                        >
                                          <Volume2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <p className="text-sm text-foreground">{msg.translated_text}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default History;