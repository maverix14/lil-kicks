import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";

interface FontSizeProviderProps {
  children: React.ReactNode;
  defaultFontSize?: FontSize;
}

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({
  children,
  defaultFontSize = "medium",
}: FontSizeProviderProps) {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem("fontSize") as FontSize) || defaultFontSize
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous font size classes
    root.classList.remove("text-size-small", "text-size-medium", "text-size-large");
    
    // Add the current font size class
    root.classList.add(`text-size-${fontSize}`);
    
    // Save the font size preference to localStorage
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const value = {
    fontSize,
    setFontSize,
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
