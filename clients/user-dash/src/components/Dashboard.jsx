import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, BellRing, LogOut, Send } from "lucide-react";
import mqttClient from "../services/mqttService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../contexts/UserContext";
import MessageCard from "./MessageCard";
import { notificationAPI } from "@/services/apiService.js";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ username: "", message: "" });
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username: targetUser, message } = formData;

    if (!targetUser.trim() || !message.trim()) {
      toast({ title: "Error", description: "Both fields are required" });
      return;
    }

    setIsSending(true);
    try {
      await notificationAPI.sendMessage(targetUser, message);
      toast({ title: "Message sent!", description: `To ${targetUser}` });
      setFormData({ username: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      toast({ title: "Failed", description: "Could not send message" });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const topic = `alerts/${user.name}`;
    const handleConnect = () => {
      console.log("MQTT Connected");
      setIsConnected(true);
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
          toast({
            title: "Connected",
            description: "Real-time messaging enabled",
          });
        } else {
          console.error("Subscription error:", err);
        }
      });
    };

    const handleMessage = (topic, message) => {
      const fromUser = topic.split("/")[1];
      const newMsg = {
        id: Date.now() + Math.random(),
        from: fromUser,
        message: message.toString(),
        timestamp: new Date(),
      };
      console.log("New message received:", newMsg);
      setMessages((prev) => [newMsg, ...prev]);

      toast({
        title: "New Message",
        description: `From ${fromUser}: ${message.toString()}`,
      });
    };

    const handleError = (err) => {
      console.error("MQTT Error:", err);
      setIsConnected(false);
    };

    const handleClose = () => {
      console.warn("MQTT Disconnected");
      setIsConnected(false);
    };

    mqttClient.on("connect", handleConnect);
    mqttClient.on("message", handleMessage);
    mqttClient.on("error", handleError);
    mqttClient.on("close", handleClose);

    if (mqttClient.connected) {
      handleConnect();
    }

    return () => {
      mqttClient.unsubscribe(topic);
      mqttClient.removeListener("connect", handleConnect);
      mqttClient.removeListener("message", handleMessage);
      mqttClient.removeListener("error", handleError);
      mqttClient.removeListener("close", handleClose);
    };
  }, [user.name, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground">Name: {user.name}</h1>
            <p className="text-xl text-muted-foreground">User ID: {user.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="text-xs"
            >
              {isConnected ? "MQTT Connected" : "MQTT Disconnected"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Title */}
        <Card>
          <CardHeader className="pb-3 items-center">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Messaging Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Send Message */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Recipient username"
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message"
              rows={3}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSending}
            className="w-full h-11 mt-2"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </div>
            )}
          </Button>
        </form>

        {/* Message List */}
        <div className="space-y-3 mt-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  No messages yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "You're connected and ready to receive messages"
                    : "Waiting for MQTT connection..."}
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((msg) => <MessageCard key={msg.id} message={msg} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
