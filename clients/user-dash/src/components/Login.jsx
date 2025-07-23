import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, LogIn } from "lucide-react";
import { authAPI } from "../services/apiService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../contexts/UserContext";

const Login = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // const response = await authAPI.login(username.trim());

      const response = {
        user: { name: username.trim(), id: 2, token: null },
      };

      // Success
      login({
        name: response.user.name,
        id: response.user.id,
      });

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${response.user.name}`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please try again.");

      toast({
        title: "Login Failed",
        description:
          error.message || "Please check your username and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your notification dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={onSwitchToRegister}
              >
                Create one here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
