import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard from "@/components/EntryCard";
import { getFavorites, toggleFavorite } from "@/lib/journalStorage";
import { JournalEntry } from "@/lib/journalStorage";
import { useToast } from "@/hooks/use-toast";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get bookmarks from storage when component mounts
    const fetchBookmarks = () => {
      try {
        const favorites = getFavorites();
        setBookmarks(favorites);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast({
          title: "Error",
          description: "Failed to load bookmarks",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();

    // Set up an interval to refresh bookmarks periodically
    const intervalId = setInterval(fetchBookmarks, 2000);
    return () => clearInterval(intervalId);
  }, [toast]);

  // Handle toggling favorite status
  const handleFavoriteToggle = (id: string) => {
    const isFavorite = toggleFavorite(id);
    
    // Update local state to reflect the change
    setBookmarks(prevBookmarks => 
      prevBookmarks.filter(entry => entry.id !== id)
    );
    
    toast({
      title: "Removed from bookmarks",
      description: "Entry has been removed from your bookmarks",
    });
  };

  return (
    <div className="page-container">
      <Header />
      
      <main>
        <h1 className="heading-1 mb-6 animate-slide-down">Bookmarks</h1>
        
        <div className="section-container animate-fade-in">
          <h2 className="section-title">YOUR BOOKMARKS</h2>
          <div className="section-divider"></div>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
            ))}
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((entry, index) => (
              <EntryCard 
                key={entry.id} 
                entry={{
                  ...entry,
                  date: new Date(entry.date), // Convert string date to Date object
                  isPartnerEntry: false
                }}
                className={`animate-scale-in transition-all delay-${index}`}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white/80 dark:bg-white/5 shadow-card p-10 text-center animate-fade-in">
            <p className="text-muted-foreground mb-4">
              You haven't bookmarked any entries yet.
            </p>
            <p className="text-sm">
              Bookmark your favorite entries for quick access by clicking the heart icon.
            </p>
          </div>
        )}
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Bookmarks;
