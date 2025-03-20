import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard, { EntryProps } from "@/components/EntryCard";
import EntryCardSkeleton from "@/components/EntryCardSkeleton";
import AdCard from "@/components/AdCard";
import { getAllEntries, toggleFavorite, JournalEntry } from "@/lib/journalStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [entries, setEntries] = useState<EntryProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isGuestMode } = useAuth();

  // Load entries from localStorage
  useEffect(() => {
    // Small delay to simulate network loading for smoother UX
    const loadEntries = setTimeout(() => {
      try {
        console.log("Loading entries from storage, guest mode:", isGuestMode);
        const storedEntries = getAllEntries();
        console.log("Entries loaded:", storedEntries.length);
        
        // Convert stored entries to EntryProps format
        const formattedEntries: EntryProps[] = storedEntries.map(entry => ({
          ...entry,
          date: new Date(entry.date), // Convert ISO string back to Date object
          isPartnerEntry: false, // In a real app, this would be determined based on user data
        }));
        
        setEntries(formattedEntries);
      } catch (error) {
        console.error('Error loading entries:', error);
        toast({
          title: "Error",
          description: "Failed to load journal entries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 250);
    
    // Setup periodic refresh to catch any updates to entries
    const refreshInterval = setInterval(() => {
      const storedEntries = getAllEntries();
      const formattedEntries: EntryProps[] = storedEntries.map(entry => ({
        ...entry,
        date: new Date(entry.date),
        isPartnerEntry: false,
      }));
      setEntries(formattedEntries);
    }, 5000);
    
    return () => {
      clearTimeout(loadEntries);
      clearInterval(refreshInterval);
    };
  }, [toast, isGuestMode]);

  // Handle toggling favorite status
  const handleFavoriteToggle = (id: string) => {
    const isFavorite = toggleFavorite(id);
    
    // Update local state to reflect the change
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, favorite: isFavorite } : entry
      )
    );
    
    toast({
      title: isFavorite ? "Added to favorites" : "Removed from favorites",
      description: isFavorite 
        ? "Entry added to your favorites" 
        : "Entry removed from your favorites",
    });
  };

  // Render entries with ads interspersed
  const renderEntriesWithAds = () => {
    if (isLoading) {
      return (
        <>
          <EntryCardSkeleton />
          <EntryCardSkeleton />
          <EntryCardSkeleton />
        </>
      );
    }

    if (entries.length === 0) {
      return (
        <div className="text-center py-8 bg-white/80 dark:bg-white/5 rounded-xl shadow-card">
          <p className="text-muted-foreground mb-2">No journal entries yet.</p>
          <p className="text-sm text-muted-foreground">Create your first entry using the + button below!</p>
        </div>
      );
    }

    // Only show ads if there are at least 3 entries
    const shouldShowAds = entries.length >= 3;
    
    return entries.reduce((acc: React.ReactNode[], entry, index) => {
      // Add the entry
      acc.push(
        <EntryCard
          key={entry.id}
          entry={entry}
          className={`animate-scale-in transition-all delay-${index}`}
          onFavoriteToggle={handleFavoriteToggle}
        />
      );
      
      // Add an ad after every 3rd entry (if we have enough entries)
      if (shouldShowAds && (index + 1) % 3 === 0 && index !== entries.length - 1) {
        acc.push(<AdCard key={`ad-${index}`} variant="medium" />);
      }
      
      return acc;
    }, []);
  };

  return (
    <div className="page-container">
      <Header />
      
      <main>
        <h1 className="heading-1 mb-6 animate-slide-down">My Journal</h1>
        
        <div className="section-container animate-fade-in">
          <h2 className="section-title">RECENT ENTRIES</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="space-y-4">
          {renderEntriesWithAds()}
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Index;
