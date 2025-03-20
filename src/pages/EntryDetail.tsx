import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Play, Pause, Mic, Pencil, Trash2, FilePenLine, FileHeart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getEntry, toggleFavorite, updateEntry, JournalEntry, deleteEntry, updateSharing } from "@/lib/journalStorage";
import { EntryProps } from "@/components/EntryCard";
import BottomBar from "@/components/BottomBar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MoodType } from "@/components/MoodSelector";
import BabyKickTracker from "@/components/BabyKickTracker";
import SharingToggle from "@/components/SharingToggle";
import AudioPlayer from "@/components/AudioPlayer";
import EntryTitleInput from "@/components/EntryTitleInput";
import AttachmentHandler from "@/components/AttachmentHandler";
import InnerCircleInteractions from "@/components/InnerCircleInteractions";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getMoodColor = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "#FEF7CD";
    case "content":
      return "#F2FCE2";
    case "neutral":
      return "#F1F0FB";
    case "sad":
      return "#D3E4FD";
    case "stressed":
      return "#FFDEE2";
    default:
      return "#FAFAFA";
    }
  };

const getMoodEmoji = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "😊";
    case "content":
      return "😌";
    case "neutral":
      return "😐";
    case "sad":
      return "😔";
    case "stressed":
      return "😰";
    default:
      return null;
    }
  };

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isGuestMode } = useAuth();
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [kickCount, setKickCount] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [sharedWithGroups, setSharedWithGroups] = useState<string[]>([]);
  const [isPartnerEntry, setIsPartnerEntry] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEntry = getEntry(id);
      if (foundEntry) {
        const formattedEntry: EntryProps = {
          ...foundEntry,
          date: new Date(foundEntry.date),
        };
        
        setEntry(formattedEntry);
        setIsFavorite(formattedEntry.favorite || false);
        setMood(formattedEntry.mood);
        setKickCount(formattedEntry.kickCount || 0);
        setIsShared(formattedEntry.isShared || false);
        setSharedWithGroups(foundEntry.sharedWithGroups || []);
        setTitle(formattedEntry.title);
        setContent(formattedEntry.content);
        setMedia(formattedEntry.media || []);
        setIsPartnerEntry(false);
      } else {
        toast({
          title: "Error",
          description: "Journal entry not found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    if (isGuestMode && isShared) {
      setIsShared(false);
      if (id) {
        updateSharing(id, false);
      }
    }
  }, [isGuestMode, isShared, id]);

  const handleToggleFavorite = () => {
    if (!id) return;
    
    const newFavoriteStatus = toggleFavorite(id);
    setIsFavorite(newFavoriteStatus);
    
    toast({
      title: newFavoriteStatus ? "Added to bookmarks" : "Removed from bookmarks",
      description: newFavoriteStatus ? "Entry added to your bookmarks" : "Entry removed from your bookmarks",
    });
  };

  const saveChanges = () => {
    if (!id || !entry) return;
    
    const updatedEntry: JournalEntry = {
      ...entry,
      title: isEditing ? title : entry.title,
      content: isEditing ? content : entry.content,
      media: isEditing ? media : entry.media,
      mood,
      kickCount,
      isShared,
      sharedWithGroups,
      date: entry.date instanceof Date ? entry.date.toISOString() : entry.date,
      favorite: isFavorite
    };
    
    updateEntry(updatedEntry);
    
    setEntry({
      ...updatedEntry,
      date: new Date(updatedEntry.date),
    });
    
    if (isEditing) {
      setIsEditing(false);
    }
    
    toast({
      title: "Changes saved",
      description: "Your journal entry has been updated",
    });
  };

  const handleDeleteEntry = () => {
    if (!id) return;
    
    deleteEntry(id);
    
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been permanently deleted",
    });
    
    navigate('/');
  };

  const cycleMood = () => {
    const moods: MoodType[] = ["happy", "content", "neutral", "sad", "stressed"];
    const currentIndex = moods.indexOf(mood || "neutral");
    const nextIndex = (currentIndex + 1) % moods.length;
    setMood(moods[nextIndex]);
    
    setTimeout(saveChanges, 0);
  };

  const handleSharingChange = (shared: boolean, selectedGroups?: string[]) => {
    if (isGuestMode && shared) {
      toast({
        title: "Sharing unavailable in guest mode",
        description: "Please create an account or log in to share entries with your inner circle.",
        variant: "destructive",
      });
      return;
    }
    
    setIsShared(shared);
    if (selectedGroups) {
      setSharedWithGroups(selectedGroups);
    }
    
    if (id) {
      updateSharing(id, shared, selectedGroups);
    }
    
    if (shared) {
      const groupCount = selectedGroups ? selectedGroups.length : 0;
      toast({
        title: "Entry shared",
        description: `Your entry has been shared with ${groupCount} group(s)`,
      });
    } else {
      toast({
        title: "Entry private",
        description: "Your entry is now private",
      });
    }
  };

  const handleKickCountChange = (count: number) => {
    setKickCount(count);
    
    setTimeout(saveChanges, 0);
  };

  const handleAttachmentsChange = (newMedia: any[]) => {
    setMedia(newMedia);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const renderMedia = () => {
    if (!entry?.media || entry.media.length === 0) return null;

    return (
      <div className="mt-6 mb-6 space-y-4">
        {entry.media.map((item, index) => {
          if (item.type === "photo" || item.type === "gallery") {
            return (
              <div key={index} className="rounded-xl overflow-hidden">
                <img src={item.url} alt={`Attachment ${index + 1}`} className="w-full max-h-80 object-cover" />
              </div>
            );
          }
          if (item.type === "audio") {
            return (
              <AudioPlayer 
                key={index}
                audioUrl={item.url} 
                transcript="Voice recording"
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  const moodColor = mood ? getMoodColor(mood) : "#FAFAFA";

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">Loading entry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-16 md:px-24 lg:px-32" style={{ backgroundColor: moodColor }}>
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            <Bookmark className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-primary stroke-primary' : ''}`} />
          </button>
          
          <button 
            onClick={toggleEditMode}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            <Pencil className={`w-5 h-5 transition-all duration-300 ${isEditing ? 'text-primary' : ''}`} />
          </button>
          
          <button 
            onClick={cycleMood}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            {mood && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full relative z-20 text-foreground" 
                    style={{ backgroundColor: getMoodColor(mood) }}>
                {getMoodEmoji(mood)}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className="animate-fade-in">
        <div className="mb-6">
          {isEditing ? (
            <EntryTitleInput
              title={title}
              setTitle={setTitle}
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-medium tracking-tight">{entry.title}</h1>
              
              {isPartnerEntry ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FileHeart className="w-5 h-5 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shared by Your Partner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : isShared ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FilePenLine className="w-5 h-5 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your Original Entry</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(entry.date, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <AttachmentHandler
            content={content}
            setContent={setContent}
            onAttachmentsChange={handleAttachmentsChange}
            initialAttachments={media}
          />
        ) : (
          <>
            {renderMedia()}
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {entry.content}
              </p>
            </div>
          </>
        )}

        <div className="flex items-stretch justify-between gap-3 my-4">
          <SharingToggle 
            isShared={isShared} 
            onShareChange={handleSharingChange} 
            className="flex-1 h-full"
          />
          
          <BabyKickTracker 
            kickCount={kickCount} 
            onKickCountChange={handleKickCountChange} 
            className="flex-1 h-full"
          />
        </div>
        
        {isShared && !isEditing && id && (
          <InnerCircleInteractions entryId={id} />
        )}
        
        {isEditing ? (
          <div className="mt-6 flex justify-between">
            <button 
              onClick={handleDeleteEntry}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium"
            >
              Delete Entry
            </button>
            
            <button 
              onClick={saveChanges}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium"
            >
              Save Changes
            </button>
          </div>
        ) : null}
      </main>
      
      <BottomBar />
    </div>
  );
};

export default EntryDetail;
