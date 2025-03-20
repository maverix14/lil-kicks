import React, { useState, useEffect } from "react";
import GroupEntryCard from "./GroupEntryCard";
import { Button } from "./ui/button";
import { UserPlus, Link as LinkIcon, ArrowLeft, HeartHandshake } from "lucide-react";
import { 
  getAllEntries,
  getCommentsForEntry,
  getLikesForEntry,
  addMemberToGroup,
  getEntriesSharedWithGroup
} from "@/lib/journalStorage";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdCard from "@/components/AdCard";
import { featureFlags } from "@/config/features";

interface GroupFeedProps {
  group: {
    id: string;
    name: string;
    memberCount: number;
  };
  onBack: () => void;
}

const GroupFeed: React.FC<GroupFeedProps> = ({ group, onBack }) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const isPartnerGroup = group.id === 'partner';
  const isPrivateGroup = group.id === 'private';
  
  useEffect(() => {
    const sharedEntries = getEntriesSharedWithGroup(group.id);
    
    const formattedEntries = sharedEntries.map(entry => {
      const comments = getCommentsForEntry(entry.id);
      const likes = getLikesForEntry(entry.id);
      
      return {
        id: `group-${group.id}-entry-${entry.id}`,
        entryId: entry.id,
        title: entry.title,
        content: entry.content,
        date: new Date(entry.date),
        media: entry.media,
        mood: entry.mood,
        sharedBy: "You",
        comments: isPrivateGroup 
          ? comments.map(c => ({
              id: c.id,
              author: generateAnonymousName(c.id),
              content: c.content,
              date: new Date(c.date)
            }))
          : comments.map(c => ({
              id: c.id,
              author: c.author,
              content: c.content,
              date: new Date(c.date)
            })),
        likes: likes.map(l => l.userId)
      };
    });
    
    setEntries(formattedEntries);
  }, [group.id, isPrivateGroup]);
  
  const handleInvite = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    const success = addMemberToGroup(group.id, email);
    
    if (success) {
      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${email}`
      });
      
      setEmail("");
      setInviteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "This email is already a member of the group",
        variant: "destructive"
      });
    }
  };
  
  const handleLinkPartner = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address to link with your partner",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Partner link request sent",
      description: `A link request has been sent to ${email}. They'll need to accept it to enable cross-sharing.`
    });
    
    setEmail("");
    setLinkDialogOpen(false);
  };
  
  const handleGenerateLink = () => {
    const link = `https://app.example.com/join-group/${group.id}/${Date.now()}`;
    setInviteLink(link);
    
    toast({
      title: "Link generated",
      description: "Share this link to invite people to your group"
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copied",
      description: "Invite link copied to clipboard"
    });
  };

  const generateAnonymousName = (id: string): string => {
    const adjectives = [
      'happy', 'quiet', 'calm', 'gentle', 'brave', 
      'wise', 'kind', 'swift', 'bold', 'bright'
    ];
    
    const nouns = [
      'penguin', 'dolphin', 'panda', 'tiger', 'eagle',
      'owl', 'koala', 'rabbit', 'fox', 'bear'
    ];
    
    const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const adjectiveIndex = idSum % adjectives.length;
    const nounIndex = Math.floor(idSum / adjectives.length) % nouns.length;
    
    return `${adjectives[adjectiveIndex]}-${nouns[nounIndex]}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium">{group.name}</h2>
        </div>
        
        <div className="flex gap-2">
          {isPartnerGroup && featureFlags.partnerLinkingEnabled && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setLinkDialogOpen(true)}
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="text-xs">Link</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setInviteDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-xs">Invite</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => {
              handleGenerateLink();
              setLinkDialogOpen(true);
            }}
          >
            <LinkIcon className="w-4 h-4" />
            <span className="text-xs">Share Link</span>
          </Button>
        </div>
      </div>
      
      {entries.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No shared entries in this group yet.</p>
          <p className="text-sm mt-2">
            Go to your journal and share some memories with this group!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <GroupEntryCard 
                entry={entry}
                currentUser="You"
              />
              {(index + 1) % 3 === 0 && entries.length > 3 && (
                <AdCard variant="medium" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to {group.name}</DialogTitle>
            <DialogDescription>
              {isPartnerGroup ? (
                "Invite your partner to view and interact with your shared entries."
              ) : isPrivateGroup ? (
                "Invite someone to your Private group where their identity will be anonymized to other members."
              ) : (
                "Send an email invitation to join your private group."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isPartnerGroup && (
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Link with Your Partner</DialogTitle>
              <DialogDescription>
                Link your account with your partner to enable cross-sharing of journal entries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">What is Cross-Sharing?</h4>
                <p className="text-sm text-muted-foreground">
                  Cross-sharing allows you and your partner to automatically see each other's journal entries on your home feeds.
                  Unlike regular sharing, cross-shared entries appear directly on both of your home pages.
                </p>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Partner's email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleLinkPartner}>
                Send Link Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {!isPartnerGroup && (
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Group Link</DialogTitle>
              <DialogDescription>
                Share this link to invite people to your {group.name} group.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="text-xs"
                  />
                </div>
                <Button type="button" size="sm" onClick={handleCopyLink}>
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link will give access to your private group. Only share with people you trust.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GroupFeed;