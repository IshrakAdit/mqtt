import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { apiService } from "@/services/apiService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Both username and message are required");
      return;
    }

    setIsLoading(true);

    try {
      await apiService.sendMessage(formData.username, formData.message);
      toast.success("Message sent successfully!");
      setFormData({ username: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="p-2 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-medium text-foreground">Send Message</h1>
          <div className="w-8"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your message"
              rows={4}
              className="resize-none"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11">
            {isLoading ? (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-4">
                <Send className="h-4 w-4" />
                Send Message
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
