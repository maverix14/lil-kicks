import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Mail, 
  X, 
  Plus, 
  Heart, 
  MessageSquare, 
  Lock,
  UserRound,
  HeartHandshake,
  FileHeart,
  FilePenLine
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import GroupFeed from "@/components/GroupFeed";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  getAllGroups,
  addMemberToGroup, 
  InnerCircleGroup,
  getEntriesSharedWithGroup,
  getCommentsForEntry,
  getLikesForEntry
} from "@/lib/journalStorage";
import { getAllValidGroups } from "@/lib/journalStorageHelper";
import { generateAnonymousName } from "@/components/InnerCircleHelper";
import { sendInviteEmail, sendPartnerLinkRequest } from "@/utils/emailService";
import { featureFlags } from "@/config/features";
import GroupEntryCard from "@/components/GroupEntryCard";
import RegisterBenefitsDialog from "@/components/RegisterBenefitsDialog";
import { benefitContexts, ctaLabels } from "@/config/accountBenefits";

const InnerCircle = () => {
  const [selectedTab, setSelectedTab] = useState("partner");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [showMembersPopover, setShowMembersPopover] = useState(false);
  const [groups, setGroups] = useState<InnerCircleGroup[]>([]);
  const [sharedEntries, setSharedEntries] = useState<any[]>([]);
  const { isAuthenticated, isGuestMode, user } = useAuth();
  const { toast } = useToast();
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const fetchGroups = () => {
      const storedGroups = getAllValidGroups();
      setGroups(storedGroups);
    };
    
    const fetchSharedEntries = (groupId: string) => {
      const entries = getEntriesSharedWithGroup(groupId);
      
      const formattedEntries = entries.map(entry => {
        const comments = getCommentsForEntry(entry.id);
        const likes = getLikesForEntry(entry.id);
        
        return {
          id: entry.id,
          entryId: entry.id,
          title: entry.title,
          content: entry.content,
          date: new Date(entry.date),
          media: entry.media || [],
          mood: entry.mood,
          sharedBy: "You",
          isPartnerEntry: groupId === "partner" && featureFlags.partnerLinkingEnabled,
          comments: comments.map(comment => ({
            id: comment.id,
            author: comment.author,
            content: comment.content,
            date: new Date(comment.date),
            groupId: groupId
          })),
          likes: likes.map(like => like.userId)
        };
      });
      
      setSharedEntries(formattedEntries);
    };
    
    fetchGroups();
    if (selectedTab) {
      fetchSharedEntries(selectedTab);
    }
  }, [selectedTab]);

  const handleInviteMember = async () => {
    if (!emailToInvite || !emailToInvite.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsInviting(true);
    
    try {
      const currentGroup = groups.find(g => g.id === selectedTab);
      
      if (!currentGroup) {
        throw new Error("Group not found");
      }
      
      const addedSuccessfully = addMemberToGroup(selectedTab, emailToInvite);
      
      if (!addedSuccessfully) {
        throw new Error("Failed to add member, they may already exist in this group");
      }
      
      const emailSent = await sendInviteEmail(
        emailToInvite, 
        currentGroup.name, 
        user?.name || user?.email || "A friend"
      );
      
      if (!emailSent) {
        toast({
          title: "Member added",
          description: `${emailToInvite} was added to your group but the invitation email couldn't be sent`,
          variant: "default",
        });
      } else {
        toast({
          title: "Invitation sent",
          description: `Invitation has been sent to ${emailToInvite}`,
        });
      }
      
      setGroups(getAllValidGroups());
      setEmailToInvite("");
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Invitation error:", error);
      
      toast({
        title: "Invitation failed",
        description: error instanceof Error ? error.message : "This email may already be in the group",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleLinkPartner = async () => {
    if (!emailToInvite || !emailToInvite.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address to link with your partner",
        variant: "destructive",
      });
      return;
    }
    
    setIsLinking(true);
    
    try {
      const sent = await sendPartnerLinkRequest(
        emailToInvite, 
        user?.name || user?.email || "Your partner"
      );
      
      if (sent) {
        toast({
          title: "Partner link request sent",
          description: `A link request has been sent to ${emailToInvite}. They'll need to accept it to enable cross-sharing.`,
        });
        
        addMemberToGroup("partner", emailToInvite);
        
        setGroups(getAllValidGroups());
      } else {
        throw new Error("Failed to send link request");
      }
      
      setEmailToInvite("");
      setIsLinkDialogOpen(false);
    } catch (error) {
      console.error("Partner linking error:", error);
      
      toast({
        title: "Link request failed",
        description: "Failed to send the partner link request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  if (isGuestMode) {
    return (
      <div className="min-h-screen pb-24 px-4 sm:px-16 md:px-24 lg:px-32 bg-gradient-to-b from-health-50 to-health-100/70 dark:from-health-50 dark:to-black/20">
        <Header />
        <main className="flex flex-col items-center justify-center mt-12">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <h1 className="text-2xl font-semibold mb-2">Inner Circle Unavailable</h1>
            
            <p className="text-muted-foreground mb-6">
              {benefitContexts.sharing}
            </p>
            
            <div className="flex flex-col gap-3">
              <Link to="/auth">
                <Button className="w-full">
                  <UserRound className="mr-2 h-4 w-4" />
                  {ctaLabels.primary}
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowRegisterDialog(true)}
              >
                Discover All You Get With an Account
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Your data will be securely stored and you'll be able to access it from any device.
              </p>
            </div>
          </div>
          
          <AdCard variant="medium" className="mt-12" />
        </main>
        <BottomBar />
        
        <RegisterBenefitsDialog
          open={showRegisterDialog}
          onOpenChange={setShowRegisterDialog}
          title="Unlock Full Features"
          description={benefitContexts.comingSoon}
          primaryActionLabel={ctaLabels.primary}
          secondaryActionLabel="Stay in Guest Mode"
          showMigrationInfo={true}
        />
      </div>
    );
  }

  const isPartnerTab = selectedTab === "partner";
  const isPrivateTab = selectedTab === "private";

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-16 md:px-24 lg:px-32 bg-gradient-to-b from-health-50 to-health-100/70 dark:from-health-50 dark:to-black/20">
      <Header />
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Inner Circle</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">YOUR PRIVATE GROUPS</h2>
          <div className="h-px bg-border w-full"></div>
        </div>

        <Tabs defaultValue="partner" value={selectedTab} onValueChange={setSelectedTab} className="animate-fade-in">
          <TabsList className="grid grid-cols-4 mb-8">
            {groups.map(group => (
              <TabsTrigger key={group.id} value={group.id} className="text-center">
                {group.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {groups.map(group => (
            <TabsContent key={group.id} value={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <Popover open={showMembersPopover && selectedTab === group.id} onOpenChange={(open) => setShowMembersPopover(open)}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div className="flex -space-x-2">
                        {(group.members || []).slice(0, 3).map((member, i) => (
                          <Avatar key={i} className="border-2 border-background w-8 h-8">
                            <AvatarFallback>{member.name ? member.name.charAt(0) : (member.email?.charAt(0) || 'U')}</AvatarFallback>
                          </Avatar>
                        ))}
                        {(group.members || []).length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs">
                            +{(group.members || []).length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Members</h3>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={() => setIsInviteDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-px bg-border w-full"></div>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {(group.members || []).map((member, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>{member.name ? member.name.charAt(0) : (member.email?.charAt(0) || 'U')}</AvatarFallback>
                              </Avatar>
                              <div>
                                {isPrivateTab ? (
                                  <p className="text-sm font-medium">
                                    {generateAnonymousName(member.id)} {member.name ? `(${member.name})` : ''}
                                  </p>
                                ) : (
                                  <p className="text-sm font-medium">{member.name || 'Unnamed'}</p>
                                )}
                                <p className="text-xs text-muted-foreground">{member.email || ''}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="flex gap-2">
                  {isPartnerTab && featureFlags.partnerLinkingEnabled && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => setIsLinkDialogOpen(true)}
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span className="text-xs">Link</span>
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsInviteDialogOpen(true)}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Invite</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {sharedEntries.length > 0 ? (
                  sharedEntries.map(entry => (
                    <GroupEntryCard 
                      key={entry.id} 
                      entry={{
                        ...entry,
                        comments: isPrivateTab 
                          ? entry.comments.map((c: any) => ({
                              ...c,
                              author: generateAnonymousName(c.id)
                            }))
                          : entry.comments
                      }}
                      currentUser={user?.id || 'guest'} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/50 rounded-xl">
                    <p className="text-muted-foreground">No shared entries in this group yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">Share your journal entries to see them here.</p>
                  </div>
                )}
              </div>
              
              <AdCard variant="medium" className="mt-6" />
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to {groups.find(g => g.id === selectedTab)?.name || 'group'}</DialogTitle>
            <DialogDescription>
              {isPartnerTab ? (
                "Invite your partner to view and interact with your shared entries."
              ) : isPrivateTab ? (
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
                value={emailToInvite}
                onChange={(e) => setEmailToInvite(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleInviteMember} 
              disabled={isInviting}
            >
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
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
                value={emailToInvite}
                onChange={(e) => setEmailToInvite(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleLinkPartner} 
              disabled={isLinking}
            >
              {isLinking ? "Sending..." : "Send Link Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomBar />
    </div>
  );
};

export default InnerCircle;