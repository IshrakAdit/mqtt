import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, LogOut, Send } from "lucide-react";
import mqttClient from "../services/mqttService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../contexts/UserContext";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({ to: "admin", message: "" });

  const { toast } = useToast();
  const { user, logout } = useUser();
  const username = user.name;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send message
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.to.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Recipient and message are required.",
        variant: "destructive",
      });
      return;
    }

    const topic = `messages/${formData.to}`;
    mqttClient.publish(topic, formData.message);

    const newMessage = {
      id: Date.now() + Math.random(),
      from: "You",
      message: formData.message,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newMessage, ...prev]);
    toast({ title: "Message Sent", description: formData.message });
    setFormData({ to: "admin", message: "" });
  };

  // Subscribe to personal topic
  useEffect(() => {
    const subscriptionTopic = `messages/${username}`;

    const handleConnect = () => {
      setIsConnected(true);
      mqttClient.subscribe(subscriptionTopic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          toast({
            title: "Connected",
            description: "Real-time messaging enabled",
          });
        }
      });
    };

    const handleMessage = (topic, message) => {
      const newMsg = {
        id: Date.now() + Math.random(),
        from: topic.split("/")[1],
        message: message.toString(),
        timestamp: new Date(),
      };
      setNotifications((prev) => [newMsg, ...prev]);

      toast({
        title: `Message from ${newMsg.from}`,
        description: newMsg.message,
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
      mqttClient.unsubscribe(subscriptionTopic);
      mqttClient.removeListener("connect", handleConnect);
      mqttClient.removeListener("message", handleMessage);
      mqttClient.removeListener("error", handleError);
      mqttClient.removeListener("close", handleClose);
    };
  }, [username, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground">Name: {username}</h1>
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

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader className="pb-3 items-center">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Messaging Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Send Message Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Send To</label>
            <Input
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="Enter recipient username"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write a message..."
              rows={3}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </form>

        {/* Message History */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  No messages yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "You are ready to send and receive messages"
                    : "Waiting for MQTT connection..."}
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="py-4">
                  <div className="text-sm text-muted-foreground">
                    From: <span className="font-semibold">{msg.from}</span>
                  </div>
                  <div className="mt-2 text-base text-foreground">
                    {msg.message}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
