import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-secondary/30 p-6 rounded-full inline-flex items-center justify-center mb-2">
          <FileQuestion className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
