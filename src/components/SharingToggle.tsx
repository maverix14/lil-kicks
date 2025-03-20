import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Lock, Share2, Users, Info, HeartHandshake } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllGroups } from "@/lib/journalStorage";
import { useAuth } from "@/context/AuthContext";
import RegisterBenefitsDialog from "./RegisterBenefitsDialog";
import { benefitContexts } from "@/config/accountBenefits";

// Define group type
export interface SharingGroup {
  id: string;
  name: string;
  memberCount: number;
}

interface SharingToggleProps {
  isShared: boolean;
  onShareChange: (shared: boolean, selectedGroups?: string[]) => void;
  className?: string;
  compact?: boolean;
}

const SharingToggle: React.FC<SharingToggleProps> = ({
  isShared,
  onShareChange,
  className,
  compact = false,
}) => {
  const { toast } = useToast();
  const { isGuestMode, isAuthenticated } = useAuth();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<SharingGroup[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  
  // Load only the 4 predefined groups
  useEffect(() => {
    // Define the 4 predefined groups with correct order
    const predefinedGroups: SharingGroup[] = [
      { id: 'partner', name: 'Partner', memberCount: 0 },
      { id: 'family', name: 'Family', memberCount: 0 },
      { id: 'friends', name: 'Friends', memberCount: 0 },
      { id: 'private', name: 'Private', memberCount: 0 }
    ];
    
    // Get actual member counts from storage
    const storedGroups = getAllGroups();
    
    // Update member counts if available
    const updatedGroups = predefinedGroups.map(group => {
      const storedGroup = storedGroups.find(g => g.id === group.id);
      return {
        ...group,
        memberCount: storedGroup?.memberCount || 0
      };
    });
    
    setGroups(updatedGroups);
  }, []);
  
  // Sync selectedGroups with isShared prop
  useEffect(() => {
    if (!isShared) {
      setSelectedGroups([]);
    }
  }, [isShared]);

  // Reset sharing state when in guest mode
  useEffect(() => {
    if (isGuestMode && isShared) {
      onShareChange(false);
    }
  }, [isGuestMode, isShared, onShareChange]);
  
  const handleToggleShare = () => {
    if (isGuestMode) {
      setShowRegisterDialog(true);
      return;
    }

    if (!isShared) {
      // If turning on sharing, open the popover
      setIsOpen(true);
    } else {
      // If turning off sharing, do it immediately
      onShareChange(false);
      setSelectedGroups([]);
    }
  };

  const handleGroupSelect = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };
  
  const handleShareConfirm = () => {
    if (isGuestMode) {
      setShowRegisterDialog(true);
      return;
    }

    if (selectedGroups.length === 0) {
      toast({
        title: "Select a group",
        description: "Please select at least one group to share with.",
        variant: "destructive",
      });
      return;
    }
    
    onShareChange(true, selectedGroups);
    setIsOpen(false);
    
    toast({
      title: "Entry shared",
      description: `Your entry has been shared with ${selectedGroups.length} group(s).`,
    });
  };

  // Render locked state for guest mode
  if (isGuestMode) {
    return (
      <>
        <div
          onClick={handleToggleShare}
          className={cn(
            "flex items-center justify-between rounded-lg p-3 transition-all duration-300 relative cursor-pointer",
            className
          )}
          style={{
            backgroundColor: "rgba(229, 231, 235, 0.8)",
            opacity: 0.8,
          }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background">
            <Lock className="w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Private</span>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <RegisterBenefitsDialog
          open={showRegisterDialog}
          onOpenChange={setShowRegisterDialog}
          title="Create an Account to Share"
          description={benefitContexts.sharing}
          primaryActionLabel="Create Account & Share"
          secondaryActionLabel="Stay in Guest Mode"
          showMigrationInfo={true}
        />
      </>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleToggleShare}
          className={cn(
            "flex items-center justify-between rounded-lg p-3 transition-all duration-300",
            className
          )}
          style={{
            backgroundColor: isShared ? "rgba(124, 58, 237, 0.1)" : "rgba(229, 231, 235, 0.8)",
          }}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isShared ? "bg-secondary/50" : "bg-background"
          )}>
            {isShared ? (
              <Share2 className="w-4 h-4 text-primary" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
          
          <span className="text-sm font-medium mr-3">
            {isShared ? "Shared" : "Private"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            Share with your groups
          </h4>
          
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center">
                <label className="flex items-center flex-1">
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={() => handleGroupSelect(group.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{group.name}</span>
                </label>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleShareConfirm} 
            className="w-full"
            disabled={selectedGroups.length === 0}
          >
            {isShared ? "Update sharing" : "Share entry"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharingToggle;
