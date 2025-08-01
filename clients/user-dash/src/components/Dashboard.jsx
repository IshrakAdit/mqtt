import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, LogOut } from "lucide-react";
import mqttClient from "../services/mqttService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../contexts/UserContext";
import MessageCard from "./MessageCard";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useUser();

  useEffect(() => {
    const subscriptionTopic = "alerts/" + user.name;
    console.log("Subscribing to topic:", subscriptionTopic);
    const handleConnect = () => {
      console.log("MQTT Connected");
      setIsConnected(true);
      mqttClient.subscribe(subscriptionTopic, (err) => {
        if (!err) {
          console.log("Subscribed to notification/topic");
          toast({
            title: "Connected",
            description: "Real-time notifications enabled",
          });
        } else {
          console.error("Subscription error:", err);
        }
      });
    };

    const handleMessage = (topic, message) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        message: message.toString(),
        timestamp: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
      console.log("New notification received:", newNotification);

      toast({
        title: "New Notification",
        description: message.toString(),
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

    // Registering listeners
    mqttClient.on("connect", handleConnect);
    mqttClient.on("message", handleMessage);
    mqttClient.on("error", handleError);
    mqttClient.on("close", handleClose);

    // If already connected (can happen before useEffect), we manually call handler
    if (mqttClient.connected) {
      handleConnect();
    }

    return () => {
      mqttClient.removeListener("connect", handleConnect);
      mqttClient.removeListener("message", handleMessage);
      mqttClient.removeListener("error", handleError);
      mqttClient.removeListener("close", handleClose);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-semibold text-foreground">
                Name: {user.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                User ID: {user.id}
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
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-3 items-center">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Notifications Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  No notifications yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "You're connected and ready to receive notifications"
                    : "Waiting for connection to MQTT broker..."}
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <MessageCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
