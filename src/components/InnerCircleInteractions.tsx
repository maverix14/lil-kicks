import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  getEntriesSharedWithGroup,
  getCommentsForEntry, 
  getLikesForEntry,
  addComment,
  toggleLike,
  getAllGroups,
  InnerCircleGroup
} from "@/lib/journalStorage";
import { useAuth } from "@/context/AuthContext";

interface InnerCircleInteractionsProps {
  entryId: string;
  className?: string;
}

const InnerCircleInteractions: React.FC<InnerCircleInteractionsProps> = ({
  entryId,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [groups, setGroups] = useState<InnerCircleGroup[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const userId = user?.id || 'guest';
  const isLiked = likes.some(like => like.userId === userId);
  
  useEffect(() => {
    if (isExpanded) {
      loadInteractions();
    }
  }, [isExpanded, entryId]);
  
  const loadInteractions = () => {
    // Load comments and likes
    const entryComments = getCommentsForEntry(entryId);
    const entryLikes = getLikesForEntry(entryId);
    const allGroups = getAllGroups();
    
    setComments(entryComments);
    setLikes(entryLikes);
    setGroups(allGroups);
  };
  
  const handleToggleLike = () => {
    const isNowLiked = toggleLike(entryId, userId);
    
    // Update UI
    if (isLiked) {
      setLikes(likes.filter(like => like.userId !== userId));
    } else {
      setLikes([...likes, { entryId, userId, date: new Date().toISOString() }]);
      
      toast({
        title: "Liked!",
        description: "You liked this memory",
      });
    }
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Add comment to storage
    const comment = addComment(entryId, user?.name || 'You', newComment);
    
    // Update UI
    setComments([...comments, comment]);
    setNewComment("");
    
    toast({
      title: "Comment added",
      description: "Your comment was added successfully",
    });
  };
  
  const getGroupNameById = (groupId: string): string => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown group';
  };
  
  // If no comments or likes yet
  if (comments.length === 0 && likes.length === 0 && !isExpanded) {
    return null;
  }
  
  // Helper function to generate anonymous names deterministically
  const generateAnonymousName = (id: string): string => {
    // List of adjectives and nouns for generating names
    const adjectives = [
      'happy', 'quiet', 'calm', 'gentle', 'brave', 
      'wise', 'kind', 'swift', 'bold', 'bright'
    ];
    
    const nouns = [
      'penguin', 'dolphin', 'panda', 'tiger', 'eagle',
      'owl', 'koala', 'rabbit', 'fox', 'bear'
    ];
    
    // Use the id to deterministically select an adjective and noun
    const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const adjectiveIndex = idSum % adjectives.length;
    const nounIndex = Math.floor(idSum / adjectives.length) % nouns.length;
    
    return `${adjectives[adjectiveIndex]}-${nouns[nounIndex]}`;
  };
  
  // Check if a comment is from the Private group
  const isFromPrivateGroup = (comment: any): boolean => {
    // In a real app, each comment would have a groupId
    // For this demo, we'll check if the comment has a specific attribute
    // This would be implemented properly in a production app
    return comment.groupId === 'private';
  };
  
  // For the Private group, we anonymize names
  const getDisplayName = (comment: any): string => {
    // Check if this is from the Private group
    if (isFromPrivateGroup(comment)) {
      // Generate an anonymous name based on the comment ID
      return generateAnonymousName(comment.id);
    }
    
    // Otherwise just use the author name
    return comment.author;
  };
  
  return (
    <div className={cn("mt-8", className)}>
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span>Inner Circle Feedback</span>
          {(comments.length > 0 || likes.length > 0) && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {likes.length} likes · {comments.length} comments
            </span>
          )}
        </span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 bg-background rounded-xl p-4 animate-fade-in">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <button
                onClick={handleToggleLike}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                  isLiked ? "text-red-500 bg-red-50" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
                <span>{likes.length}</span>
              </button>
              
              <button
                className="flex items-center gap-1 px-3 py-1 rounded-full text-muted-foreground hover:bg-muted text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length}</span>
              </button>
            </div>
          </div>
          
          {/* Comments section */}
          {comments.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium">Comments</h3>
              
              {comments.map((comment) => {
                const displayName = getDisplayName(comment);
                const moodColor = "#F1F0FB"; // Neutral mood color for comments
                
                return (
                  <div 
                    key={comment.id} 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: moodColor + '80' }} // Add some transparency
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(comment.date), "MMM d, yyyy")}
                          </p>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add comment form */}
              <div className="flex gap-2 pt-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-0 h-10 resize-none text-sm"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
          
          {/* If no comments yet */}
          {comments.length === 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-center py-4">
                <p className="text-muted-foreground">No comments yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to comment!</p>
              </div>
              
              {/* Add comment form */}
              <div className="flex gap-2 pt-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-0 h-10 resize-none text-sm"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InnerCircleInteractions;
