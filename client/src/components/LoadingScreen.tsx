import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 8;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="max-w-md w-full px-4">
        <div className="mb-10 text-center">
          <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Pointless Markdown
          </div>
          <div className="text-muted-foreground">
            Simplicity in every document
          </div>
        </div>
        
        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-right text-sm text-muted-foreground">
          {progress.toFixed(0)}% loaded
        </div>
        
        <div className="mt-8 text-center opacity-70">
          <a 
            href="https://github.com/PointlessN" 
            className="text-primary hover:opacity-80 transition text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            PointlessN
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
