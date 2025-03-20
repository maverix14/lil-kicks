import React from "react";
import { Link } from "react-router-dom";
import { 
  Bookmark, 
  HeartHandshake, 
  Image, 
  Music, 
  Video, 
  Lock, 
  FilePenLine, 
  FileHeart, 
  Heart, 
  MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLikesForEntry, getCommentsForEntry } from "@/lib/journalStorage";

export interface EntryProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  favorite: boolean;
  media: {
    type: "photo" | "video" | "audio" | "gallery";
    url: string;
  }[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
  sharedWithGroups?: string[];
  isPartnerEntry?: boolean;
}

interface EntryCardProps {
  entry: EntryProps;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  className,
  onFavoriteToggle,
}) => {
  const {
    id,
    title,
    content,
    date,
    favorite,
    media,
    mood,
    isShared,
    isPartnerEntry,
    sharedWithGroups = [],
  } = entry;

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
        return "transparent";
    }
  };

  const renderMediaPreview = () => {
    if (!media || media.length === 0) return null;

    const firstMedia = media[0];

    if (firstMedia.type === "photo") {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3">
          <img src={firstMedia.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <Image className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    if (firstMedia.type === "gallery" && media.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {media.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="relative h-20 rounded-lg overflow-hidden"
            >
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {index === 2 && media.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                  +{media.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (firstMedia.type === "audio" && firstMedia.url) {
      return (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2 mb-3 relative z-10">
          <Music className="w-4 h-4" />
          <span className="text-xs">Audio recording</span>
        </div>
      );
    }

    if (firstMedia.type === "video" && firstMedia.url) {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-black/10 flex items-center justify-center">
          <Video className="w-8 h-8" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const getLikesAndComments = () => {
    if (!isShared || !sharedWithGroups || sharedWithGroups.length === 0) {
      return { likes: 0, comments: 0, breakdown: {} };
    }

    let totalLikes = 0;
    let totalComments = 0;
    const breakdown: Record<string, { likes: number; comments: number }> = {};

    const likes = getLikesForEntry(id);
    const comments = getCommentsForEntry(id);

    totalLikes = likes.length;
    totalComments = comments.length;

    if (sharedWithGroups.includes("partner")) {
      breakdown["Partner"] = { likes: likes.length / 2, comments: comments.length / 2 };
    }
    if (sharedWithGroups.includes("family")) {
      breakdown["Family"] = { likes: likes.length / 2, comments: comments.length / 2 };
    }
    if (sharedWithGroups.includes("friends")) {
      breakdown["Friends"] = { likes: likes.length / 3, comments: comments.length / 3 };
    }
    if (sharedWithGroups.includes("private")) {
      breakdown["Private"] = { likes: likes.length / 4, comments: comments.length / 4 };
    }

    return { likes: totalLikes, comments: totalComments, breakdown };
  };

  const { likes, comments, breakdown } = getLikesAndComments();
  const hasInteractions = likes > 0 || comments > 0;
  const moodColor = getMoodColor(mood);

  const formatBreakdown = () => {
    const parts = [];
    for (const [group, counts] of Object.entries(breakdown)) {
      parts.push(`${group}: ${counts.likes} likes, ${counts.comments} comments`);
    }
    return parts.join('\n');
  };

  return (
    <Link
      to={`/entry/${id}`}
      className={cn(
        "block neo-shadow rounded-xl p-4 transition-all hover:neo-inset animate-fade-in",
        className,
        moodColor && "relative overflow-hidden"
      )}
    >
      {moodColor && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: moodColor, opacity: 0.95 }}
        />
      )}
      {renderMediaPreview()}

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">{title}</h3>
          {isPartnerEntry && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <FileHeart className="w-4 h-4 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shared by Your Partner</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {!isPartnerEntry && isShared && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <FilePenLine className="w-4 h-4 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your Original Entry</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          className="group p-1.5 -mt-1 -mr-1"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-primary stroke-primary" : "group-hover:fill-primary/20"
            )}
          />
        </button>
      </div>

      <p className="text-muted-foreground line-clamp-2 mb-3 text-sm relative z-10">
        {content}
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full glass-morphism flex items-center">
            {isShared ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HeartHandshake className="w-3 h-3 text-primary mr-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Shared Entry</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="w-3 h-3 mr-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Private Entry</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {format(date, "MMM d, yyyy")}
          </span>
          
          {hasInteractions && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1 text-xs">
                    <span>Inner Circle</span>
                    {likes > 0 && <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />{likes}
                    </span>}
                    {comments > 0 && <span className="flex items-center gap-0.5">
                      <MessageSquare className="w-3 h-3" />{comments}
                    </span>}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs whitespace-pre">
                    {Object.keys(breakdown).length > 0 
                      ? formatBreakdown() 
                      : `Likes: ${likes}\nComments: ${comments}`}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {mood && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: getMoodColor(mood) }}>
              {getMoodEmoji(mood)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;
