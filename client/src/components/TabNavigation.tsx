import { Edit, Eye, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  // Define tab configurations
  const tabs: { id: string; label: string; icon: ReactNode }[] = [
    { id: "text", label: "Text", icon: <Edit className="h-4 w-4" /> },
    { id: "preview", label: "Preview", icon: <Eye className="h-4 w-4" /> },
    { id: "how", label: "How", icon: <HelpCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="bg-card/95 backdrop-blur-sm border-b border-primary/15">
      <div className="container mx-auto">
        <nav className="flex">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                className={`
                  relative px-6 py-3.5 font-medium text-sm transition-all duration-200
                  ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
