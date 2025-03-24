import { useEffect, useRef } from "react";
import { Code, Type, ListOrdered, Quote, Image, Link, FileText } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the editor when it's first rendered
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Helper functions to insert markdown syntax
  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Create the new text with the markdown syntax
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    // Update the value
    onChange(newText);
    
    // Focus back on textarea and place cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertHeading = () => insertText('## ', '\n');
  const insertBold = () => insertText('**', '**');
  const insertList = () => insertText('- ', '\n- \n- ');
  const insertCodeBlock = () => insertText('```\n', '\n```');
  const insertQuote = () => insertText('> ', '\n');
  const insertLink = () => insertText('[', '](https://)');
  const insertImage = () => insertText('![Alt text](', ')');

  return (
    <div className="editor-container">
      <div className="p-2 bg-card border-b border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium flex items-center">
          <FileText className="inline-block text-primary mr-2" size={16} />
          Editor
        </span>
        <div className="flex space-x-1">
          <button 
            onClick={insertHeading}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert Heading"
          >
            <Type size={16} className="text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={insertBold}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Bold Text"
          >
            <span className="text-muted-foreground hover:text-primary font-bold text-sm">B</span>
          </button>
          <button 
            onClick={insertList}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert List"
          >
            <ListOrdered size={16} className="text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={insertCodeBlock}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert Code Block"
          >
            <Code size={16} className="text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={insertQuote}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert Quote"
          >
            <Quote size={16} className="text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={insertLink}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert Link"
          >
            <Link size={16} className="text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={insertImage}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            title="Insert Image"
          >
            <Image size={16} className="text-muted-foreground hover:text-primary" />
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        id="editor"
        className="editor w-full h-[calc(100vh-200px)] bg-background p-4 resize-none focus:outline-none font-mono text-sm border border-border rounded-b-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Start typing your markdown here...

## Example
- This is a bullet point
- Another bullet point

```javascript
console.log('Hello world!');
```"
        spellCheck={false}
      ></textarea>
    </div>
  );
};

export default TextEditor;
