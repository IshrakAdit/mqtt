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
import { authAPI } from "../services/apiService";
import { useUser } from "../contexts/UserContext";

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // const response = await authAPI.register(username.trim());

      const response = {
        user: { name: username.trim(), id: 2, token: null },
      };
      login({
        name: response.user.name,
        id: response.user.id,
      });
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Enter a username to register</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={onSwitchToLogin}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
