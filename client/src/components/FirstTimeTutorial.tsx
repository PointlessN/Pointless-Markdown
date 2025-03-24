import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Share2, Code, Eye, Lock, File, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Improved tutorial steps with more practical information
const steps = [
  {
    title: "Welcome to Pointless Markdown",
    description: "A simple and efficient way to create, preview, and share markdown documents.",
    icon: <File className="h-10 w-10 text-primary" />,
    tip: "Your documents are automatically saved in your browser. No account required."
  },
  {
    title: "Create Content Easily",
    description: "Write markdown in the editor tab to create formatted content.",
    icon: <Edit className="h-10 w-10 text-primary" />,
    tip: "Use # for headings, * for lists, ** for bold text, and more.",
    codeExample: "# Heading\n\n**Bold text**\n\n* List item\n* Another item"
  },
  {
    title: "Preview Instantly",
    description: "Toggle to the Preview tab to see your formatted document.",
    icon: <Eye className="h-10 w-10 text-primary" />,
    tip: "The preview updates in real-time as you make changes to your content."
  },
  {
    title: "Share with Custom URLs",
    description: "Create a unique, custom link to share your document with others.",
    icon: <Share2 className="h-10 w-10 text-primary" />,
    tip: "You can choose your own custom URL ending for easier sharing."
  },
  {
    title: "Edit Protection",
    description: "Every shared document has a unique edit code for security.",
    icon: <Lock className="h-10 w-10 text-primary" />,
    tip: "Save the edit code when sharing - you'll need it to make changes later!"
  },
  {
    title: "You're All Set!",
    description: "Start creating and sharing your markdown documents now.",
    icon: <FileCheck className="h-10 w-10 text-green-500" />,
    tip: "Click 'How' anytime to learn more about markdown formatting."
  }
];

const LOCAL_STORAGE_KEY = "pointless-markdown-tutorial-shown";

const FirstTimeTutorial = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if the tutorial has been shown before
    const tutorialShown = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!tutorialShown) {
      // If not shown before, display the tutorial
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // On last step, close tutorial and mark as shown
      setOpen(false);
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    }
  };

  const handleSkip = () => {
    setOpen(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-primary/10 shadow-lg bg-background">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
              {currentStepData.icon}
            </div>
          </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-center text-foreground font-medium">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {currentStepData.codeExample && (
            <div className="bg-muted/50 border border-primary/10 rounded-md p-3 font-mono text-sm overflow-auto">
              <div className="flex items-center gap-2 mb-2 text-xs text-primary">
                <Code className="h-4 w-4" />
                <span>Example:</span>
              </div>
              <pre className="whitespace-pre-wrap">{currentStepData.codeExample}</pre>
            </div>
          )}
          
          <div className="bg-card/50 border border-primary/10 rounded-md p-3 text-sm">
            <div className="flex items-center gap-2 text-primary text-xs">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M7.5 1C3.91015 1 1 3.91015 1 7.5C1 11.0899 3.91015 14 7.5 14C11.0899 14 14 11.0899 14 7.5C14 3.91015 11.0899 1 7.5 1ZM7.5 2C10.5376 2 13 4.46243 13 7.5C13 10.5376 10.5376 13 7.5 13C4.46243 13 2 10.5376 2 7.5C2 4.46243 4.46243 2 7.5 2ZM7 4.5V5.5H8V4.5H7ZM7 6.5V10.5H8V6.5H7Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>TIP</span>
            </div>
            <p className="mt-1 text-muted-foreground">{currentStepData.tip}</p>
          </div>
        </div>
        
        <div className="flex justify-center mt-2 mb-4">
          {steps.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "h-1.5 rounded-full mx-0.5 cursor-pointer transition-all",
                index === currentStep 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted hover:bg-primary/30"
              )}
            />
          ))}
        </div>
        
        <DialogFooter className="sm:justify-between border-t border-primary/10 pt-3">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90"
          >
            {currentStep < steps.length - 1 ? (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              'Start Using Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeTutorial;