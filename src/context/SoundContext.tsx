import React, { createContext, useContext, useState, useEffect } from "react";

interface SoundProviderProps {
  children: React.ReactNode;
}

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundName: "click" | "success" | "error" | "notification") => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Create audio elements for each sound type
const sounds = {
  click: new Audio("/sounds/click.mp3"),
  success: new Audio("/sounds/success.mp3"),
  error: new Audio("/sounds/error.mp3"),
  notification: new Audio("/sounds/notification.mp3"),
};

// Preload sounds
Object.values(sounds).forEach(audio => {
  audio.load();
  audio.volume = 0.5;
});

export function SoundProvider({ children }: SoundProviderProps) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const playSound = (soundName: "click" | "success" | "error" | "notification") => {
    if (soundEnabled && sounds[soundName]) {
      // Stop and reset the sound first to allow replaying
      const audio = sounds[soundName];
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
