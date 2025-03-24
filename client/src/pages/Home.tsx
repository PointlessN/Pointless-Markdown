import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import TextEditor from "@/components/TextEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import HowTo from "@/components/HowTo";
import FirstTimeTutorial from "@/components/FirstTimeTutorial";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Lock, Edit, Save, Share2, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "markdown-editor-content";
const URL_PREFIX = window.location.origin;

const Home = () => {
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [copied, setCopied] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [inputEditCode, setInputEditCode] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const editCodeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate a random string for share links or edit codes
  const generateRandomString = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Generate a more secure edit code
  const generateEditCode = () => {
    return generateRandomString(8);
  };
  
  // Helper function to get ordinal suffix for numbers
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'th'; // handle 4th through 20th
    switch (n % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
  };

  // Check if we're on a shared page (using clean URLs without /share prefix)
  const [match, params] = useRoute("/:id");
  
  // Track whether the view has been counted in this session
  const [viewCounted, setViewCounted] = useState(false);

  // Define root paths that shouldn't be treated as shared documents
  const rootPaths = ['', 'text', 'preview', 'how'];
  
  // Load saved content on initial render or load shared content if on a share page
  useEffect(() => {
    if (match && params?.id && !rootPaths.includes(params.id)) {
      // Try to load the shared content
      const sharedContent = localStorage.getItem(`shared_${params.id}`);
      const sharedEditCode = localStorage.getItem(`editcode_${params.id}`);
      const viewsKey = `views_${params.id}`;
      // Session storage key to prevent multiple view counts in same session
      const sessionViewKey = `session_viewed_${params.id}`;
      
      if (sharedContent) {
        setMarkdown(sharedContent);
        // Reset edit mode when first loading a shared document
        setIsEditMode(false);
        
        // Store the slug for potential editing later
        setCustomSlug(params.id);
        
        // Get current view count
        let views = parseInt(localStorage.getItem(viewsKey) || '0', 10);
        
        // Check if this document has been viewed in this session already
        const alreadyViewed = sessionStorage.getItem(sessionViewKey);
        
        if (!alreadyViewed && !viewCounted) {
          // Only increment view count if this is the first view in this session
          views += 1;
          localStorage.setItem(viewsKey, views.toString());
          
          // Mark as viewed in this session
          sessionStorage.setItem(sessionViewKey, 'true');
          setViewCounted(true);
          
          toast({
            title: "View Counted",
            description: `This document has been viewed ${views} time${views === 1 ? '' : 's'}.`,
            variant: "default",
          });
        }
        
        // Always update view count state
        setViewCount(views);
        
        // If this document has an edit code
        if (sharedEditCode && !alreadyViewed) {
          toast({
            title: "Shared Document Loaded",
            description: "This document is in read-only mode and cannot be edited.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Shared Document Not Found",
          description: "The document you're trying to access doesn't exist or has been removed.",
          variant: "destructive",
        });
      }
    } else {
      // Load from regular storage if not on a share page
      const savedContent = localStorage.getItem(STORAGE_KEY);
      if (savedContent) {
        setMarkdown(savedContent);
      }
    }
  }, [match, params, toast, viewCounted]);

  // Auto-save functionality
  useEffect(() => {
    // Only save if we're not on a shared page or if we're in edit mode
    if ((!match || isEditMode) && markdown.trim() !== "") {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, markdown);
          // No toast notification for auto-save to avoid interrupting the user
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to auto-save your content. Local storage might be full or disabled.",
            variant: "destructive",
          });
        }
      }, 1000); // Auto-save after 1 second of inactivity
      
      return () => clearTimeout(saveTimeout);
    }
  }, [markdown, match, isEditMode, toast]);

  const handleShare = () => {
    // Don't auto-generate a slug anymore, let user choose their own
    setCustomSlug("");
    setIsShareDialogOpen(true);
  };

  const checkIfSlugExists = (slug: string): boolean => {
    return localStorage.getItem(`shared_${slug}`) !== null;
  };

  const generateShareLink = () => {
    if (customSlug && customSlug.trim() !== '') {
      // Check if the slug already exists
      if (checkIfSlugExists(customSlug)) {
        toast({
          title: "URL Already Exists",
          description: "This custom URL is already in use. Please choose a different one.",
          variant: "destructive",
        });
        return;
      }
      
      // Create the link format (now using clean URLs without '/share/' prefix)
      const link = `${URL_PREFIX}/${customSlug}`;
      setShareLink(link);
      
      // Generate an edit code for this document
      const newEditCode = generateEditCode();
      setEditCode(newEditCode);
      
      // Save the markdown and edit code in local storage with the slug as key
      localStorage.setItem(`shared_${customSlug}`, markdown);
      localStorage.setItem(`editcode_${customSlug}`, newEditCode);
      
      toast({
        title: "Link Generated",
        description: "Your custom sharing link has been created with edit protection!",
        variant: "default",
      });

      // Select the text in the input for easy copying
      setTimeout(() => {
        if (linkInputRef.current) {
          linkInputRef.current.select();
        }
      }, 100);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid custom URL path.",
        variant: "destructive",
      });
    }
  };
  
  const handleRequestEdit = () => {
    // Open the edit dialog to enter the edit code
    setIsEditDialogOpen(true);
  };
  
  const verifyEditCode = () => {
    if (!params?.id) {
      toast({
        title: "Error",
        description: "No document ID found.",
        variant: "destructive",
      });
      return;
    }
    
    // Always show "access denied" message
    toast({
      title: "Edit Access Denied",
      description: "Editing has been disabled for shared documents.",
      variant: "destructive",
    });
    
    // Close the dialog
    setIsEditDialogOpen(false);
  };
  
  const handleUpdateSharedDocument = () => {
    if (match && params?.id && isEditMode) {
      // Update the shared document
      localStorage.setItem(`shared_${params.id}`, markdown);
      
      toast({
        title: "Document Updated",
        description: "The shared document has been updated successfully.",
        variant: "default",
      });
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
            variant: "default",
          });
        })
        .catch(err => {
          toast({
            title: "Error",
            description: "Failed to copy to clipboard",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShare={handleShare} />
      
      {/* Only show TabNavigation when not on a shared page or when in edit mode */}
      {(!match || rootPaths.includes(params?.id || '') || isEditMode) && (
        <>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <FirstTimeTutorial />
        </>
      )}
      
      <main className="container mx-auto p-4">
        {/* For regular editor (not shared page) */}
        {(!match || rootPaths.includes(params?.id || '')) && (
          <>
            {activeTab === "text" && (
              <TextEditor value={markdown} onChange={setMarkdown} />
            )}
            
            {activeTab === "preview" && (
              <MarkdownPreview markdown={markdown} />
            )}
            
            {activeTab === "how" && (
              <HowTo />
            )}
          </>
        )}
        
        {/* For shared pages - always show preview and edit/save button at bottom */}
        {match && params?.id && !rootPaths.includes(params.id) && (
          <div className="space-y-6">
            {/* Always show preview for shared documents */}
            <div className="relative">
              <MarkdownPreview markdown={markdown} />
              
              {/* Shared document indicator and view count */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary px-3 py-1.5">
                  <Share2 className="h-3.5 w-3.5 mr-1.5" /> 
                  Shared Document
                </Badge>
                <Badge variant="outline" className="bg-accent/10 border-accent px-3 py-1.5">
                  <Eye className="h-3.5 w-3.5 mr-1.5" /> 
                  {viewCount} {viewCount === 1 ? 'View' : 'Views'}
                </Badge>
              </div>
            </div>
            
            {/* Editor appears only when in edit mode */}
            {isEditMode && (
              <div className="mt-8 border-t border-primary/10 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-lg font-semibold">Edit Document</h2>
                </div>
                <TextEditor value={markdown} onChange={setMarkdown} />
                
                {/* Save button for edit mode */}
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={handleUpdateSharedDocument}
                    className="bg-primary hover:bg-primary/90 px-8 shadow-md"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Edit button at bottom of shared document */}
            {!isEditMode && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleRequestEdit}
                  variant="outline"
                  className="border-primary/40 hover:bg-primary/10 hover:border-primary"
                  size="lg"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit This Document
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Edit Mode Badge */}
        {isEditMode && (
          <div className="fixed bottom-4 right-4">
            <Badge variant="outline" className="bg-accent/20 border-accent px-3 py-1.5 shadow-md">
              <Edit className="h-4 w-4 mr-1.5" /> Edit Mode Active
            </Badge>
          </div>
        )}
      </main>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-xl bg-background border-primary/10 shadow-lg rounded-xl">
          <DialogHeader className="space-y-4 pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full border border-primary/30 relative">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-md"></div>
              <Share2 className="h-8 w-8 text-primary relative z-10" />
            </div>
            <DialogTitle className="text-xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Share Your Document
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Create a custom link to share your markdown document with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-6 py-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 bg-primary rounded-full"></div>
                <div className="text-sm font-medium">Choose a custom URL ending</div>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center bg-card/80 p-4 rounded-lg border border-primary/20">
                <div className="text-muted-foreground font-mono text-sm whitespace-nowrap mb-2 sm:mb-0">
                  {URL_PREFIX}/
                </div>
                <Input
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                  placeholder="your-custom-name"
                  className="w-full sm:flex-1 h-10 bg-muted/30 border-primary/20 focus-visible:ring-primary/20 font-medium"
                />
              </div>
              
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pl-1">
                <span className="inline-block h-1 w-1 bg-primary/70 rounded-full"></span>
                <span className="italic">This will be the public URL for viewing your document</span>
              </p>
            </div>
            
            <Button 
              onClick={generateShareLink} 
              className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 relative overflow-hidden"
              disabled={!customSlug || customSlug.trim() === ''}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 animate-pulse -translate-x-full group-hover:translate-x-full transition-all duration-300"></div>
              <Share2 className="mr-2 h-4 w-4" />
              Create Shareable Link
            </Button>
            
            {shareLink && (
              <div className="mt-2 space-y-6 border-t border-primary/10 pt-6">
                <div className="flex items-center gap-2.5 bg-green-500/10 text-green-500 py-2 px-3 rounded-md border border-green-500/30">
                  <Check className="h-5 w-5" />
                  <span className="font-medium text-sm">Document shared successfully!</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-primary rounded-full"></div>
                    <div className="text-sm font-medium">Your shareable link</div>
                  </div>
                  
                  <div className="flex items-center gap-2 group">
                    <div className="flex-1 bg-card/80 border border-primary/20 rounded-lg overflow-hidden transition-all duration-200 group-hover:border-primary/50">
                      <Input
                        ref={linkInputRef}
                        value={shareLink}
                        readOnly
                        className="flex-1 font-mono text-xs sm:text-sm border-0 focus-visible:ring-0 bg-transparent"
                      />
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      size="icon"
                      variant={copied ? "default" : "outline"}
                      className={`shrink-0 ${copied 
                        ? "bg-primary text-white" 
                        : "border-primary/40 hover:bg-primary/10 hover:text-primary hover:border-primary"}`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {editCode && (
                  <div className="space-y-3">
                    <Alert className="bg-primary/5 border-primary/30 text-foreground">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Lock className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">Edit Protection Enabled</span>
                      </div>
                      <AlertDescription className="text-muted-foreground">
                        Anyone with this edit code can modify your document:
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-1 rounded-lg bg-gradient-to-r from-primary/40 to-accent/40">
                      <div className="bg-background/95 backdrop-blur-sm p-4 rounded-md">
                        <div className="font-mono text-center text-lg tracking-wider text-primary font-semibold">
                          {editCode}
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>Save this code! You'll need it to edit your document later.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-center sm:justify-center border-t border-primary/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsShareDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              Close Dialog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Access Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-xl bg-background border-primary/10 shadow-lg rounded-xl">
          <DialogHeader className="space-y-4 pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full border border-primary/30 relative">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-md"></div>
              <Lock className="h-8 w-8 text-primary relative z-10" />
            </div>
            <DialogTitle className="text-xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Edit Access Disabled
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Editing has been disabled for shared documents. Documents are read-only.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-6 py-6">
            <Alert className="bg-primary/5 border-primary/30 text-foreground">
              <div className="flex items-center gap-2 text-sm mb-1">
                <Lock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Read-Only Mode Enabled</span>
              </div>
              <AlertDescription className="text-muted-foreground">
                All shared documents are in read-only mode and cannot be edited.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-center py-6">
              <div className="text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <h3 className="text-lg font-semibold mb-2">View Count Tracking</h3>
                <p className="text-sm max-w-md">
                  While editing is disabled, we track the number of views on your shared document.
                  This helps you understand how many times your content has been accessed.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsEditDialogOpen(false)} 
              className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 animate-pulse -translate-x-full group-hover:translate-x-full transition-all duration-300"></div>
              <Eye className="mr-2 h-4 w-4" />
              Back to Viewing Document
            </Button>
          </div>
          
          <DialogFooter className="flex justify-center sm:justify-center border-t border-primary/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditDialogOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
