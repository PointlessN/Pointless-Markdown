import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import LoadingScreen from "@/components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating loading screen
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Welcome to Markdown Editor",
        description: "Start typing in the editor to create your markdown document.",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className={loading ? "hidden" : ""}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/:id">
            {params => <Home />}
          </Route>
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
      <Toaster />
    </>
  );
}

export default App;
