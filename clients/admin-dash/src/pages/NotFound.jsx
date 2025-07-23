import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <h2 className="text-lg font-medium text-foreground">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = "/"}
          className="w-full h-11"
        >
          <Home className="h-4 w-4 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;