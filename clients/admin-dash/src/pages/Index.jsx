import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-8 mt-8">
        <div className="space-y-10">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Admin Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-4">
            Access the messaging dashboard
          </p>
        </div>

        <Button onClick={handleLogin} className="w-1/2 h-11 mt-4">
          Login to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
