import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, LogOut, Bell, BellRing } from "lucide-react";
import mqttClient from "@/services/mqttService";
import MessageCard from "./MessageCard";
import { apiService } from "@/services/apiService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const username = "admin";
  const [formData, setFormData] = useState({
    username: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Both username and message are required",
      });
      return;
    }

    setIsSending(true);

    try {
      await apiService.sendMessage(formData.username, formData.message);
      toast({ title: "Message sent!", description: `To ${formData.username}` });
      setFormData({ username: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Failed", description: "Could not send message" });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const topic = `alerts/${username}`;

    const handleConnect = () => {
      setIsConnected(true);
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
          toast({
            title: "Connected",
            description: "Real-time messaging enabled",
          });
        } else {
          console.error("Subscription failed:", err);
          toast({
            title: "Subscription Error",
            description: "Failed to subscribe to message topic",
          });
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
      setMessages((prev) => [newMsg, ...prev]);

      toast({
        title: "New Message",
        description: `From ${fromUser}: ${message.toString()}`,
      });
    };

    const handleError = (err) => {
      console.error("MQTT error:", err);
      setIsConnected(false);
      toast({ title: "MQTT Error", description: "Connection error" });
    };

    const handleClose = () => {
      console.warn("MQTT disconnected");
      setIsConnected(false);
      toast({ title: "MQTT Disconnected", description: "Reconnecting..." });
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
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Admin</h1>
              <p className="text-sm text-muted-foreground">
                Username: {username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="text-xs"
            >
              {isConnected ? "MQTT Connected" : "MQTT Disconnected"}
            </Badge>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Title Card */}
        <Card>
          <CardHeader className="pb-3 items-center">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Admin Messaging Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Send to</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter recipient username"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your message"
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSending}
            className="w-full h-11 mt-4"
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
